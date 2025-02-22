import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

/**
 * 개별 글 목록
 */
export interface iPost {
  content: matter.GrayMatterFile<string>;
  data: iData;
  path: string;
  isEmpty: boolean;
  excerpt: string;
  lang: LangType;
  compiledMdx: MDXRemoteSerializeResult;
  readingTime: string;
  toc: iToc[];
}

/**
 * getPostsSepSeries의 결과 타입
 */
export interface iPostsSepSeries {
  series: string;
  posts: iPost[];
}

/**
 * 개별 글 목록의 메타 데이터
 */
export interface iData {
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage: string;
  visible: boolean;
}

export interface iPostsSepSeriesAndTags {
  posts: iPostsSepSeries[];
  tags: Record<string, number>;
}

export interface iToc {
  text: string;
  link: string;
  indent: number;
}

export type LangType = "ko" | "ja";
