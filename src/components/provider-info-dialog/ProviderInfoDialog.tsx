import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@peculiar/react-components";
import { useTranslation } from "react-i18next";
import type { IProviderInfo } from "@peculiar/fortify-client-core";

import styles from "./styles/index.module.scss";

interface ProviderInfoDialogProps {
  data: IProviderInfo;
  onDialogClose: () => void;
}

export const ProviderInfoDialog: React.FunctionComponent<
  ProviderInfoDialogProps
> = (props) => {
  const { onDialogClose, data } = props;
  const { t } = useTranslation();

  const items = [
    {
      label: t("providers.dialog.info.list.token-name"),
      value: data.token?.label,
    },
    {
      label: t("providers.dialog.info.list.token-category.label"),
      value: t(
        `providers.dialog.info.list.token-category.value.${data.isHardware ? "hardware" : "software"}`
      ),
    },
  ];

  const renderInfoItems = () =>
    items.map(({ label, value }) => (
      <React.Fragment key={label}>
        <Typography variant="b2" color="gray-9">
          {label}
        </Typography>
        <Typography variant="b2" color="black">
          {value}
        </Typography>
      </React.Fragment>
    ));

  return (
    <Dialog open onClose={onDialogClose} className={styles.dialog}>
      <>
        <DialogTitle className={styles.dialog_title}>
          {t("providers.dialog.info.title", { name: data.name })}
        </DialogTitle>
        <DialogContent className={styles.dialog_content}>
          <div className={styles.dialog_content_list}>{renderInfoItems()}</div>
        </DialogContent>
        <DialogActions className={styles.dialog_footer}>
          <Button variant="outlined" onClick={onDialogClose}>
            {t("button.cancel")}
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
};
