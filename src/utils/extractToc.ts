import { iToc } from "@/types/posts";

const extractToc = (mdContent: string): iToc[] => {
  const regex = /^(#{1,3})\s+(.*)$/gm;
  const toc: iToc[] = [];
  let match;

  while ((match = regex.exec(mdContent)) !== null) {
    const indent = match[1].length;
    const text = match[2].trim();
    const link = text
      .toLowerCase()
      .replace(/[\p{Emoji}]/gu, "") // 이모티콘 제거 (ES2021+ 지원)
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/gu, "") // 유니코드 범위 활용한 이모티콘 제거 (ES2020)
      .replace(/[\[\]:!@#$/%^&*()+=,.]/g, "") // 특수 문자 제거
      .replace(/\s+/g, "-"); // 공백 -> 하이픈 변환

    toc.push({ indent, text, link });
  }

  return toc;
};

export default extractToc;
