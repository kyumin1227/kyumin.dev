"use client";

import { Box, styled, useTheme } from "@mui/material";
import React, { useState } from "react";
import PostList from "./PostList";
import Tag from "./Tag";
import { iPost, LangType } from "@/types/posts";

const WrapperTags = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 32px;
`;

const FilterTags = ({
  tags,
  lang,
  postDatas,
}: {
  tags: Record<string, number>;
  lang: LangType;
  postDatas: iPost[];
}) => {
  const theme = useTheme();
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
          {Object.entries(tags).map(([tag, count], index) =>
            tag !== "all" ? (
              <Tag
                key={`filter_${tag}_${index}`}
                tag={tag}
                count={count}
                isSelected={selectedTags.has(tag)}
                theme={theme}
                onClick={() => handleTagClick(tag)}
              />
            ) : (
              <Tag
                key={`filter_all_${index}`}
                tag={lang === "ko" ? "전체" : "全体"}
                count={count}
                isSelected={selectedTags.size === 0}
                theme={theme}
                onClick={handleTagAllClick}
              />
            )
          )}
        </WrapperTags>
      </Box>
      <PostList lang={lang} posts={filteredPosts} />
    </>
  );
};

export default FilterTags;
