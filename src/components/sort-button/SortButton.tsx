import React, { ComponentProps, PropsWithChildren } from "react";
import { Button, ButtonProps, Typography } from "@peculiar/react-components";
import clsx from "clsx";

import styles from "./styles/index.module.scss";

import DownIcon from "../../icons/down-10.svg?react";

interface SortButtonProps extends PropsWithChildren {
  className?: ComponentProps<"button">["className"];
  active?: boolean;
  order?: "asc" | "desc";
  onClick: ButtonProps["onClick"];
}

export const SortButton: React.FunctionComponent<SortButtonProps> = (props) => {
  const { children, className, active, order = "desc", onClick } = props;

  return (
    <Button
      variant="text"
      withoutPadding
      className={clsx(styles.sort_button, className)}
      data-active={active}
      onClick={onClick}
    >
      <Typography
        component={"span"}
        variant="b3"
        color="gray-9"
        className={styles.sort_button_label}
      >
        {children}
      </Typography>
      <DownIcon
        className={clsx(styles.sort_button_icon, {
          [styles.sort_button_icon_asc]: order === "asc",
        })}
      />
    </Button>
  );
};
