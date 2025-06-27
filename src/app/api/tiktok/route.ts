import serverEnv from "@/env/server";
import { ApifyClient } from "apify-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.username) {
      return NextResponse.json(
        { error: "Missing username in request body" },
        { status: 400 }
      );
    }

    const client = new ApifyClient({
      token: serverEnv.APIFY_TOKEN,
    });

    const input = {
      profiles: [body.username],
    };

    const run = await client
      .actor("clockworks/tiktok-profile-scraper")
      .call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    return NextResponse.json({
      message: "username received successfully",
      items: items,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to scrape TikTok data" },
      { status: 500 }
    );
  }
}
