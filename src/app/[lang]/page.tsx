import PostList from "../components/PostList";
import { getPostsSepSeries } from "../api/[lang]/posts/route";

const getPosts = async (lang: string) => {
  const posts: iPostsSepSeries[] = await getPostsSepSeries(lang);
  return posts;
};

export default async function PostsPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const posts = await getPosts(lang);

  console.log(posts);

  return (
    <div>
      <h1>글 목록 ({lang})</h1>
      <PostList posts={posts} lang={lang} />
    </div>
  );
}
