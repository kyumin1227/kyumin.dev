import { Alert, AlertTitle } from "@mui/material";
import type { MDXComponents } from "mdx/types";

export default function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Alert: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
      return <Alert {...props}>{children}</Alert>;
    },
    AlertTitle: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
      return <AlertTitle {...props}>{children}</AlertTitle>;
    },
    ...components,
  };
}
