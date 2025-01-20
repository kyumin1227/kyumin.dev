"use client";

import { Box, styled } from "@mui/material";
import React, { useState } from "react";
import PostList from "./PostList";

const MAX_TAG_LENGTH = 20;

const Tag = ({
  tag,
  count,
  isSelected,
  onClick,
}: {
  tag: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const truncatedTag = tag.length > MAX_TAG_LENGTH ? `${tag.slice(0, MAX_TAG_LENGTH)}...` : tag;

  return (
    <Box
      onClick={onClick}
      sx={{
        backgroundColor: isSelected ? "secondary.main" : "primary.main",
        color: "white",
        padding: "0.5rem",
        marginRight: "0.5rem",
        marginTop: "4px",
        marginBottom: "8px",
        borderRadius: "0.5rem",
        fontSize: "1rem",
        fontWeight: "bold",
        width: "fit-content",
        cursor: "pointer",
        userSelect: "none",
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

const FilterTags = ({ tags, lang, postDatas }: { tags: Record<string, number>; lang: string; postDatas: iPost[] }) => {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) => {
      const updated = new Set(prev);

      // "all" 태그가 선택되면 다른 태그 선택 해제
      if (tag === "all") {
        return new Set(["all"]);
      }

      // 태그 선택/해제
      if (updated.has(tag)) {
        updated.delete(tag);
      } else {
        updated.add(tag);
      }

      return updated;
    });
  };

  const handleTagAllClick = () => {
    setSelectedTags(new Set());
  };

  // 선택된 태그에 따라 postDatas 필터링
  const filteredPosts = selectedTags.size
    ? postDatas.filter((post) => Array.from(selectedTags).some((tag) => post.data.tags.includes(tag)))
    : postDatas;

  console.log(filteredPosts);

  return (
    <>
      <Box>
        <WrapperTags>
          {/* 태그 목록 출력 */}
          {Object.entries(tags).map(([tag, count]) =>
            tag !== "all" ? (
              <Tag
                key={tag}
                tag={tag}
                count={count}
                isSelected={selectedTags.has(tag)}
                onClick={() => handleTagClick(tag)}
              />
            ) : (
              <Tag key={tag} tag={tag} count={count} isSelected={selectedTags.size === 0} onClick={handleTagAllClick} />
            )
          )}
        </WrapperTags>
      </Box>
      <PostList lang={lang} posts={filteredPosts} />
    </>
  );
};

export default FilterTags;
