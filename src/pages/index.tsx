import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import MessageForm from "../components/MessageForm";
import Messages from "../components/Messages";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <main>Loading...</main>;
  }

  return (
    <>
      <Head>
        <title>Guestbook</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center">
        <h1 className="pt-4 text-3xl">Guestbook</h1>
        <p>A place for your thoughts</p>
        <div className="pt-10">
          {session ? (
            <>
              <p>Hi {session.user?.name}</p>
              <button onClick={() => signOut()}>Logout</button>
              <div className="pt-6">
                <MessageForm />
              </div>
            </>
          ) : (
            <>
              <button onClick={() => signIn("discord")}>
                Login with Discord
              </button>
            </>
          )}
        </div>
        <div className="pt-10">
          <Messages />
        </div>
      </main>
    </>
  );
};

export default Home;
