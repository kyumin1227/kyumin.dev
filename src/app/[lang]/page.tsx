export async function generateStaticParams() {
  return [{ lang: "jp" }, { lang: "kr" }];
}

const LangHome = ({ params }: { params: { lang: string } }) => {
  const lang = params?.lang;

  if (!lang) {
    return <div>언어를 선택해주세요.</div>;
  }

  return (
    <div>
      <h1>현재 언어: {params.lang}</h1>
    </div>
  );
};

export default LangHome;
