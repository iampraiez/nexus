import { getDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    try {
      //
      await checkRateLimit(ip, "search", 50000, 600);
    } catch (error) {
      return NextResponse.json(
        { message: "Too many search requests. Please try again later." },
        { status: 429 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");

    const db = await getDB();
    const productsCollection = db.collection("products");

    let query: Record<string, any> = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      // Validate search query: not too long, not empty after trim
      const trimmedSearch = search.trim();
      if (trimmedSearch.length === 0) {
        // Empty search, ignore it
      } else if (trimmedSearch.length > 100) {
        return NextResponse.json(
          { message: "Search query is too long" },
          { status: 400 }
        );
      } else {
        const searchTerms = trimmedSearch.split(/\s+/);
        if (searchTerms.length > 0) {
          query.$and = searchTerms.map((term) => ({
            $or: [
              { name: { $regex: term, $options: "i" } },
              { description: { $regex: term, $options: "i" } },
              { category: { $regex: term, $options: "i" } },
            ],
          }));
        }
      }
    }

    const skip = (page - 1) * limit;
    const total = await productsCollection.countDocuments(query);
    const products = await productsCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json(
      {
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
