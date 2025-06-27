"use client";

import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [items, setItems] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const url = formData.get("url");

    try {
      const res = await fetch("/api/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) setResponse(data.error || "Failed to fetch");

      setResponse(data.message || "Success");
      console.log("Response data:", data.items);
      setItems(data.items || []);
    } catch (err) {
      setResponse(`Something went wrong. \nError: ${err}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
      {items.length === 0 && (
        <div className="w-full max-w-xl rounded-xl shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 space-y-6 border border-gray-700">
          <h1 className="text-3xl font-bold text-center text-white">
            🔗 Submit a URL
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Website URL
            </label>
            <input
              id="url"
              name="url"
              type="url"
              required
              placeholder="https://example.com"
              className="w-full px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit URL"}
            </button>
          </form>

          {response && (
            <div className="text-center text-sm text-gray-400">
              Response:{" "}
              <span className="font-medium text-white">{response}</span>
            </div>
          )}
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Instagram Posts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => {
              const imageUrl =
                item.images?.[0] ||
                item.displayUrl ||
                "https://via.placeholder.com/400";
              const formattedDate = new Date(item.timestamp).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );

              return (
                <div
                  key={item.id || idx}
                  className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={imageUrl}
                    alt={item.alt || "Instagram post image"}
                    className="w-full h-60 object-cover"
                  />

                  <div className="p-4 space-y-2">
                    <p className="text-sm text-gray-400">{formattedDate}</p>

                    <p className="text-white text-sm line-clamp-5">
                      {item.caption || "No caption"}
                    </p>

                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
                      <span>❤️ {item.likesCount}</span>
                      <span>💬 {item.commentsCount}</span>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center mt-3 text-sm font-medium text-purple-400 hover:text-purple-300"
                    >
                      View on Instagram
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}
