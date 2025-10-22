import { useTranslation } from 'react-i18next';
import { Button, Typography } from '@peculiar/react-components';
import ErrorIcon from '../../icons/error-big.svg?react';
import styles from './styles/index.module.scss';

export const ConnectionNotSupported = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.box}>
      <div className={styles.content}>
        <div className={styles.icon_wrapper}>
          <ErrorIcon />
        </div>
        <Typography
          variant="h5" color="black"
          className={styles.message}
        >
          {t('connection-not-supported.message')}
        </Typography>
        <Typography variant="b2" color="gray-9">
          {t('connection-not-supported.description')}
        </Typography>
        <div className={styles.buttons_group}>
          <Button
            component="a"
            href="https://fortifyapp.com"
            variant="outlined"
          >
            {t('connection-not-supported.button.home-page')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            component="a"
            href="https://fortifyapp.com/docs#support"
          >
            {t('connection-not-supported.button.get-started')}
          </Button>
        </div>
      </div>
    </div>
  );
};
