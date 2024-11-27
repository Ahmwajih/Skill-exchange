import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        // Check if the token cookie exists
        const token = req.cookies.get("token");

        if (!token) {
            return NextResponse.json(
                {
                    message: "No token found. You are already logged out.",
                    success: false,
                },
                { status: 400 }
            );
        }

        // Create a response for successful logout
        const response = NextResponse.json(
            {
                message: "Logout successful.",
                success: true,
            }
        );

        // Clear the token cookie
        response.cookies.set("token", "", {
            httpOnly: true,
            path: "/", // Ensure the path matches where the cookie was set
            expires: new Date(0), // Expire immediately
        });

        return response;
    } catch (error: any) {
        // Handle unexpected errors
        return NextResponse.json(
            { 
                message: "An error occurred during logout.", 
                error: error.message 
            },
            { status: 500 }
        );
    }
}
