import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@peculiar/react-components';
import { useTranslation } from 'react-i18next';
import type { IProviderInfo } from '@peculiar/fortify-client-core';
import styles from './styles/index.module.scss';

interface IProviderInfoDialogProps {
  data: IProviderInfo;
  onDialogClose: () => void;
}

export const ProviderInfoDialog: React.FunctionComponent<
  IProviderInfoDialogProps
> = (props) => {
  const { onDialogClose, data } = props;
  const { t } = useTranslation();

  const items = [
    {
      label: t('providers.dialog.info.list.token-name'),
      value: data.token?.label,
    },
    {
      label: t('providers.dialog.info.list.token-category.label'),
      value: t(
        `providers.dialog.info.list.token-category.value.${data.isHardware ? 'hardware' : 'software'}`,
      ),
    },
    {
      label: t('providers.dialog.info.list.extractable.label'),
      value: t(
        `providers.dialog.info.list.extractable.value.${data.isRemovable ? 'yes' : 'no'}`,
      ),
    },
    {
      label: t('providers.dialog.info.list.serial-number'),
      value: data.token?.serialNumber,
    },
    {
      label: t('providers.dialog.info.list.free-space'),
      value:
        // Some providers return this value as "unknown number"
        // We don't want to show the value in this case (requested by @microshine)
        data.token?.freePrivateMemory == 18446744073709552000
          ? undefined
          : data.token?.freePrivateMemory,
    },
    {
      label: t('providers.dialog.info.list.hardware-version'),
      value: data.token?.hardwareVersion
        ? `${data.token?.hardwareVersion?.major}.${data.token?.hardwareVersion?.minor}`
        : undefined,
    },
    {
      label: t('providers.dialog.info.list.firmware-version'),
      value: data.token?.firmwareVersion
        ? `${data.token?.firmwareVersion?.major}.${data.token?.firmwareVersion?.minor}`
        : undefined,
    },
    {
      label: t('providers.dialog.info.list.model'),
      value: data.token?.model,
    },
    {
      label: t('providers.dialog.info.list.algorithms'),
      value: data.algorithms?.join(', '),
    },
  ];

  const renderInfoItems = () =>
    items.map(({ label, value }) => (
      <React.Fragment key={label}>
        <Typography variant="b2" color="gray-9">
          {label}
          :
        </Typography>
        <Typography variant="b2" color="black">
          {value || t('providers.dialog.info.empty-value')}
        </Typography>
      </React.Fragment>
    ));

  return (
    <Dialog
      open className={styles.dialog}
      onClose={onDialogClose}
    >
      <>
        <DialogTitle className={styles.dialog_title}>
          {t('providers.dialog.info.title', { name: data.name })}
        </DialogTitle>
        <DialogContent className={styles.dialog_content}>
          <div className={styles.dialog_content_list}>{renderInfoItems()}</div>
        </DialogContent>
        <DialogActions className={styles.dialog_footer}>
          <Button variant="outlined" onClick={onDialogClose}>
            {t('button.cancel')}
          </Button>
        </DialogActions>
      </>
    </Dialog>
  );
};
