import 'next-auth'

declare module 'next-auth'{
    interface user{
        _id?:string;
        isVerifiles:boolean;
        isAcceptingMessages?:boolean;
        userName?:string;
    }
}