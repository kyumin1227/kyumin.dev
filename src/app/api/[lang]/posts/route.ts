import matter from "gray-matter";
import { NextResponse } from "next/server";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import remarkToc from "remark-toc";

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

const prettyCodeOptions = {
  theme: "github-dark",
};

const fetchPosts = async (lang: string, series: string, tagsCount: Record<string, number>) => {
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

      const compiledMdx = await unified()
        .use(remarkToc)
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypePrettyCode, { theme: "material-theme" })
        .use(rehypeStringify)
        .process(content.content);

      // "all" 태그의 개수 증가
      tagsCount["all"] = (tagsCount["all"] || 0) + 1;

      // tags 추출 및 개수 증가
      if (content.data.tags && Array.isArray(content.data.tags)) {
        content.data.tags.forEach((tag: string) => {
          tagsCount[tag] = (tagsCount[tag] || 0) + 1; // 태그 개수 증가
        });
      }

      // 클라이언트에 데이터 전송을 위해 Uint8Array 형식인 orig 제거
      return {
        ...(({ orig, ...rest }) => rest)(content),
        path: `${series}/${path}`,
        lang,
        compiledMdx: String(compiledMdx),
      };
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

  const tagsCount: Record<string, number> = {}; // 태그별 개수를 저장할 객체 생성

  // 각 시리즈의 포스트 데이터를 비동기적으로 가져옴
  const posts = await Promise.all(
    seriesData.map(async (series: any) => {
      console.log(series.name);
      const postDatas = await fetchPosts(lang, series.name, tagsCount);

      return { series: series.name, posts: postDatas }; // 시리즈명과 글 데이터를 객체로 반환
    })
  );

  return { posts, tags: tagsCount }; // 모든 시리즈 데이터를 포함한 배열 반환
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
