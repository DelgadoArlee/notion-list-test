import { fetchDbPages } from "@/lib/notion";
import { createRcaDropdownItems } from "@/lib/notion";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

// Initialize Notion client
const notion: Client = new Client({ auth: process.env.NOTION_SECRET });
const mainDbId: string | undefined = process.env.NOTION_MAIN_DB_ID;
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;

export const OPTIONS = async (request: Request) => {
  console.log("Received OPTIONS request"); // Debugging log

  try {
    if (allowedOriginsEnv === undefined) {
      throw new Error("Must have ALLOWED_ORIGINS env");
    }

    const allowedOrigins = allowedOriginsEnv.split(",");

    const origin = request.headers.get("Origin");

    const isAllowedOrigin = allowedOrigins.includes(origin || "");

    if (!isAllowedOrigin) {
      return new Response(JSON.stringify({ message: "Origin not allowed" }), {
        status: 403,
        headers: {
          "Access-Control-Allow-Origin": origin || "",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization", // Include any additional headers here
        },
      });
    }

    // If the origin is allowed, return a 204 No Content response
    return new Response(null, {
      status: 204, // No Content
      headers: {
        "Access-Control-Allow-Origin": origin || "",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization", // Include any additional headers here
        "Access-Control-Allow-Credentials": "true", // Allow cookies if necessary
      },
    });
  } catch (error) {
    console.error("Error in OPTIONS request:", error);

    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": request.headers.get("Origin") || "",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization", // Include any additional headers here
        },
      }
    );
  }
};

export const GET = async (request: Request) => {
  try {
    if (allowedOriginsEnv === undefined) {
      throw new Error("Must have ALLOWED_ORIGINS env");
    }

    const allowedOrigins = allowedOriginsEnv?.split(",");

    const origin = request.headers.get("Origin");

    const isAllowedOrigin = allowedOrigins.includes(origin || "");

    if (!isAllowedOrigin) {
      return new Response(JSON.stringify({ message: "Origin not allowed" }), {
        status: 403,
        headers: {
          "Access-Control-Allow-Origin": origin || "",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // If there is no mainDbId, return a 400 error
    if (mainDbId === undefined) {
      return new Response(
        JSON.stringify({ message: "Must have a main db Id" }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": origin || "", // Dynamically set the allowed origin
            "Access-Control-Allow-Methods": "GET", // Allow only GET requests
            "Access-Control-Allow-Headers": "Content-Type", // Allow Content-Type header
          },
        }
      );
    }

    // Fetch the pages from the database
    const pages = (await fetchDbPages(
      mainDbId,
      notion
    )) as PageObjectResponse[];

    // Create the dropdown items
    const rcaDropdownItems = createRcaDropdownItems(pages);

    // Return the response
    return new Response(JSON.stringify(rcaDropdownItems), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin || "", // Dynamically set the allowed origin
        "Access-Control-Allow-Methods": "GET", // Allow only GET requests
        "Access-Control-Allow-Headers": "Content-Type", // Allow Content-Type header
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": request.headers.get("Origin") || "", // Dynamically set the allowed origin
          "Access-Control-Allow-Methods": "GET", // Allow only GET requests
          "Access-Control-Allow-Headers": "Content-Type", // Allow Content-Type header
        },
      }
    );
  }
};

export const POST = async (req: Request) => {
  try {
    if (allowedOriginsEnv === undefined) {
      throw new Error("Must have ALLOWED_ORIGINS env");
    }

    const allowedOrigins = allowedOriginsEnv?.split(",");

    const origin = req.headers.get("Origin");

    console.log(origin);

    const isAllowedOrigin = allowedOrigins.includes(origin || "");

    if (!isAllowedOrigin) {
      return new Response(JSON.stringify({ message: "Origin not allowed" }), {
        status: 403,
        headers: {
          "Access-Control-Allow-Origin": origin || "", // Set the origin dynamically
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const { id, name } = await req.json();

    return new Response(
      JSON.stringify({
        id,
        name,
        message: "Data successfully received",
      }),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": origin || "",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": req.headers.get("Origin") || "",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
};
