import { getPostsSepSeries } from "@/api/posts";
import dynamic from "next/dynamic";
import Link from "next/link";

// 정적 경로 생성
export async function generateStaticParams() {
  return [{ lang: "ja" }, { lang: "ko" }];
}

// 클라이언트 컴포넌트를 동적으로 가져오기
const ClientSideFeatures = dynamic(() => import("./ClientSideFeatures"));

// 글 목록 페이지
export default async function BlogList({ params }: { params: { lang: string } }) {
  const lang = params?.lang;

  const posts: iPosts[] = await getPostsSepSeries(lang);

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
                  <Link href={`/${lang}/posts/${post.path}`}>
                    <h3>title: {post.data.title}</h3>
                  </Link>
                  <p>description: {post.data.description}</p>
                  {/* Date 객체를 문자열로 변환 */}
                  <small>date: {new Date(post.data.date).toLocaleDateString()}</small>
                  <pre>content: {JSON.stringify(post.content.trim(), null, 2)}</pre>
                  <p>tags:</p>
                  {post.data.tags.map((tag: string) => (
                    <p>{tag}</p>
                  ))}
                  <p>path: {post.path}</p>
                  <ClientSideFeatures lang={lang} postId={post.path} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
