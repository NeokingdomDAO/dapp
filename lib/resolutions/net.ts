import { keccak256, toUtf8Bytes } from "ethers/lib/utils";
import stringifyDeterministic from "json-stringify-deterministic";

import isCorrupted from "./corruption-check";

export async function addResolution(data: any) {
  try {
    const response = await fetch("/api/resolutions/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const { hash } = await response.json();

    if (isCorrupted(hash, data)) {
      throw new Error("Hashes do not match! Possible data corruption!");
    }

    console.log("Content uploaded to the DB", hash);
    return hash;
  } catch (err) {
    console.error(err);
    throw new Error("Cannot add resolution");
  }
}
