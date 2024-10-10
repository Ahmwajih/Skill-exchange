// create users crud routes in next js 
import { NextRequest, NextResponse } from "next/server"; 
import {dbconfig } from "../../dbconfig";
import { error } from "console";

export async function GET(req: NextRequest, res: NextResponse) {
    const user = await User.find();
    const data = await res.getModelListDetails(User)
    return req.status(200).send({
        error: false,
        data: user,
        message: "User list",
        details: await res.getModelListDetails(User)
    })
  
},

export async function POST(req: NextRequest, res: NextResponse) {
    const user = await User.create(req.body);
    return req.status(200).send({
        error: false,
        data: user,
        message: "User created",
        details: await res.getModelListDetails(User)
    })
},

export async function DELETE (req: NextRequest, res: NextResponse) {
    const id = req.nextUrl.searchParams.get("id");
    const user = await User.findByIdAndDelete(id);
    return req.status(200).send({
        error: false,
        data: user,
        message: "User deleted",
        details: await res.getModelListDetails(User)
    })
}

