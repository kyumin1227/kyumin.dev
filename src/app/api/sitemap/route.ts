import { NextResponse } from "next/server";
import { getPostsSepSeries } from "../getPosts";
import serializePosts from "@/utils/serializedPosts";
import { LangType } from "@/types/posts";

const getData = async (lang: LangType) => {
  const { posts } = await getPostsSepSeries(lang);
  const serializedPosts = serializePosts(posts);
  return serializedPosts;
};

export async function GET() {
  // const baseUrl = "http://localhost:3000";
  const baseUrl = "https://kyumin.dev";

  const urls = [
    {
      loc: ``,
      lastmod: `${new Date().toISOString().split("T")[0]}`,
      changefreq: "daily",
      priority: "1.0",
    },
  ];

  const lang = ["ko", "ja"];

  const posts_all = [...(await getData("ko")), ...(await getData("ja"))];

  urls.push(
    ...posts_all.map((post) => ({
      loc: `/posts/${post.path}`,
      lastmod: new Date(post.data.date).toISOString().split("T")[0],
      changefreq: "weekly",
      priority: "0.8",
    }))
  );

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${urls
        .flatMap((url) =>
          lang.map(
            (language) => `
            <url>
              <loc>${baseUrl}/${language}${url.loc}</loc>
              <lastmod>${url.lastmod}</lastmod>
              <changefreq>${url.changefreq}</changefreq>
              <priority>${url.priority}</priority>
            </url>
          `
          )
        )
        .join("")}
    </urlset>`;

  return new NextResponse(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
