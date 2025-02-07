import matter from "gray-matter";
import remarkParse from "remark-parse";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import readingTime from "reading-time";
import { serialize } from "next-mdx-remote/serialize";
import { iPost, iToc, LangType } from "@/types/posts";
import extractToc from "@/utils/extractToc";

const GITHUB_API_URL = `https://api.github.com/repos/${process.env.GITHUB_USER_ID}/${process.env.GITHUB_REPOSITORY_NAME}/contents/${process.env.POST_PATH}`;
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

const cache = new Map<string, any>(); // 메모리 캐시

const appendTags = (tagsCount: Record<string, number>, tags: string[]) => {
  tags.forEach((tag: string) => {
    tagsCount[tag] = (tagsCount[tag] || 0) + 1; // 태그 개수 증가
  });
};

/**
 * 특정 post 요청 시 mdx 컴파일 후 반환
 * @param series
 * @param post
 * @param lang
 * @param tagsCount
 * @returns
 */
export const fetchPostAndCompileMdx = async (
  series: string,
  post: string,
  lang: LangType,
  tagsCount?: Record<string, number> | null
): Promise<{
  content: any;
  path: string;
  compiledMdx: any;
  data: any;
  lang: LangType;
  readingTime: string;
  toc: iToc[];
} | null> => {
  const cacheName = `${series}_${post}_${lang}`;

  if (cache.has(cacheName)) {
    const data = cache.get(cacheName);
    if (!data) {
      return null;
    }

    if (tagsCount) {
      appendTags(tagsCount, data.data.tags);
    }
    return data;
  }

  const data = await fetch(`${GITHUB_API_URL}/${series}/${post}_${lang}.mdx`, {
    headers: {
      Authorization: `token ${GITHUB_API_TOKEN}`,
    },
  });

  const encodedMdx = await data.json();
  const mdx = Buffer.from(encodedMdx.content, "base64").toString("utf-8");
  const content = matter(mdx);
  const toc = extractToc(content.content);

  if (!content.data.visible && tagsCount) {
    tagsCount["all"] -= 1;
    cache.set(cacheName, null);
    return null;
  }

  const compiledMdx = await serialize(content.content, {
    mdxOptions: {
      remarkPlugins: [remarkParse],
      rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "github-dark", highlightLines: true }]],
      format: "mdx",
    },
  });

  const { text } = readingTime(content.content);

  if (tagsCount) {
    appendTags(tagsCount, content.data.tags);
  }

  cache.set(cacheName, {
    ...(({ orig, ...rest }) => rest)(content),
    lang,
    path: `${series}/${post}`,
    compiledMdx: compiledMdx,
    readingTime: text,
    toc: toc,
  });

  return {
    ...(({ orig, ...rest }) => rest)(content),
    lang,
    path: `${series}/${post}`,
    compiledMdx: compiledMdx,
    readingTime: text,
    toc: toc,
  };
};

/**
 * 특정 series의 글 목록 요청
 * @param lang
 * @param series
 * @param tagsCount
 * @returns
 */
const fetchPosts = async (lang: LangType, series: string, tagsCount: Record<string, number>) => {
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

      if (!postData) {
        return null;
      }

      // 클라이언트에 데이터 전송을 위해 Uint8Array 형식인 orig 제거
      return {
        content: postData.content,
        path: `${series}/${path}`,
        data: postData.data,
        lang,
        compiledMdx: postData.compiledMdx,
        readingTime: postData.readingTime,
        toc: postData.toc,
      };
    });

  const resolvedPosts = (await Promise.all(postPromises)).filter((post) => post !== null); // null 제거
  posts.push(...resolvedPosts);

  return posts; // posts 배열 반환
};

/**
 * series 별로 구분한 글 목록
 * @param lang - 언어
 * @returns
 */
export const getPostsSepSeries = async (lang: LangType) => {
  const cacheName = `allPosts_${lang}`;

  if (cache.has(cacheName)) {
    console.log("get cache");
    return cache.get(cacheName);
  }

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
      const postDatas = await fetchPosts(lang, series.name, tagsCount);

      return postDatas.length > 0 ? { series: series.name, posts: postDatas } : null; // 시리즈명과 글 데이터를 객체로 반환
    })
  );

  const filterPosts = posts.filter((post) => post !== null);

  cache.set(`allPosts_${lang}`, { posts: filterPosts, tags: tagsCount });

  return { posts: filterPosts, tags: tagsCount }; // 모든 시리즈 데이터를 포함한 배열 반환
};
