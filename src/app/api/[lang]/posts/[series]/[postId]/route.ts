import matter from "gray-matter";
import { NextResponse } from "next/server";

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

const getPostByLangAndPostid = async (lang: string, series: string, postId: string) => {
  const postData = await fetch(`${GITHUB_API_URL}/${series}/${postId}_${lang}.mdx`, {
    headers: {
      Authorization: `token ${GITHUB_API_TOKEN}`,
    },
  });
  const encodedMdx = await postData.json();
  const mdx = Buffer.from(encodedMdx.content, "base64").toString("utf-8");
  const content = matter(mdx);
  console.log(content);
  return content;
};

export async function GET(req: Request, context: { params: { lang: string; series: string; postId: string } }) {
  console.log("Requested language:", context.params.lang); // 확인용 로그
  const { lang, series, postId } = context.params;
  const posts = await getPostByLangAndPostid(lang, series, postId);

  if (!posts) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }

  return NextResponse.json(posts);
}
