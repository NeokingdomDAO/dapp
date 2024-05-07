import isCorrupted from "@lib/resolutions/corruption-check";

describe.only("corruption-check", () => {
  test("returns true if the check is not successful", async () => {
    const result = isCorrupted("0xc64ad9f9ebb39687237025f77b8ebfa97070245e7986fb7dc539fabc8e32036e", {
      title: "title-corrupted",
      content: "content",
      isRewards: true,
    });
    expect(result).toBe(true);
  });

  test("returns true if the data is not correct", async () => {
    // @ts-ignore
    const result = isCorrupted("0xc64ad9f9ebb39687237025f77b8ebfa97070245e7986fb7dc539fabc8e32036e", {
      title: "title",
      isRewards: true,
    });
    expect(result).toBe(true);
  });

  test("returns false if the check is successful", async () => {
    const result = isCorrupted("0xc64ad9f9ebb39687237025f77b8ebfa97070245e7986fb7dc539fabc8e32036e", {
      title: "title",
      content: "content",
      isRewards: true,
    });
    expect(result).toBe(false);
  });

  test("returns false if the hash is not 0x (comes from an IPFS migrated content)", async () => {
    const result = isCorrupted("QmXqjYU2xVwEuc19JpjBkZJKYc9qjDevxaGEseT11UgiiG", {
      title: "title",
      content: "content",
      isRewards: true,
    });
    expect(result).toBe(false);
  });
});
