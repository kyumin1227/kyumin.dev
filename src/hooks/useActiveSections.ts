import { useEffect, useState } from "react";

/**
 * 현재 보이는 섹션 id 반환 (중복 가능)
 * @param ref
 * @param sectionSelector
 * @returns
 */
const useActiveSections = (sectionSelector: string) => {
  const [activeIds, setActiveIds] = useState<string[]>([]);

  // 현재 보이는 섹션 추적
  useEffect(() => {
    const activeSet = new Set<string>();
    const allSections = Array.from(document.querySelectorAll(sectionSelector));
    let lastActiveId: string | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("id") || "";

          if (entry.isIntersecting) {
            // 해당 엔트리가 보이는 경우
            activeSet.add(id);
            lastActiveId = id;
          } else {
            // 해당 엔트리가 보이지 않는 경우
            activeSet.delete(id);
          }
        });

        if (activeSet.size === 0 && lastActiveId) {
          // 현재 보이는 섹션이 없을 때
          const direction =
            (entries.find((entry) => entry.target.getAttribute("id") === lastActiveId)?.boundingClientRect.top ?? 0) < 0
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
        root: null, // 모달 내부를 기준
        threshold: 0.1,
      }
    );

    // 관찰 대상 지정
    const sections = document.querySelectorAll(sectionSelector);
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return activeIds;
};

export default useActiveSections;
