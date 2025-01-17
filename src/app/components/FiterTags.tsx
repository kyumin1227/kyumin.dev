"use client";

import { Box, styled } from "@mui/material";

const MAX_TAG_LENGTH = 20;

const Tag = ({ tag, count }: { tag: string; count: number }) => {
  // MAX_TAG_LENGTH를 초과하면 ...을 붙여서 표시
  const truncatedTag = tag.length > MAX_TAG_LENGTH ? `${tag.slice(0, MAX_TAG_LENGTH)}...` : tag;

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
      {truncatedTag} ({count})
    </Box>
  );
};

const WrapperTags = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 32px;
`;

const FilterTags = ({ tags, lang }: { tags: Record<string, number>; lang: string }) => {
  const tagEntries = Object.entries(tags);
  const [firstTag, ...otherTags] = tagEntries;

  console.log(firstTag);

  return (
    <WrapperTags>
      <Tag tag={lang === "ko" ? "전체" : "全体"} count={firstTag[1]} />
      {otherTags.map(([tag, count]) => (
        <Tag key={tag} tag={tag} count={count} />
      ))}
    </WrapperTags>
  );
};

export default FilterTags;
