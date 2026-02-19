import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bihar_survey");

    const feedbacks = await db
      .collection("feedbacks")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Serialize ObjectId and Date
    const serialized = feedbacks.map((fb) => ({
      _id: fb._id.toString(),
      name: fb.name,
      email: fb.email,
      message: fb.message,
      createdAt: fb.createdAt.toISOString(),
    }));

    return new Response(JSON.stringify(serialized), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Error fetching feedbacks" }), {
      status: 500,
    });
  }
}
