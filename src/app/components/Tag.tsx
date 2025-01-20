import { Button } from "@mui/material";

const MAX_TAG_LENGTH = 20;

const Tag = ({
  tag,
  count,
  isSelected,
  theme,
  onClick,
}: {
  tag: string;
  count?: number;
  isSelected?: boolean;
  theme: any;
  onClick?: () => void;
}) => {
  const truncatedTag = tag.length > MAX_TAG_LENGTH ? `${tag.slice(0, MAX_TAG_LENGTH)}...` : tag;

  return (
    <>
      <Button
        sx={{
          marginRight: "8px",
          marginBottom: "8px",
          border: theme.palette.mode === "dark" ? "2px solid" : "1px solid",
        }}
        onClick={onClick}
        variant={theme.palette.mode === "dark" ? "outlined" : "contained"}
        color={isSelected ? "secondary" : "primary"}
      >
        {truncatedTag} ({count})
      </Button>
    </>
  );
};

export default Tag;
