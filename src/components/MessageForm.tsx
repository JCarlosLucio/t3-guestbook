import { useSession } from "next-auth/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

const MessageForm = () => {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const postMessage = trpc.guestbook.postMessage.useMutation();

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
