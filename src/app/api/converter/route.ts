import { NextResponse } from "next/server";

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
let neededCurrency;

export async function GET(request: Request) {
  if (request.method !== "GET") return;

  const { searchParams } = new URL(request.url);

  const amount = searchParams.get("amount");
  const symbol = searchParams.get("symbol");
  const convert = searchParams.get("convert");

  if (!amount || !symbol || !convert) {
    return NextResponse.json({ message: "Value Missing" });
  }

  let numericalVal;
  if (amount) {
    numericalVal = parseInt(amount);
  }

  try {
    const response = await fetch(
      `${BASE_URL}/v2/tools/price-conversion?amount=${numericalVal}&symbol=${symbol}&convert=USDT`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": `${API_KEY}`,
        },
      }
    );
    const result = await response.json();
    if (result.status.error_code !== 0) {
      return NextResponse.json({ message: "Conversion Failed" });
    }
    const usdtVal = result.data[0].quote.USDT.price;

    try {
      const resp = await fetch(
        `${BASE_URL}/v2/tools/price-conversion?amount=${usdtVal}&symbol=USDT&convert=${convert}`,
        {
          headers: {
            "X-CMC_PRO_API_KEY": `${API_KEY}`,
          },
        }
      );
      const res = await resp.json();
      neededCurrency = convert;
      if (res.status.error_code === 0) {
        const neededValue = res.data[0].quote[neededCurrency].price;
        return NextResponse.json({ message: neededValue });
      }
    } catch (error) {
      return NextResponse.json({ message: "Conversion Failed" });
    }
  } catch (error: any) {
    return NextResponse.json({ message: "Conversion Failed" });
  }
}
