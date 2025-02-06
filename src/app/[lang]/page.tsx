import { getPostsSepSeries } from "../api/getPosts";
import FilterTags from "../../components/FiterTags";
import serializePosts from "@/utils/serializedPosts";
import { iPostsSepSeriesAndTags, LangType } from "@/types/posts";

export const dynamicParams = false;

const getPosts = async (lang: LangType) => {
  const { posts, tags }: iPostsSepSeriesAndTags = await getPostsSepSeries(lang);
  return { posts, tags };
};

export async function generateStaticParams() {
  return [{ lang: "ko" }, { lang: "ja" }];
}

export default async function PostsPage({ params }: { params: Promise<{ lang: LangType }> }) {
  const { lang } = await params;
  const { posts, tags } = await getPosts(lang);

  const postDatas = serializePosts(posts);

  return (
    <>
      <FilterTags tags={tags} lang={lang} postDatas={postDatas} />
    </>
  );
}
