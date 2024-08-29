import React, { ComponentProps, PropsWithChildren } from "react";
import clsx from "clsx";

import styles from "./styles/index.module.scss";

interface CardProps extends PropsWithChildren {
  className?: ComponentProps<"div">["className"];
}

export const Card: React.FunctionComponent<CardProps> = (props) => {
  const { className, children } = props;

  return <div className={clsx(styles.card, className)}>{children}</div>;
};
