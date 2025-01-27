"use client";

import { Box, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Tag } from "./PostCard";

const TagWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  position: relative;
`;

const OverflowIndicator = styled(Box)`
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 0.2rem 0.5rem;
  font-size: 0.9rem;
  font-weight: bold;
  color: gray;
  pointer-events: none; /* 클릭 불가능 처리 */
`;

const DynamicTagContainer = ({ tags }: { tags: string[] }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [hiddenTagCount, setHiddenTagCount] = useState(0);

  useEffect(() => {
    const wrapperElement = wrapperRef.current;

    const calculateVisibleTags = () => {
      const wrapperWidth = wrapperElement?.getBoundingClientRect().width || 0;

      if (wrapperWidth >= 600) return; // 600px 이상의 비정상적인 값이 들어올 경우 처리하지 않음

      let currentWidth = 0;
      const visible: string[] = [];
      let hidden = 0;

      tags.forEach((tag) => {
        const tagWidth = tag.length * 14 + 24;
        if (currentWidth + tagWidth <= wrapperWidth - 22) {
          visible.push(tag);
          currentWidth += tagWidth;
        } else {
          hidden++;
        }
      });

      setVisibleTags(visible);
      setHiddenTagCount(hidden);
    };

    const observer = new ResizeObserver(calculateVisibleTags);
    if (wrapperElement) observer.observe(wrapperElement);

    calculateVisibleTags();

    return () => observer.disconnect();
  }, [tags]);

  return (
    <TagWrapper ref={wrapperRef}>
      {visibleTags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
      {hiddenTagCount > 0 && <OverflowIndicator>+{hiddenTagCount}</OverflowIndicator>}
    </TagWrapper>
  );
};

export default DynamicTagContainer;
