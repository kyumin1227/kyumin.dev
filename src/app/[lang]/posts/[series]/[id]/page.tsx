import { Box, Button } from "@mui/material";

import { fetchPostAndCompileMdx } from "@/app/api/getPosts";
import MarkdownBody from "@/components/MarkdownBody";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; series: string; id: string }> }) {
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

export default async function PostPage({ params }: { params: Promise<{ lang: string; series: string; id: string }> }) {
  const { lang, series, id } = await params;
  console.log(lang, series, id);

  const result = await fetchPostAndCompileMdx(series, id, lang, {});
  if (!result) {
    return (
      <>
        <Button color="secondary">fdas</Button>
        <div>게시물이 존재하지 않습니다.</div>
      </>
    );
  }
  const { data, compiledMdx, readingTime } = result;

  return (
    <Box display={"flex"} justifyContent={"center"} position={"relative"} overflow={"visible"}>
      <MarkdownBody compiledMdx={compiledMdx} data={data} lang={lang} readingTime={readingTime} />
    </Box>
  );
}
