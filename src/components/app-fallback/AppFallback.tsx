import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@peculiar/react-components";
import { FallbackProps } from "../error-boundary";

import ErrorIcon from "../../icons/error-big.svg?react";

import styles from "./styles/index.module.scss";

export const AppFallback: React.FunctionComponent<FallbackProps> = (props) => {
  const { resetErrorBoundary } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.box}>
      <div className={styles.content}>
        <div className={styles.icon_wrapper}>
          <ErrorIcon />
        </div>
        <Typography variant="h5" color="black">
          {t("app-error.message")}
        </Typography>
        <Typography variant="b2" color="gray-9">
          {t("app-error.description")}
        </Typography>
        <div className={styles.buttons_group}>
          <Button component="a" href="/" variant="outlined">
            {t("app-error.button.home-page")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={resetErrorBoundary}
          >
            {t("app-error.button.try-again")}
          </Button>
        </div>
      </div>
    </div>
  );
};
