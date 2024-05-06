import { keccak256, toUtf8Bytes } from "ethers/lib/utils";
import stringifyDeterministic from "json-stringify-deterministic";
import { ResolutionData } from "pages/api/resolutions/new";
import { z } from "zod";

export default function isCorrupted(dbHash: string, data: z.infer<typeof ResolutionData>) {
  const result = ResolutionData.safeParse(data);

  if (!result.success) {
    return false;
  }

  const clientHash = keccak256(toUtf8Bytes(stringifyDeterministic(result.data)));

  return clientHash !== dbHash;
}
