import { NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;

export async function GET(request: Request) {
  if (request.method !== "GET") return;
  try {
    const response = await fetch(`${BASE_URL}/v1/fiat/map`, {
      headers: {
        "X-CMC_PRO_API_KEY": `${API_KEY}`,
      },
    });

    const result = await response.json();
    if (result.status.error_code === 0) {
      return NextResponse.json({ message: result.data });
    }
  } catch (error: any) {
    console.log(error.status.message);
  }
}
