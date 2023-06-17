import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { type ChangeEvent, useState } from "react";
import { api } from "~/trpc";

const Profile: NextPage = () => {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");

  const { mutate } = api.paypal.updatePaypalEmail.useMutation();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const id = session?.user.id;

  if (!id) return <div>not logged in</div>;
  return (
    <div className="-mt-20 flex h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-row flex-wrap items-end justify-center gap-10 px-8">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Your Paypal Account Email</span>
          </label>
          <label className="input-group">
            <span className="bg-slate-800 text-slate-200">Email</span>
            <input
              type="text"
              placeholder="info@site.com"
              defaultValue={email}
              onChange={(e) => handleInputChange(e)}
              className="input-bordered input text-slate-200"
            />
          </label>
        </div>
        <button
          className="btn-accent btn"
          onClick={() =>
            mutate({
              userID: id,
              paypalEmail: email,
            })
          }
        >
          submit
        </button>
      </div>
    </div>
  );
};

export default Profile;
