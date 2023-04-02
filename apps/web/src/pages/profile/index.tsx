import { NextPage } from "next";
import { useSession } from "next-auth/react";
import SignIn from "../sign-in";
import { ChangeEvent, useEffect, useState } from "react";
import {client} from '~/trpc'
// import { z } from "zod";


const profile: NextPage = () => {
    let { data: session } = useSession();
    const [email, setEmail] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value)
    }

    useEffect(()=>{
      console.log(email)
    }, [email])

    const id = session?.user.id!
    return (
      <div className="-mt-20 flex h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-row flex-wrap gap-10 items-end px-8 justify-center">
        <div className="form-control">
            <label className="label">
                <span className="label-text">Your Paypal Account Email</span>
            </label>
            <label className="input-group">
                <span className="text-slate-200 bg-slate-800">Email</span>
                <input type="text" placeholder="info@site.com" defaultValue={email} onChange={(e) => handleInputChange(e)} className="input input-bordered text-slate-200" />
            </label>
        </div>
        <button className="btn btn-accent" onClick={()=>client.user.updatePaypalEmail.mutate({userId: id, paypalEmail: email})}>submit</button>
        </div>
      </div>
    );
  };
  
  export default profile;