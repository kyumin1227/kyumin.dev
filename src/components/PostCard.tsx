"use client";

import { Box, Grid2, styled, Typography } from "@mui/material";
import { motion } from "framer-motion";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import readingTime from "reading-time";
import { useEffect, useState } from "react";
import { formatDate, formatReadingTime } from "@/utils/dataFormatter";
import Image from "next/image";
import DynamicTagContainer from "./DynamicTagContainer";
import zIndex from "@mui/material/styles/zIndex";

interface PostCardProps {
  data: iPost;
  modalFunc: (postPath: string) => void;
}

const CardWrapper = styled(motion(Grid2))`
  border-radius: 3%;
  aspect-ratio: 4 / 3.5;
  border: 1px solid;
`;

const ImgWrapper = styled(Grid2)`
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  overflow: hidden;
  border-radius: 3% 3% 0 0;
  border-bottom: 1px solid;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TextWrapper = styled(Grid2)`
  padding: 10px;
  object-fit: cover;
`;

export const IconAndText = styled(Grid2)`
  display: flex;
  align-items: "center";
`;

const TitleTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MAX_TAG_LENGTH = 20;

export const Tag = ({ tag }: { tag: string }) => {
  // MAX_TAG_LENGTH를 초과하면 ...을 붙여서 표시
  const truncatedTag = tag.length > MAX_TAG_LENGTH ? `${tag.slice(0, MAX_TAG_LENGTH)}...` : tag;

  return (
    <Box
      sx={{
        backgroundColor: "primary.main",
        color: "common.background",
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
      {truncatedTag}
    </Box>
  );
};

const PostCard = ({ data, modalFunc }: PostCardProps) => {
  const tags = data.data.tags;
  const { text } = readingTime(data.content);
  const date = new Date(data.data.date);
  const [dateString, setDateString] = useState<string>("");
  const [readingTimeString, setReadingTimeString] = useState<string>("");
  const [isAnimation, setIsAnimation] = useState<boolean>(false);

  useEffect(() => {
    setDateString(formatDate(date, data.lang));
    setReadingTimeString(formatReadingTime(text, data.lang));
  }, [data.lang, date, text]);

  return (
    <>
      {/* 텍스트는 전체 텍스트가 나오는 크기로 고정, 그 외의 영역은 전부 이미지 채움 */}
      <CardWrapper
        container
        layoutId={data.path}
        size={{ xs: 12, sm: 6, lg: 4 }}
        onClick={() => modalFunc(data.path)}
        whileHover={{ scale: 1.05 }}
        direction={"column"}
        zIndex={isAnimation ? zIndex.modal : 0}
        onAnimationStart={() => setIsAnimation(true)}
        onLayoutAnimationComplete={() => setIsAnimation(false)}
      >
        <ImgWrapper size="grow">
          <Image src={data.data.coverImage} alt="CoverImage" width={500} height={500} />
        </ImgWrapper>
        <TextWrapper size="auto" width={"100%"}>
          <TitleTypography fontSize={22}>{data.data.title}</TitleTypography>
          {/* 태그의 개수가 두 개 이상일 경우 보여줄 태그의 개수를 넓이에 맞춰 동적으로 조정 */}
          {tags.length > 1 ? <DynamicTagContainer tags={tags} /> : <Tag tag={tags[0]} />}
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
