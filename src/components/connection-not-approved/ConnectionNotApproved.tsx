import React from "react";
import { Button, Typography } from "@peculiar/react-components";
import { Trans, useTranslation } from "react-i18next";
import FortifyIcon from "../../icons/fortify.svg?react";

import styles from "./styles/index.module.scss";

export const ConnectionNotApproved: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.box_wrapper}>
      <div className={styles.icon_wrapper}>
        <FortifyIcon />
      </div>
      <Typography variant="h5" color="black">
        <Trans
          i18nKey="connection.error.connection-not-approved.message"
          values={{ name: window.location.origin }}
          components={[
            <Typography color="primary" variant="h5">
              {0}
            </Typography>,
          ]}
        />
      </Typography>
      <Typography variant="b2" color="gray-9">
        {t("connection.error.connection-not-approved.description")}
      </Typography>
      <div className={styles.buttons_wrapper}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            window.location.reload();
          }}
        >
          {t("button.try-again")}
        </Button>
      </div>
    </div>
  );
};
