import { iToc } from "@/types/posts";
import { Link, List, ListItem } from "@mui/material";

const TocTop = ({ toc }: { toc: iToc[] }) => {
  return (
    <List>
      {toc.map((item) => (
        <ListItem key={item.link} sx={{ paddingLeft: `${(item.indent - 1) * 20}px`, paddingY: "0" }}>
          <Link key={item.link} href={`#${item.link}`}>
            {item.text}
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export default TocTop;
