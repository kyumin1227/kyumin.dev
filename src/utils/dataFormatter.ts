import { LangType } from "@/types/posts";

/**
 * 언어에 따라 날짜 표시 방식 변경
 * 한국어 = xxxx년 xx월 xx일
 * 일본어 = xxxx年xx月xx日
 * @param date Date 값
 * @param lang 언어 ("ko" | "ja")
 * @returns
 */
export const formatDate = (date: Date, lang: LangType): string => {
  return date.toLocaleDateString(lang === "ko" ? "ko-KR" : "ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * 언어에 따라 시간 표시 방식 변경
 * @param text ReadingTime 라이브러리의 반환 값
 * @param lang 언어 ("ko" | "ja")
 * @returns
 */
export const formatReadingTime = (text: string, lang: string): string => {
  const time = text.split(" ")[0];
  return lang === "ko" ? `${time} 분` : `${time}分`;
};
