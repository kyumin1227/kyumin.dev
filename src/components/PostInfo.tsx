import { Box, Button, Grid2, styled, Typography } from "@mui/material";
import { IconAndText } from "./PostCard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useState } from "react";
import { formatDate, formatReadingTime } from "@/utils/dataFormatter";
import { iData, LangType } from "@/types/posts";

const TagWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const Tag = styled(Box)`
  background-color: ${({ theme }) => theme.palette.primary.main};
  margin: 4px;
  padding: 8px;
  border-radius: 4px;
  color: ${({ theme }) => (theme.palette.mode === "dark" ? theme.palette.common.black : theme.palette.common.white)};
`;

const PostInfo = ({ data, lang, readingTime }: { data: iData; lang: LangType; readingTime: string }) => {
  const [tagOpen, setTagOpen] = useState(false);
  const dateString = formatDate(new Date(data.date), lang);
  const readingTimeString = formatReadingTime(readingTime, lang);

  return (
    <>
      <Typography fontWeight={"bold"} variant="h4" paddingTop={5} paddingBottom={1}>
        {data.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paddingBottom={1}>
        {data.description}
      </Typography>
      <Grid2 color="text.secondary" paddingBottom={1} display={"flex"} alignItems={"center"}>
        <IconAndText size={"auto"} color={"text.secondary"}>
          <CalendarMonthOutlinedIcon fontSize="small" sx={{ marginRight: "4px" }} />
          <Typography fontSize={14}>{dateString}</Typography>
        </IconAndText>
        <Typography fontSize={14} sx={{ marginX: "8px" }}>
          •
        </Typography>
        <IconAndText size={"auto"} color={"text.secondary"}>
          <AccessTimeIcon fontSize="small" sx={{ marginRight: "4px" }} />
          <Typography fontSize={14}>{readingTimeString}</Typography>
        </IconAndText>
        <Grid2 size={"grow"} display={"flex"} justifyContent={"flex-end"}>
          <Button
            onClick={() => {
              setTagOpen(!tagOpen);
            }}
          >
            {tagOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            {lang === "ja" ? (!tagOpen ? "タグを見る" : "タグを閉じる") : !tagOpen ? "태그 보기" : "태그 닫기"}
          </Button>
        </Grid2>
      </Grid2>
      {tagOpen && (
        <TagWrapper>
          {data.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagWrapper>
      )}
    </>
  );
};

export default PostInfo;
