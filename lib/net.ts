export const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    throw { status: res.status, message: data?.message, error: "Error fetching request" };
  }
  return data;
};
