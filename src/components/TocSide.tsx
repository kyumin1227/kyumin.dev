import { Box, Link, List, ListItem, styled } from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { iToc } from "@/types/posts";

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
    border-left: 3px solid ${({ theme }) => theme.palette.primary.main};

    a {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }
`;

const TocSide = ({ toc, activeIds = [] }: { toc: iToc[]; activeIds: string[] }) => {
  return (
    <TocWrapper>
      <List>
        {toc.map((item) => (
          <ListItem
            key={item.link}
            sx={{ paddingLeft: `${item.indent * 8}px`, paddingY: "0" }}
            className={activeIds.includes(item.link) ? "active" : ""}
          >
            <Link key={item.link} href={`#${item.link}`}>
              {item.text}
            </Link>
          </ListItem>
        ))}
      </List>
      <Link href={`#comments`}>
        <CommentIcon />
      </Link>
    </TocWrapper>
  );
};

export default TocSide;
