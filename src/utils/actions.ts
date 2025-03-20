'use server'
import {signIn} from "@/auth";
import { InactiveAccountError, InvalidPasswordError, InvalidUserNameError } from "./error";

export async function authenticate(lecturer_id: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: lecturer_id,
            password: password,
            //callbackUrl: "/",
            redirect: false,
        })
        return r
    } catch (error) {
        if(error instanceof InvalidUserNameError){
            return {
                error: (error as any).type,
                code: 1
            }
        }else if(error instanceof InvalidPasswordError){
            return {
                error: (error as any).type,
                code: 2
            }
        }else{
            return {
                error: "Internal server error",
                code: 0
            }
        }
    }
}