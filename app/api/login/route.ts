import db from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function POST (req: NextRequest) {
    await db();
    try {
        const body = await req.json();
        const { email, password } = body;
        const user = await User.findOne({email});
        if(!user) {
            return NextResponse.json({ success: false, error: 'User doens not found or exist' }, { status: 400 });
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1d'});
        const res = NextResponse.json({success: true, token, data:{id: user._id, name:user.name, email: user.email, role: user.role}, message:"User logged in successfully"}, {status: 200})
        res.cookies.set('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 
        })
        return res;
    }catch(error) {
        return NextResponse.json({ success: false, error }, { status: 400 });
    }
}