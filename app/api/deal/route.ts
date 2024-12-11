import { NextResponse, NextRequest } from "next/server";
import db from "@/lib/db";
import User from "@/models/User";
import Deal from "@/models/Deal";

export async function POST(req: NextRequest) {
  await db();

  try {
    const body = await req.json();
    const { providerId, seekerId, timeFrame, skillOffered, numberOfSessions, selectedAvailabilities } = body;
    
    // Validate the request body
    if (!providerId || !seekerId) {
      return NextResponse.json({ success: false, error: " no provider or seeker" }, { status: 400 });
    }

    const provider = await User.findById(providerId);
    const seeker = await User.findById(seekerId);

    if (!provider || !seeker) {
      return NextResponse.json({ success: false, error: "Provider or seeker not found" }, { status: 404 });
    }

    const newDeal = {
      providerId,
      seekerId,
      timeFrame,
      skillOffered,
      numberOfSessions,
      selectedAvailabilities,
      status: 'pending',
    };

    const deal = await Deal.create(newDeal);

    return NextResponse.json(
      {
        success: true,
        data: deal,
        message: "Deal created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating deal:", error);
    return NextResponse.json(
      { success: false, error: "Error creating deal" },
      { status: 500 }
    );
  }
}