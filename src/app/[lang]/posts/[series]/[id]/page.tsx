import Comments from "@/app/components/Comments";
import { Box, Button } from "@mui/material";
import matter from "gray-matter";

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

  if (!post) {
    return (
      <>
        <Button color="secondary">fdas</Button>
        <div>게시물이 존재하지 않습니다.</div>
        <Comments />
      </>
    );
  }

  return (
    <div>
      <Button>fdas</Button>
      <h1>{post.data.title}</h1>
      <article>{post.content}</article>
      <Comments />
    </div>
  );
}
