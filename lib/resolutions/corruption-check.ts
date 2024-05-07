import { keccak256, toUtf8Bytes } from "ethers/lib/utils";
import stringifyDeterministic from "json-stringify-deterministic";
import { z } from "zod";

import { ResolutionData } from "./validation";

export default function isCorrupted(dbHash: string, data: z.infer<typeof ResolutionData>) {
  // as we have IPFS hashes
  if (dbHash.startsWith("Qm") && dbHash.length === 46) {
    return false;
  }

  const result = ResolutionData.safeParse(data);

  if (!result.success) {
    return true;
  }

  const clientHash = keccak256(toUtf8Bytes(stringifyDeterministic(data)));

  return clientHash !== dbHash;
}
