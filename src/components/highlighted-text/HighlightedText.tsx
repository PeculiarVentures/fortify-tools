import React, { ComponentProps } from "react";
import { splitTextWithHighlight } from "../../utils";

import styles from "./styles/index.module.scss";

interface IHighlightedTextProps {
  text: string;
  highlight?: string;
  className?: ComponentProps<"div">["className"];
}

export const HighlightedText: React.FC<IHighlightedTextProps> = (props) => {
  const { highlight, text, className } = props;

  if (!highlight) {
    return text;
  }

  const parts = splitTextWithHighlight(text, highlight);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.toLowerCase() === highlight.toLowerCase()) {
          return (
            <span className={styles.highlight_text} key={`h-text-${index}`}>
              {part}
            </span>
          );
        }
        return <span key={`nh-text-${index}`}>{part}</span>;
      })}
    </span>
  );
};
