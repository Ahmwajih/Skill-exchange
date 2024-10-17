import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcrypt';
// import GithubProvider from "next-auth/providers/github"
// import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await db();

       
        const user = await User.findOne({ email: credentials.email });
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user._id, email: user.email, role: user.role };
        }
        return null; 
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),


    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET, 
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Send token data to the session
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
