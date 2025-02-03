import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { InvalidEmailPasswordError } from "./utils/error"
import { sendRequest } from "./utils/api"
import { IUser } from "./types/next-auth"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers:  [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        lecturer_id: { label: "Lecturer ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const res = await sendRequest<IBackendRes<ILogin>>({
          method: "POST",
          url: "http://localhost:8080/api/v1/auth/login",
          body: {
            ...credentials
          },
        });

        if(res.statusCode === 201) {
          return {
            _id: res.data?.user?._id,
            name: res.data?.user?.lecturer_id,
            role: res.data?.user?.role,
            lecturer: res.data?.user?.lecturer ? {
              full_name: res.data?.user?.lecturer.full_name ?? "N/A",
            } : null,
            access_token: res.data?.access_token
          };
        }else if(+res.statusCode === 401 ){
          throw new InvalidEmailPasswordError();
        }else{
          throw new Error("Internal server error!")
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.user = (user as IUser);
      }
      return token
    },
    async session({ session, token }) {
      if (token?.user) {
        (session.user as IUser) = token.user; // Cập nhật session với thông tin từ token
      }
      return session
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },
})