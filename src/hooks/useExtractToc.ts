import { useEffect, useState } from "react";

/**
 * 컴파일된 mdx에서 contentsId를 이용하여 toc 추출
 * @param compiledMdx
 * @param contentsId
 * @returns
 */
const useExtractToc = (compiledMdx: string, contentsId: string) => {
  const [toc, setToc] = useState<string | null>(null);

  useEffect(() => {
    const container = document.querySelector(".markdown-body");
    if (container) {
      const contentsHeading = container.querySelector(`h1#${contentsId}`);
      const tocList = container.querySelector(`h1#${contentsId} + ul`);
      if (contentsHeading && tocList) {
        // h1#contents + ul 통째로 추출
        const combinedHTML = contentsHeading.outerHTML + tocList.outerHTML;

        let ulCount = 0;

        // <ul>, </ul>, <a...>, </a> 각각을 정규식으로 구분
        // (기존 코드: /<\/?ul[^>]*>|<a[^>]*>|<\/a>/gi)
        // 여기서 <a([^>]*)> 식으로 캡처 그룹을 사용해
        // 기존 속성을 $1로 보존
        const parsed = combinedHTML.replace(/<ul[^>]*>|<\/ul>|<a([^>]*)>|<\/a>/gi, (match, aAttributes) => {
          // 소문자로 비교
          const tag = match.toLowerCase();

          if (tag.startsWith("<ul") && !tag.startsWith("</ul")) {
            // 열리는 <ul ...>
            ulCount++;
            return match; // 그대로 반환
          } else if (tag.startsWith("</ul")) {
            // 닫는 </ul>
            ulCount--;
            return match; // 그대로 반환
          } else if (tag.startsWith("<a")) {
            // a 태그 시작
            // aAttributes = " href="#..." class="..." 등
            const paddingValue = ulCount * 8;
            // 주의: 기존 style=""이 있으면 덮어쓰는 예시 (병합은 별도 로직 필요)
            return `<a${aAttributes} style="padding-left:${paddingValue}px;">`;
          } else if (tag.startsWith("</a")) {
            return "</a>";
          }

          return match; // 나머지는 변경 없이 반환
        });

        setToc(parsed);

        // 원본 DOM에서 제거
        contentsHeading.remove();
        tocList.remove();
      }
    }
  }, [compiledMdx, contentsId]);

  return toc;
};

export default useExtractToc;
