import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import readingTime from "reading-time";

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

export const fetchPostAndCompileMdx = async (
  series: string,
  post: string,
  lang: string,
  tagsCount?: Record<string, number> | null
): Promise<{ content: any; path: string; compiledMdx: any; data: any; lang: string; readingTime: string }> => {
  const data = await fetch(`${GITHUB_API_URL}/${series}/${post}_${lang}.mdx`, {
    headers: {
      Authorization: `token ${GITHUB_API_TOKEN}`,
    },
  });

  const encodedMdx: iPost = await data.json();

  console.log(encodedMdx);

  const mdx = Buffer.from(encodedMdx.content, "base64").toString("utf-8");
  const content = matter(mdx);

  const compiledMdx = await unified()
    .use(remarkToc, { maxDepth: 3 })
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypePrettyCode, { theme: "github-dark" })
    .use(rehypeStringify)
    .use(rehypeSlug)
    .process(content.content);

  const { text } = readingTime(content.content);

  if (tagsCount) {
    // tags가 있는 경우 태그 추출 및 개수 증가
    if (content.data.tags && Array.isArray(content.data.tags)) {
      content.data.tags.forEach((tag: string) => {
        tagsCount[tag] = (tagsCount[tag] || 0) + 1; // 태그 개수 증가
      });
    }
  }

  return {
    ...(({ orig, ...rest }) => rest)(content),
    lang,
    path: `${series}/${post}`,
    compiledMdx: String(compiledMdx),
    readingTime: text,
  };
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
      const path = post.name.replace(`_${lang}.mdx`, ""); // `_ko.mdx` 또는 `_ja.mdx` 제거
      tagsCount["all"] = (tagsCount["all"] || 0) + 1;

      const postData = await fetchPostAndCompileMdx(series, post.name.replace(`_${lang}.mdx`, ""), lang, tagsCount);
      console.log(postData);

      // 클라이언트에 데이터 전송을 위해 Uint8Array 형식인 orig 제거
      return {
        content: postData.content,
        path: `${series}/${path}`,
        data: postData.data,
        lang,
        compiledMdx: String(postData.compiledMdx),
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
