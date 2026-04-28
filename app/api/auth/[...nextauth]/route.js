import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import connectDB from "@/db/connectDB";
import UserSchema from "@/models/User"

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email }) {
            if (account.provider == "github" || account.provider == "google") {
                await connectDB();
                const currentUser = await UserSchema.findOne({ email: user.email });
                if (!currentUser) {
                    const newUser = await UserSchema.create({
                        email: user.email,
                        username: user.name,
                        name: user.name,
                        image: user.image,
                        signUp: {
                            name: user.name,
                            email: user.email
                        }
                    })
                }
            }
            return true;
        },
        async session({ session, token, user }) {
            const dbUser = await UserSchema.findOne({ email: session.user.email });
            session.user.name = dbUser.username
            session.user.image = dbUser.image
            return session;
        }
    },
};

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };
