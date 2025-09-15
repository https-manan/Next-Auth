import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import mongoose from "mongoose";
import User from "@/app/model/UserModel";
import bcrypt from 'bcrypt'

const dbconnect = async ()=>{
   await mongoose.connect(process.env.MONGODB_URL ?? "");
}



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        Email: { label: "Email", type: "text" },
        password: { label: "Password", type: "****" },
      },
      async authorize(credential:any,req):Promise<any>{
        await dbconnect();
        try {
            const user = await User.findOne({
                $or:[
                    {email:credential.identifier},
                    {username:credential.identifier}
                ]
            })
            if(!user){
                throw new Error('No user found with this Email')
            }
            const isPasswordCorrect = await bcrypt.compare(credential.password,user.password);
            if(isPasswordCorrect){
                return user
            }else{
                throw new Error('Incorrect password')
            }
        } catch (error) {
            return error;
        }
      }
    }),
  ],
  pages:{
    signIn:'/sign-in'
  },
  session:{
    strategy:'jwt'
  },
  secret:process.env.NEXTAUTH_SECRET
};
