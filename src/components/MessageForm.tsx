import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const MessageForm = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const utils = trpc.useContext();

  const postMessage = trpc.guestbook.postMessage.useMutation({
    onMutate: (newMessage) => {
      utils.guestbook.getAll.cancel();
      const previousMessages = utils.guestbook.getAll.getData();

      // Optimistically update to the new value
      if (previousMessages) {
        utils.guestbook.getAll.setData(undefined, [
          newMessage,
          ...previousMessages,
        ]);
      }

      return { previousMessages };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (error, newMessage, ctx) => {
      if (ctx?.previousMessages) {
        utils.guestbook.getAll.setData(undefined, ctx.previousMessages);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      utils.guestbook.getAll.invalidate();
    },
  });

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();

        if (session !== null) {
          postMessage.mutate({
            name: session.user?.name as string,
            message,
          });
        }
        setMessage("");
      }}
    >
      <input
        className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
        type="text"
        value={message}
        placeholder="Your message..."
        minLength={2}
        maxLength={100}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default MessageForm;
