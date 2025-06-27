import serverEnv from "@/env/server";
import { ApifyClient } from "apify-client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.url) {
      return NextResponse.json(
        { error: "Missing URL in request body" },
        { status: 400 }
      );
    }

    const client = new ApifyClient({
      token: serverEnv.APIFY_TOKEN,
    });

    const input = {
      directUrls: [body.url],
      resultsType: "posts",
      resultsLimit: 5,
    };

    const run = await client.actor("apify/instagram-scraper").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    return NextResponse.json({
      message: "URL received successfully",
      items: items,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to scrape Instagram data" },
      { status: 500 }
    );
  }
}
