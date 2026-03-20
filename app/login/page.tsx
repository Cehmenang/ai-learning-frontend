"use client"

import { googleLoginHandler, loginSubmitHandler } from "@/action/user";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import { redirect } from "next/navigation";

type LoginType = {
    username: string,
    password: string
}

export default function Login(){
    const { register, handleSubmit, formState: { errors } } = useForm<LoginType>()

    return (
        <div className="main h-svh flex justify-center items-center">

        <form onSubmit={handleSubmit(loginSubmitHandler)} className="flex flex-col gap-4 w-full max-w-sm mx-auto p-10 rounded-3xl">
            <h1 className="text-[32px] font-extrabold">Login</h1>
            <input placeholder="Masukkan Username" {...register("username", { required: true })}/>
            <input placeholder="Masukkan Password" {...register("password", { required: true, minLength: 6 })}/>
            <GoogleLogin onSuccess={async (credential)=>{
                const response = await googleLoginHandler(credential)
                response.status == 200 && redirect('/')
            }}/>
            <button type="submit">Login</button>
        </form>

        </div>
    )
}