"use client";

import { Box, styled, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { MDXProvider } from "@mdx-js/react";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import ReactMarkdown from "react-markdown";
import rehypePrettyCode from "rehype-pretty-code";
import "github-markdown-css";

interface PostModalProps {
  closeModal: () => void;
  postData: iPost;
}

const ModalWrapper = styled(motion(Box))`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto auto;
  max-height: 94vh;
  max-width: 94vw;
  overflow: scroll;
  background-color: red;
  border-radius: 3%;
`;

const prettyCodeOptions = {
  theme: "github-dark",
  onVisitLine(node: any) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node: any) {
    node.properties.className.push("line--highlighted");
  },
  onVisitHighlightedWord(node: any) {
    node.properties.className = ["word--highlighted"];
  },
};

function PostModal({ closeModal, postData }: PostModalProps) {
  const isLandscape = useMediaQuery("(orientation: landscape)");

  // // evaluate 결과물(React 컴포넌트)을 담아둘 state
  // // const [MDXContentUse, setMDXContentUse] = useState<React.ComponentType | null>(null);
  // const [MDXDefinedComponent, setMDXDefinedComponent] = useState<any>(null);

  // useEffect(() => {
  //   (async () => {
  //     const {
  //       default: MDXContent,
  //       MDXDefinedComponent,
  //       ...rest
  //     } = await evaluate(postData.compiledMdx, {
  //       ...runtime,
  //     });
  //     console.log(MDXContent);
  //     setMDXDefinedComponent(MDXDefinedComponent);
  //   })();
  // }, [postData]);

  return (
    <>
      <ModalWrapper layoutId={`${postData.path}`} sx={{ aspectRatio: isLandscape ? " 4 / 3.5" : "3 / 4" }}>
        {postData ? (
          <div className="modal">
            <div className="modal-content">
              <button onClick={closeModal}>닫기</button>
              <h1>{postData.data.title}</h1>
              <ReactMarkdown className="markdown-body" rehypePlugins={[[rehypePrettyCode, prettyCodeOptions]]}>
                {postData.content}
              </ReactMarkdown>
            </div>
            <div className="modal-overlay" onClick={closeModal}></div>
          </div>
        ) : (
          <div>로딩 중...</div>
        )}
      </ModalWrapper>
    </>
  );
}

export default PostModal;
