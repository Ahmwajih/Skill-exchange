import db from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { auth } from "@/lib/firebase";
import { signInWithCredential, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
    await db();
    try {
        const body = await req.json();
        const { email, password, providerId, idToken } = body;

        if (providerId === 'google.com' || providerId === 'github.com') {
            const credential =
                providerId === 'google.com'
                    ? GoogleAuthProvider.credential(idToken)
                    : GithubAuthProvider.credential(idToken);

            const userCredential = await signInWithCredential(auth, credential);
            const firebaseUser = userCredential.user;

            const token = jwt.sign(
                { id: firebaseUser.uid, email: firebaseUser.email },
                JWT_SECRET,
                { expiresIn: '1d' }
            );
            console.log("Firebase user:", firebaseUser);

            const res = NextResponse.json(
                { success: true, token, data: { id: firebaseUser.uid, email: firebaseUser.email }, message: "User logged in successfully" },
                { status: 200 }
            );

            res.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 });
            return res;

        } else {
            const user = await User.findOne({ email });
            if (!user) return NextResponse.json({ success: false, error: 'User does not exist' }, { status: 400 });

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return NextResponse.json({ success: false, error: "Invalid password" }, { status: 400 });

            const token = jwt.sign(
                { id: user._id, email: user.email },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            const res = NextResponse.json(
                { success: true, token, data: { id: user._id, name: user.name, email: user.email, role: user.role }, message: "User logged in successfully" },
                { status: 200 }
            );

            res.cookies.set('token', token, { httpOnly: true, maxAge: 60 * 60 * 24 });
            return res;
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json({ success: false, error: error.message || "Authentication failed" }, { status: 400 });
    }
}