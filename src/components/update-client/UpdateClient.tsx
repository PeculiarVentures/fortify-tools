import React from "react";
import { Typography } from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import UpdateAppIcon from "../../icons/update-app.svg?react";

import styles from "./styles/index.module.scss";

export const UpdateClient: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.box_wrapper}>
      <div className={styles.icon_wrapper}>
        <UpdateAppIcon />
      </div>
      <Typography variant="h5" color="black">
        {t("connection.error.update-client.message")}
      </Typography>
      <Typography variant="b2" color="gray-9">
        {t("connection.error.update-client.description")}
      </Typography>
    </div>
  );
};
