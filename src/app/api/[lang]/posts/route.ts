import matter from "gray-matter";
import { NextResponse } from "next/server";

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

const fetchPosts = async (lang: string, series: string) => {
  const postsData = await fetch(`${GITHUB_API_URL}/${series}`, {
    headers: {
      Authorization: `token ${GITHUB_API_TOKEN}`,
    },
  });
  const posts: any[] = [];

  const data = await postsData.json();
  const postPromises = data
    .filter((post: any) => post.name.endsWith(`_${lang}.mdx`))
    .map(async (post: any) => {
      console.log(post.name);
      const path = post.name.replace(`_${lang}.mdx`, ""); // `_ko.mdx` 또는 `_ja.mdx` 제거
      const encodedMdxResponse = await fetch(post.url, {
        headers: {
          Authorization: `token ${GITHUB_API_TOKEN}`,
        },
      });
      const encodedMdx = await encodedMdxResponse.json();
      const mdx = Buffer.from(encodedMdx.content, "base64").toString("utf-8");
      const content = matter(mdx);
      return { ...content, path: `${series}/${path}` }; // map 내부에서 데이터를 반환
    });

  const resolvedPosts = await Promise.all(postPromises);
  posts.push(...resolvedPosts);
  return posts; // posts 배열 반환
};

/**
 * series 별로 구분한 글 목록
 * @param lang - 언어
 * @returns
 */
export const getPostsSepSeries = async (lang: string) => {
  if (!GITHUB_API_URL) {
    throw new Error("GITHUB_API_URL is not defined");
  }

  const seriesResponse = await fetch(GITHUB_API_URL, {
    headers: {
      Authorization: `token ${GITHUB_API_TOKEN}`,
    },
  });
  const seriesData = await seriesResponse.json();

  // 각 시리즈의 포스트 데이터를 비동기적으로 가져옴
  const posts = await Promise.all(
    seriesData.map(async (series: any) => {
      console.log(series.name);
      const postDatas = await fetchPosts(lang, series.name);

      return { series: series.name, posts: postDatas }; // 시리즈명과 글 데이터를 객체로 반환
    })
  );

  return posts; // 모든 시리즈 데이터를 포함한 배열 반환
};

export async function GET(req: Request, context: { params: { lang: string } }) {
  console.log("Requested language:", context.params.lang); // 확인용 로그
  const { lang } = context.params;
  const posts = await getPostsSepSeries(lang);

  if (!posts) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }

  return NextResponse.json(posts);
}
