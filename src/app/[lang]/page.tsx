import { getPostsSepSeries } from "../api/getPosts";
import FilterTags from "../../components/FiterTags";
import serializePosts from "@/utils/serializedPosts";

const getPosts = async (lang: string) => {
  const { posts, tags }: iPostsSepSeriesAndTags = await getPostsSepSeries(lang);
  return { posts, tags };
};

export default async function PostsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const { posts, tags } = await getPosts(lang);

  console.log(posts);
  console.log(tags);

  const postDatas = serializePosts(posts);

  return (
    <div>
      <FilterTags tags={tags} lang={lang} postDatas={postDatas} />
    </div>
  );
}
