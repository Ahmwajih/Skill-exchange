import db from "@/lib/db";
import Deal from "@/models/Deal";

export async function GET(req, { params }) {
  await db();

  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Deal ID is required" },
      { status: 400 }
    );
  }

  try {
    const deal = await Deal.findById(id)
      .populate("seekerId", "name email photo") 
      .populate("providerId", "name email photo"); 

    if (!deal) {
      return NextResponse.json(
        { success: false, error: "Deal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: deal },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { success: false, error: "Error fetching deal" },
      { status: 500 }
    );
  }
}
