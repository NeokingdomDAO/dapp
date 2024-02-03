import { NextApiRequest, NextApiResponse } from "next";
import { parse } from "node-html-parser";

const GET_EURUSDT_ENDPOINT = "https://api.binance.com/api/v3/avgPrice?symbol=EURUSDT";

export const round = (value: number, decimalPlaces: number) =>
  Number(Math.round(parseFloat(value + "e" + decimalPlaces)) + "e-" + decimalPlaces);

async function getNeokingdomTokenPrice(req: NextApiRequest, res: NextApiResponse) {
  const tokenName = req.query["token-name"] as string;

  try {
    const coinPage = await fetch(`https://coinmarketcap.com/currencies/${tokenName}/`);
    const coinPageText = await coinPage.text();

    const root = parse(coinPageText);

    const descriptionContent = root.querySelector("meta[name='description']")?.getAttribute("content");

    if (!descriptionContent) {
      return res.status(500).json({ error: "no price available" });
    }

    const price = Number(
      descriptionContent.slice(descriptionContent.indexOf("$") + 1, descriptionContent.indexOf("$") + 7),
    );
    const eurUsdt = (await (await fetch(GET_EURUSDT_ENDPOINT)).json())?.price;

    return res.status(200).json({ priceUsd: Number(price), priceEur: round(price / eurUsdt, 4) });
  } catch (error) {
    return res.status(500).json({ error: "no price available" });
  }
}

export default getNeokingdomTokenPrice;
