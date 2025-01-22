import Comments from "@/app/components/Comments";
import { Box, Button } from "@mui/material";

import { fetchPostAndCompileMdx } from "@/app/api/route";
import MarkdownBody from "@/app/components/MarkdownBody";

export default async function PostPage({ params }: { params: { lang: string; series: string; id: string } }) {
  const { lang, series, id } = params;
  console.log(lang, series, id);

  const { data, compiledMdx, readingTime } = await fetchPostAndCompileMdx(series, id, lang, {});

  if (!data) {
    return (
      <>
        <Button color="secondary">fdas</Button>
        <div>게시물이 존재하지 않습니다.</div>
      </>
    );
  }

  return (
    <Box display={"flex"} justifyContent={"center"} position={"relative"} overflow={"visible"}>
      <MarkdownBody compiledMdx={compiledMdx} data={data} lang={lang} readingTime={readingTime} />
    </Box>
  );
}
