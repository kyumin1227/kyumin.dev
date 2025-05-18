import { useEffect, useState } from "react";

/**
 * 현재 보이는 섹션 id 반환 (중복 가능)
 * @param sectionSelector
 * @param mdxLoaded - true일 경우 섹션을 추적
 * @param containerRef
 * @returns
 */
const useActiveSections = (sectionSelector: string, mdxLoaded: boolean, containerRef: React.RefObject<HTMLElement>) => {
  const [activeIds, setActiveIds] = useState<string[]>([]);

  // 현재 보이는 섹션 추적
  useEffect(() => {
    if (typeof window === "undefined" || !mdxLoaded) return;

    const initializeIntersectionObserver = () => {
      if (!containerRef.current) return;
      const allSections = Array.from(containerRef.current.querySelectorAll(sectionSelector));
      const activeSet = new Set<string>();

      let lastActiveId: string | null = null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.getAttribute("id") || "";

            if (entry.isIntersecting) {
              // 해당 엔트리가 보이는 경우
              activeSet.add(id);
            } else {
              // 해당 엔트리가 보이지 않는 경우
              activeSet.delete(id);
              lastActiveId = id;
            }
          });

          if (activeSet.size === 0 && lastActiveId) {
            // 현재 보이는 섹션이 없을 때
            const direction =
              (entries.find((entry) => entry.target.getAttribute("id") === lastActiveId)?.boundingClientRect.top ?? 0) <
              0
                ? "up"
                : "down";

            const lastIndex = allSections.findIndex((section) => section.getAttribute("id") === lastActiveId);
            if (direction === "up") {
              // 위로 사라졌으면 해당 항목을 활성화
              setActiveIds([lastActiveId]);
            } else if (direction === "down" && lastIndex > 0) {
              // 아래로 사라졌으면 바로 위 항목을 활성화
              const previousSection = allSections[lastIndex - 1];
              const previousId = previousSection?.getAttribute("id");
              setActiveIds([previousId || ""]);
            }
          } else {
            setActiveIds(Array.from(activeSet));
          }
        },
        {
          root: null, // 현재 보이는 영역(뷰포트)을 기준으로 감지
          threshold: 0.1,
        }
      );

      // 관찰 대상 지정
      const sections = containerRef.current.querySelectorAll(sectionSelector);
      sections.forEach((section) => observer.observe(section));

      return () => observer.disconnect();
    };

    initializeIntersectionObserver();
  }, [mdxLoaded, containerRef]);

  return activeIds;
};

export default useActiveSections;
