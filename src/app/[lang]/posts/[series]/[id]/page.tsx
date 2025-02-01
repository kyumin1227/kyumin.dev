import { Box } from "@mui/material";
import { fetchPostAndCompileMdx, getPostsSepSeries } from "@/app/api/getPosts";
import PostBody from "@/components/PostBody";
import serializePosts from "@/utils/serializedPosts";

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: LangType; series: string; id: string }>;
}) {
  const { lang, series, id } = await params;

  const result = await fetchPostAndCompileMdx(series, id, lang, {});
  if (!result) {
    throw new Error("Failed to fetch post data");
  }
  const { data }: { data: iData } = result;

  return {
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags.join(", "),
    lang,
  };
}

export async function generateStaticParams() {
  const { posts: koPosts } = await getPostsSepSeries("ko");

  console.log(koPosts[0].posts);

  const { posts: jaPosts } = await getPostsSepSeries("ja");
  const allPostDatas = [...serializePosts(koPosts), ...serializePosts(jaPosts)];

  return allPostDatas.map((post) => ({
    lang: post.lang,
    series: post.path.split("/")[0],
    id: post.path.split("/")[1],
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ lang: LangType; series: string; id: string }>;
}) {
  const { lang, series, id } = await params;

  const result = await fetchPostAndCompileMdx(series, id, lang, {});
  if (!result) {
    return <div>{lang === "ja" ? "記事が存在しません。" : "게시물이 존재하지 않습니다."}</div>;
  }
  const { data, compiledMdx, readingTime } = result;

  return <PostBody compiledMdx={compiledMdx} data={data} lang={lang} readingTime={readingTime} />;
}
