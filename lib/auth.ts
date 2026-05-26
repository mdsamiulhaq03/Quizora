import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

const clientPromise: Promise<MongoClient> = new Promise((resolve, reject) => {
  if (!process.env.MONGODB_URI) return reject(new Error("MONGODB_URI is not defined"));
  if (!global._mongoClientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  resolve(global._mongoClientPromise);
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    ...(authConfig.providers as []),
    Resend({
      apiKey: process.env.RESEND_API_KEY!,
      from: "noreply@yourdomain.com",
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const { default: dbConnect } = await import("./db");
        const { default: User } = await import("./models/User");
        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user?.password) return null;
        const valid = await bcrypt.compare(credentials.password as string, user.password);
        if (!valid) return null;
        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image ?? null };
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      const { default: dbConnect } = await import("./db");
      const { default: User } = await import("./models/User");
      await dbConnect();
      await User.findOneAndUpdate(
        { email: user.email },
        { $setOnInsert: { onboardingComplete: false, streak: 0, isGuest: false } },
        { upsert: true }
      );
    },
  },
});
