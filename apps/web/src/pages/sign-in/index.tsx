import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";

const SignIn: NextPage = () => {
  let { data: session } = useSession();
  return (
    <div className="flex h-screen items-center justify-center bg-slate-950">
      <div>
        <button
          className="rounded-full bg-sky-400 px-6 py-4 text-xl font-semibold text-blue-950 transition-all duration-200 hover:scale-105 hover:bg-sky-500 hover:text-white"
          onClick={() => signIn()}
        >
          Sign In
        </button>
        {session?.user && <h1 className="text-white">{session.user.name}</h1>}
      </div>
    </div>
  );
};

export default SignIn;
