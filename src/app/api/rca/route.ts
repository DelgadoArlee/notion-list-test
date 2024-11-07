import { fetchDbPages } from "@/lib/notion";
import { createRcaDropdownItems } from "@/lib/notion";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion: Client = new Client({ auth: process.env.NOTION_SECRET });
const mainDbId: string | undefined = process.env.NOTION_MAIN_DB_ID;
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;

export const OPTIONS = async (request: Request) => {
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
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin || "",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
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
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

    if (mainDbId === undefined) {
      return new Response(
        JSON.stringify({ message: "Must have a main db Id" }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": origin || "",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    const pages = (await fetchDbPages(
      mainDbId,
      notion
    )) as PageObjectResponse[];

    const rcaDropdownItems = createRcaDropdownItems(pages);

    return new Response(JSON.stringify(rcaDropdownItems), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": origin || "",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
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
          "Access-Control-Allow-Origin": request.headers.get("Origin") || "",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
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

    const isAllowedOrigin = allowedOrigins.includes(origin || "");

    if (!isAllowedOrigin) {
      return new Response(JSON.stringify({ message: "Origin not allowed" }), {
        status: 403,
        headers: {
          "Access-Control-Allow-Origin": origin || "",
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
