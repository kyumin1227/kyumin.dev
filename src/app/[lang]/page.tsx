import matter from "gray-matter";

// 정적 경로 생성
export async function generateStaticParams() {
  return [{ lang: "ja" }, { lang: "ko" }];
}

const GITHUB_API_URL = process.env.GITHUB_API_URL;
const GITHUB_API_TOKEN = process.env.GITHUB_API_TOKEN;

const fetchPosts = async (lang: string, series: string) => {
  const postsData = await fetch(`${GITHUB_API_URL}/${series}`, {
    headers: {
      Authorization: `token ${GITHUB_API_TOKEN}`,
    },
  });
  const posts: any[] = [];

  const data = await postsData.json();
  const postPromises = data
    .filter((post: any) => post.name.endsWith(`_${lang}.mdx`))
    .map(async (post: any) => {
      console.log(post.name);
      const encodedMdxResponse = await fetch(post.url, {
        headers: {
          Authorization: `token ${GITHUB_API_TOKEN}`,
        },
      });
      const encodedMdx = await encodedMdxResponse.json();
      const mdx = Buffer.from(encodedMdx.content, "base64").toString("utf-8");
      const content = matter(mdx);
      return content; // map 내부에서 데이터를 반환
    });

  const resolvedPosts = await Promise.all(postPromises);
  posts.push(...resolvedPosts);
  return posts; // posts 배열 반환
};

// 글 목록을 반환
const fetchSeriesByLang = async (lang: string) => {
  if (!GITHUB_API_URL) {
    throw new Error("GITHUB_API_URL is not defined");
  }

  const seriesResponse = await fetch(GITHUB_API_URL, {
    headers: {
      Authorization: `token ${GITHUB_API_TOKEN}`,
    },
  });
  const seriesData = await seriesResponse.json();

  // 각 시리즈의 포스트 데이터를 비동기적으로 가져옴
  const posts = await Promise.all(
    seriesData.map(async (series: any) => {
      console.log(series.name);
      const postDatas = await fetchPosts(lang, series.name);
      return { series: series.name, posts: postDatas }; // 시리즈명과 글 데이터를 객체로 반환
    })
  );

  console.log(posts);

  return posts; // 모든 시리즈 데이터를 포함한 배열 반환
};

// 글 목록 페이지
export default async function BlogList({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  const posts = await fetchSeriesByLang(params.lang);

  return (
    <div>
      <h1>글 목록 ({lang})</h1>
      <ul>
        {posts.map((seriesData: any) => (
          <li key={seriesData.series}>
            <h2>{seriesData.series}</h2>
            <ul>
              {seriesData.posts.map((post: any, index: number) => (
                <li key={index}>
                  <h3>title: {post.data.title}</h3>
                  <p>description: {post.data.description}</p>
                  {/* Date 객체를 문자열로 변환 */}
                  <small>date: {new Date(post.data.date).toLocaleDateString()}</small>
                  <pre>content: {JSON.stringify(post.content.trim(), null, 2)}</pre>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
