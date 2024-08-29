import React from "react";
import { Button, Typography } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import { APP_FORTIFY_DOWLOAD_APP_URL } from "../../config";
import LaunchAppIcon from "../../icons/launch-app.svg?react";

import styles from "./styles/index.module.scss";

export const ConnectionNotDetected: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.box_wrapper}>
      <div className={styles.icon_wrapper}>
        <LaunchAppIcon />
      </div>
      <Typography variant="h5" color="black">
        {t("connection.error.connection-not-detect.message")}
      </Typography>
      <Typography variant="b2" color="gray-9">
        {t("connection.error.connection-not-detect.description")}
      </Typography>
      <div className={styles.buttons_wrapper}>
        <Button
          variant="outlined"
          component="a"
          href={APP_FORTIFY_DOWLOAD_APP_URL}
          target="_blank"
        >
          {t("connection.error.connection-not-detect.button")}
        </Button>
      </div>
    </div>
  );
};
