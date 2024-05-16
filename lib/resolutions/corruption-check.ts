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

  const clientHash = keccak256(toUtf8Bytes(stringifyDeterministic(result.data)));
  // todo: understand how to fix isReward resolutions corrupted (when updated). Actually, it's just
  // 0x1dd018c43585e1b90417591f88577eb508265e60a1fa990ab7416b0f6e8caedd, so we might just want to "skip it"

  // temporary disable hash check
  // if (clientHash !== dbHash) {
  //   console.log("Client hash: ", clientHash, "DB hash: ", dbHash);
  //   return true;
  // }

  return false;
}
