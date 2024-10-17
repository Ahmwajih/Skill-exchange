// import { NextResponse } from 'next/server';
// import db from '@/lib/mongodb';
// import Token from '@/models/Token';

// export async function GET() {
//   await db();

//   try {
//     const token = await Token.find({});
//     return NextResponse.json({ success: true, data: token });
//   } catch (error) {
//     return NextResponse.json({ success: false, error }, { status: 400 });
//   }
// }

// export async function POST(req: Request) {
//   await db();

//   try {
//     const body = await req.json();
//     const token = await Token.create(body);
//     return NextResponse.json({ success: true, data: token }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ success: false, error }, { status: 400 });
//   }
// }