import { fetchDbPages } from "@/lib/notion";
import { createRcaDropdownItems } from "@/lib/notion";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// Initialize Notion client
const notion: Client = new Client({ auth: process.env.NOTION_SECRET });
const mainDbId: string | undefined = process.env.NOTION_MAIN_DB_ID;

// Define API route handler for GET request
export async function GET() {
  try {
    if (mainDbId === undefined) {
      return new Response(
        JSON.stringify({ message: "Must have a main db Id" }),
        { status: 400 }
      );
    }

    console.log("called");

    const pages = (await fetchDbPages(
      mainDbId,
      notion
    )) as PageObjectResponse[];

    const rcaDropdownItems = createRcaDropdownItems(pages);

    return new Response(JSON.stringify(rcaDropdownItems), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
