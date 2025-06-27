import { extractTK } from ".";

describe("extractTK", () => {
  it("should extract TikTok username from a valid URL", () => {
    const url = "https://www.tiktok.com/@edmento.org";
    const result = extractTK(url);
    expect(result).toBe("edmento.org");
  });

  it("should return null for an invalid URL", () => {
    const url = "https://www.example.com/not-a-tiktok-url";
    const result = extractTK(url);
    expect(result).toBeNull();
  });

  it("should return null for a URL without a TikTok username", () => {
    const url = "https://www.tiktok.com/some/other/path";
    const result = extractTK(url);
    expect(result).toBeNull();
  });

  it("should handle URLs with query parameters", () => {
    const url = "https://www.tiktok.com/@edmento.org?some=query";
    const result = extractTK(url);
    expect(result).toBe("edmento.org");
  });

  it("should handle URLs with trailing slashes", () => {
    const url = "https://www.tiktok.com/@edmento.org/";
    const result = extractTK(url);
    expect(result).toBe("edmento.org");
  });
});
