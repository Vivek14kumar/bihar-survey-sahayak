import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../utils/dbConnect";
import User from "../../models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email, Mobile, or ID", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Please enter your credentials.");
        }

        const user = await User.findOne({
          $or: [
            { email: credentials.identifier },
            { mobileNumber: credentials.identifier },
            { userId: credentials.identifier }
          ]
        });

        if (!user) {
          throw new Error("No user found with these details.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }

        // RETURN BLOCK FIX:
        return {
          id: user._id.toString(),
          userId: user.userId,
          name: user.ownerName,
          email: user.email,
          userType: user.userType, 
          role: user.role, // <-- ADD THIS LINE! Map userType to role.
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // This will now correctly grab userType
        token.userId = user.userId;
        token.userType = user.userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role; 
        session.user.userId = token.userId;
        session.user.userType = token.userType;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };