import React from "react";
import { useTranslation } from "react-i18next";
import { IconButton, Tooltip } from "@peculiar/react-components";

import DeleteIcon from "../../icons/delete.svg?react";

interface CertificateDeleteButtonProps {
  onClick: () => void;
}

export const CertificateDeleteButton: React.FunctionComponent<
  CertificateDeleteButtonProps
> = (props) => {
  const { onClick } = props;
  const { t } = useTranslation();

  return (
    <Tooltip title={t("certificates.list.action.delete")} offset={5}>
      <IconButton
        onClick={(event) => {
          event.stopPropagation();
          onClick();
        }}
        size="small"
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};
