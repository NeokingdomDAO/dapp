import isCorrupted from "@lib/resolutions/corruption-check";

describe.skip("corruption-check", () => {
  test("should return true if the check is not successful", async () => {
    const result = isCorrupted("0xc64ad9f9ebb39687237025f77b8ebfa97070245e7986fb7dc539fabc8e32036e", {
      title: "title-corrupted",
      content: "content",
    });
    expect(result).toBe(true);
  });

  test("should return true if the data is not correct", async () => {
    // @ts-ignore
    const result = isCorrupted("0xc64ad9f9ebb39687237025f77b8ebfa97070245e7986fb7dc539fabc8e32036e", {
      title: "title",
    });
    expect(result).toBe(true);
  });

  test("should return false if the check is successful", async () => {
    const result = isCorrupted("0xc64ad9f9ebb39687237025f77b8ebfa97070245e7986fb7dc539fabc8e32036e", {
      title: "title",
      content: "content",
    });
    expect(result).toBe(false);
  });

  test("should return false if the check is successful, regardless of other properties in the data obj", async () => {
    const result = isCorrupted("0xc64ad9f9ebb39687237025f77b8ebfa97070245e7986fb7dc539fabc8e32036e", {
      title: "title",
      content: "content",
      // @ts-ignore
      // @ts-ignore
      foo: "bar",
    });
    expect(result).toBe(false);
  });

  test("should return false if the hash is not 0x (comes from an IPFS migrated content)", async () => {
    const result = isCorrupted("QmXqjYU2xVwEuc19JpjBkZJKYc9qjDevxaGEseT11UgiiG", {
      title: "title",
      content: "content",
    });
    expect(result).toBe(false);
  });
});
