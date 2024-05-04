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
    console.log("Content uploaded to the DB", hash);
    return hash;
  } catch (err) {
    console.error(err);
    throw new Error("Cannot add resolution");
  }
}
