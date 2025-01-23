/**
 * 데이터를 직렬화하여 탐색하기 쉽게 변환 (시리즈 기반을 풀어서)
 * @param data iPostsSepSeriesAndTags 타입 데이터
 * @returns 직렬화된 데이터
 */
const serializePosts = (data: iPostsSepSeries[]): iPost[] => {
  // 모든 시리즈의 포스트를 병합
  const serializedPosts: iPost[] = data.flatMap((seriesItem) =>
    seriesItem.posts.map((post) => ({
      content: post.content,
      data: post.data,
      path: post.path,
      isEmpty: post.isEmpty,
      excerpt: post.excerpt,
      lang: post.lang,
      compiledMdx: post.compiledMdx,
      readingTime: post.readingTime,
    }))
  );

  return serializedPosts;
};

export default serializePosts;
