import rehypeRaw from "rehype-raw";
import ReactMarkdown from "react-markdown";
import { Box, Link, styled } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

const TocWrapper = styled(Box)`
  max-width: 180px;
  width: 180px;
  position: sticky;
  padding-left: 24px;
  top: 200px;
  right: 0;

  h1 {
    font-size: 28px;
    font-weight: bold;
    padding-left: 8px;
    margin-bottom: 8px;
  }

  a {
    text-decoration: none;
    padding: 5px;
    display: inline-block;
    border-left: 3px solid transparent;
    font-size: 14px;
    line-height: 14px;
    color: ${({ theme }) => theme.palette.text.primary};
  }

  .active {
    font-weight: bold;
    color: ${({ theme }) => theme.palette.primary.main};
    border-left: 3px solid ${({ theme }) => theme.palette.primary.main};
  }
`;

const Toc = ({ content = "", activeIds = [] }: { content?: string; activeIds: string[] }) => {
  return (
    <TocWrapper>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({ node, ...props }) => {
            // id가 "contents"인 경우 렌더링하지 않음
            if (props.id === "contents") {
              return null;
            }
            return <h1 {...props} />;
          },
        }}
      >
        {`${content.replace(/<li><a href="#(.*?)"([^>]*)>/g, (match, id, attributes) => {
          const activeClass = activeIds.includes(id) ? "active" : "";
          return `<li><a class="${activeClass}" href="#${id}" ${attributes}>`;
        })}`}
      </ReactMarkdown>
      <Link href={`#comments`}>
        <CommentIcon />
      </Link>
    </TocWrapper>
  );
};

export default Toc;
