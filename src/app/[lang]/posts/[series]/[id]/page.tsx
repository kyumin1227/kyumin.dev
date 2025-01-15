import matter from "gray-matter";
import { useTheme } from "next-themes";

async function getPost(lang: string, id: string) {
  const response = await fetch(`${process.env.GITHUB_API_URL}/${lang}/${id}.mdx`, {
    headers: {
      Authorization: `token ${process.env.GITHUB_API_TOKEN}`,
    },
  });

  if (!response.ok) return null;

  const encodedContent = await response.json();
  const content = Buffer.from(encodedContent.content, "base64").toString("utf-8");
  const post = matter(content);

  return post;
}

export default async function PostPage({ params }: { params: { lang: string; id: string } }) {
  const { lang, id } = params;
  const post = await getPost(lang, id);
  const { theme } = useTheme();

  if (!post) {
    return <div>게시물이 존재하지 않습니다.</div>;
  }

  return (
    <div>
      <h1>{post.data.title}</h1>
      <article>{post.content}</article>
    </div>
  );
}
