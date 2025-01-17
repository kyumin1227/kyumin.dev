"use client";

import { Box, Card, Grid2, styled, Typography } from "@mui/material";
import { motion } from "framer-motion";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import readingTime from "reading-time";
import { useEffect, useState } from "react";

interface PostCardProps {
  data: iPost;
  modalFunc: (postPath: string) => void;
}

const CardWrapper = styled(motion(Grid2))`
  border-radius: 3%;
  aspect-ratio: 4 / 3;
  border: 2px solid #e0e0e0;
`;

const ImgWrapper = styled(Grid2)`
  width: 100%;
  background-color: yellow;
  justify-content: center;
  align-items: center;
  display: flex;
  overflow: hidden;
  border-radius: 3% 3% 0 0;
  border-bottom: 2px solid #e0e0e0;

  img {
    width: 100%;
  }
`;

const TextWrapper = styled(Grid2)`
  padding: 10px;
  object-fit: cover;
`;

const IconAndText = styled(Box)`
  display: flex;
  align-items: "center";
`;

/**
 * Tag 컴포넌트
 * @param param0
 * @returns
 */
const Tag = ({ tag }: { tag: string }) => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        padding: "0.5rem",
        marginRight: "0.5rem",
        marginTop: "4px",
        marginBottom: "8px",
        borderRadius: "0.5rem",
        fontSize: "1rem",
        fontWeight: "bold",
        width: "fit-content",
      }}
    >
      {tag}
    </Box>
  );
};

const PostCard = ({ data, modalFunc }: PostCardProps) => {
  const { text } = readingTime(data.content);
  const date = new Date(data.data.date);
  const [dateString, setDateString] = useState<string>("");
  const [readingTimeString, setReadingTimeString] = useState<string>("");

  // post의 언어에 따라 시간 표시 및 날짜 표시 방식 변경
  //   한국어 = xxxx년 xx월 xx일
  //   일본어 = xxxx年xx月xx日
  useEffect(() => {
    const time = text.split(" ")[0];
    if (data.lang === "ko") {
      setReadingTimeString(`${time} 분`);
      setDateString(
        date.toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    } else if (data.lang === "ja") {
      setReadingTimeString(`${time}分`);
      setDateString(
        date.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    }
  }, [data.lang, date, text]);

  return (
    <>
      {/* 텍스트는 전체 텍스트가 나오는 크기로 고정, 그 외의 영역은 전부 이미지 채움 */}
      <CardWrapper
        container
        layoutId={data.path}
        size={{ xs: 12, sm: 6, lg: 4 }}
        onClick={() => modalFunc(data.path)}
        whileHover={{ scale: 1.02 }}
        direction={"column"}
      >
        <ImgWrapper size="grow">
          <img
            src="https://d5br5.dev/_next/image?url=%2Fposts%2Fdeep_dive%2Fnginx405%2Fthumbnail.jpg&w=828&q=75"
            alt="Image Text"
          />
          {/* <img src={data.data.coverImage} alt="Image Text" /> */}
        </ImgWrapper>
        <TextWrapper size="auto">
          <Typography fontSize={20}>{data.data.title}</Typography>
          {data.data.tags.map((tag) => (
            <Tag key={tag} tag={tag} />
          ))}
          <Box display={"flex"} justifyContent={"space-between"}>
            <IconAndText color={"text.secondary"}>
              <CalendarMonthOutlinedIcon fontSize="small" sx={{ marginRight: "4px" }} />
              <Typography fontSize={14}>{dateString}</Typography>
            </IconAndText>
            <IconAndText color={"text.secondary"}>
              <AccessTimeIcon fontSize="small" sx={{ marginRight: "4px" }} />
              <Typography fontSize={14}>{readingTimeString}</Typography>
            </IconAndText>
          </Box>
        </TextWrapper>
      </CardWrapper>
    </>
  );
};

export default PostCard;
