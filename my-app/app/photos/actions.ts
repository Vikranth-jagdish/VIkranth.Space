"use server";

export interface PinterestPin {
  id: number;
  src: string;
  alt: string;
  link: string;
}

const PINTEREST_RSS_URL =
  "https://www.pinterest.com/unbalanceddiode/my-pictures.rss";

export async function fetchPinterestPhotos(): Promise<PinterestPin[]> {
  try {
    const res = await fetch(PINTEREST_RSS_URL, {
      next: { revalidate: 3600 }, // cache for 1 hour
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Portfolio/1.0)",
      },
    });

    if (!res.ok) {
      throw new Error(`Pinterest RSS feed returned ${res.status}`);
    }

    const xml = await res.text();

    // Parse <item> blocks from the RSS XML
    const items: PinterestPin[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    let id = 1;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];

      // Extract title
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
      const titlePlain = itemXml.match(/<title>(.*?)<\/title>/);
      const alt =
        (titleMatch?.[1] || titlePlain?.[1] || "").trim() || `Photo ${id}`;

      // Extract link
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const link = linkMatch?.[1] || "";

      // Extract image from <description> which contains an <img> tag
      const descMatch = itemXml.match(
        /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/
      );
      const descPlain = itemXml.match(
        /<description>([\s\S]*?)<\/description>/
      );
      // The feed escapes the HTML inside <description>, so decode it before looking for the image.
      const desc = (descMatch?.[1] || descPlain?.[1] || "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&");

      const imgMatch = desc.match(/src=["'](https?:\/\/[^"']+)["']/);
      if (!imgMatch) continue;

      // Upgrade image resolution: replace /236x/ with /736x/ for higher quality
      let src = imgMatch[1];
      src = src.replace(/\/236x\//, "/736x/");

      items.push({ id, src, alt, link });
      id++;
    }

    return items;
  } catch (error) {
    console.error("Failed to fetch Pinterest photos:", error);
    return [];
  }
}
