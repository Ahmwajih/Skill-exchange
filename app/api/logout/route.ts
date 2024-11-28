import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/firebase";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token");

        if (!token) {
            return NextResponse.json(
                { message: "No token found. You are already logged out.", success: false },
                { status: 400 }
            );
        }

        await auth.signOut(); // Ensure this does not throw an error

        const response = NextResponse.json(
            { message: "Logout successful.", success: true }
        );

        response.cookies.set("token", "", {
            httpOnly: true,
            path: "/",
            expires: new Date(0),
        });

        return response;
    } catch (error) {
        console.error("Logout error:", error); // Log the error for debugging
        return NextResponse.json(
            { message: "An error occurred during logout.", error: error.message },
            { status: 500 }
        );
    }
}