"use client";

import SocialTabs from "@/components/SocialTabs";
import { extractTK, post } from "@/utils";
import { useState } from "react";
import { pl } from "zod/v4/locales";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState([""]);

  const [response, setResponse] = useState<string | null>(null);
  const [items, setItems] = useState<any[][]>([]);

  const handleAddInput = () => {
    setInputs((prev) => [...prev, ""]);
  };

  const handleRemoveInput = (index: number) => {
    setInputs((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleInputChange = (index: number, value: string) => {
    setInputs((prev) => prev.map((val, idx) => (idx === index ? value : val)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      //remove empty inputs and replace tiktok urls with usernames
      const updatedInputs: string[] = inputs
        .filter((url) => url.trim() !== "")
        .map((url, idx) => {
          if (!url.includes("tiktok")) {
            console.log("detected instagram url");
            return url;
          }
          const username = extractTK(url);
          console.log("detected tiktok url:", username);
          if (!username)
            throw new Error(`Invalid TikTok URL at Input # ${idx + 1}`);
          return username;
        });

      let promises: Promise<{ data: any; error: string | null }>[] = [];

      updatedInputs.forEach((url, idx) => {
        if (url.includes("instagram")) {
          console.log("pushing instagram promise for url:", url);
          promises.push(post("/api/instagram", url));
        } else {
          console.log("pushing tiktok promise for username :", url);
          promises.push(post("/api/tiktok", url));
        }
      });

      const results = await Promise.all(promises);

      const newItems: any[][] = [];

      results.forEach((result, idx) => {
        const { data, error } = result;
        if (error) {
          setResponse(error);
          return;
        }
        if (!data) {
          setResponse("Failed to fetch");
          return;
        }
        setResponse(data.message || "Success");
        newItems.push(data.items || []);
      });
      setItems((prev) => [...prev, ...newItems]);
      console.log("Response data:", newItems);
    } catch (err) {
      setResponse(`Something went wrong. \nError: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center p-6">
      {items.length === 0 && (
        <div className="w-full max-w-xl rounded-xl shadow-xl bg-gradient-to-br from-zinc-900 to-gray-800 p-8 space-y-6 border border-gray-700">
          <div>
            <h1 className="text-3xl font-medium  text-white mb-2">
              Track Accounts
            </h1>
            <p>Add social media accounts you want to track</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {inputs.map((value, idx) => (
              <div key={idx} className="flex flex-row space-x-4 items-center">
                <input
                  type="url"
                  value={value}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  required
                  placeholder={`https://example-${idx}.com`}
                  className="w-full px-4 py-3 rounded-lg  text-white bg-gray-900 border border-white/70 outline-none"
                />
                {inputs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveInput(idx)}
                    className="bg-gray-900 border border-white/70 text-white h-10 w-12 rounded-full"
                  >
                    -
                  </button>
                )}
              </div>
            ))}

            <div className="flex flex-row space-x-4 pt-4">
              <button
                onClick={handleAddInput}
                type="button"
                disabled={loading}
                className="w-full bg-gradient-to-br from-zinc-900 to-gray-800 border border-white/70 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Add Account
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-zinc-900 to-gray-800 border border-white/70 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
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
        <SocialTabs
          dataByAccount={{
            Tiktok: {
              platform: "tiktok",
              posts: items[0],
            },
            Instagram: {
              platform: "instagram",
              posts: items[1] || [],
            },
          }}
        />
      )}
    </main>
  );
}
