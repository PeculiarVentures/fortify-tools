import { Typography } from "@peculiar/react-components";
import React, { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles/index.module.scss";
import clsx from "clsx";

interface DateProps {
  date?: Date;
  className?: ComponentProps<"div">["className"];
}
export const Date: React.FunctionComponent<DateProps> = (props) => {
  const { date, className } = props;
  const { i18n } = useTranslation();

  return (
    <Typography
      className={clsx(className, styles.date)}
      variant="b2"
      color="black"
    >
      {date
        ? date.toLocaleDateString(i18n.resolvedLanguage, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "-"}
    </Typography>
  );
};
