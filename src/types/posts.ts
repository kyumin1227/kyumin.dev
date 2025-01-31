/**
 * 개별 글 목록
 */
interface iPost {
  content: string;
  data: iData;
  path: string;
  isEmpty: boolean;
  excerpt: string;
  lang: string;
  compiledMdx: any;
  readingTime: string;
}

/**
 * getPostsSepSeries의 결과 타입
 */
interface iPostsSepSeries {
  series: string;
  posts: iPost[];
}

/**
 * 개별 글 목록의 메타 데이터
 */
interface iData {
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage: string;
  visible: boolean;
}

interface iPostsSepSeriesAndTags {
  posts: iPostsSepSeries[];
  tags: Record<string, number>;
}
