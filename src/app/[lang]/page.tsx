import PostList from "../components/PostList";
import { getPostsSepSeries } from "../api/[lang]/posts/route";
import FilterTags from "../components/FiterTags";

const getPosts = async (lang: string) => {
  const { posts, tags }: iPostsSepSeriesAndTags = await getPostsSepSeries(lang);
  return { posts, tags };
};

export default async function PostsPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const { posts, tags } = await getPosts(lang);

  console.log(posts);
  console.log(tags);

  return (
    <div>
      <FilterTags tags={tags} lang={lang} />
      <PostList posts={posts} lang={lang} />
    </div>
  );
}
