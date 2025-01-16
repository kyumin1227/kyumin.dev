import { Box, Card, Grid2, styled, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface PostCardProps {
  title?: string;
  coverImage?: string;
  description?: string;
  path: string;
  modalFunc: (postPath: string) => void;
}

const CardWrapper = styled(motion(Grid2))`
  background-color: red;
  border-radius: 3%;
`;

const ImgWrapper = styled(Box)`
  width: 100%;
  height: 65%;
  background-color: yellow;

  img {
    width: "100%";
    height: "100%";
    object-fit: "cover";
  }
`;

const PostCard = ({ title, coverImage, description, path, modalFunc }: PostCardProps) => {
  return (
    <>
      <CardWrapper
        layoutId={path}
        size={{ xs: 12, sm: 6, lg: 4 }}
        onClick={() => modalFunc(path)}
        whileHover={{ scale: 1.01 }}
      >
        <Card sx={{ aspectRatio: "4 / 3" }}>
          <ImgWrapper>
            <img src={coverImage} alt="fasd" />
          </ImgWrapper>
          <Typography>{title}</Typography>
        </Card>
      </CardWrapper>
    </>
  );
};

export default PostCard;
