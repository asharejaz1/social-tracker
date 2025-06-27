export const extractTK = (rawUrl: string): string | null => {
  try {
    const url = new URL(rawUrl);
    const pathname = url.pathname;
    if (!pathname.startsWith("/@")) return null;
    return pathname.slice(2).split("/")[0];
  } catch (error) {
    return null;
  }
};

export const post = async (
  endpointURL: string,
  bodyData: string
): Promise<{ data: any; error: string | null }> => {
  const res = await fetch(endpointURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: bodyData }),
  });

  const data = await res.json();
  if (!res.ok) return { data: null, error: data.error || "Failed to fetch" };
  return { data, error: null };
};
