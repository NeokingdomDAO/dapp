import { addResolution, getResolution } from "drizzle/db";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

import { sessionOptions } from "@lib/session";

async function sha256(message: string) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);

  // hash the message
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

const ResolutionData = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  isRewards: z.boolean().default(false).optional(),
});

async function createNewResolution(req: NextApiRequest, res: NextApiResponse) {
  const cookie = req.session.cookie;
  const user = req.session.user;
  if (!(cookie && user)) {
    return res.status(401).end();
  }

  const result = ResolutionData.safeParse(req.body);

  if (!req.body || req.method !== "POST" || !result.success) {
    return res.status(400).end();
  }

  try {
    const hash = await sha256(JSON.stringify(result.data));

    const existingResolution = await getResolution(hash);

    if (!existingResolution) {
      await addResolution({
        ...result.data,
        hash,
      });
    } else {
      console.log("Creating a resolution that already exists, returning the hash: ", hash);
    }

    return res.status(200).json({ hash });
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}

export default withIronSessionApiRoute(createNewResolution, sessionOptions);
