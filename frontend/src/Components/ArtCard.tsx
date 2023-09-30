import React, { FC } from "react";
import axios from "axios";
import { Box, Image, SkeletonBox } from "@artsy/palette";
import { Details } from "./ArtMetaData";

const DEFAULT_AREA = 200 * 200;
const DEFAULT_MAX_IMG_HEIGHT = 400;
const DEFAULT_MAX_WIDTH = 500;

export interface ArtCardProps {
  artistName: string;
  galleryName: string;
  title: string;
  date: string;
  img_src: string;
  price: string;
  url: string;
}

const ArtCard: FC<ArtCardProps> = (props) => {
  return (
    <Box>
      <Image
        src={props.img_src}
        lazyLoad={true}
        style={{ display: "block", objectFit: "contain" }}
        alt=""
      />
      <Details {...props} />
    </Box>
  );
};

export default ArtCard;
