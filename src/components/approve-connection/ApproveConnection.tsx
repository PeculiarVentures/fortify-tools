import React from 'react';
import { Typography } from '@peculiar/react-components';
import { useTranslation } from 'react-i18next';
import FortifyIcon from '../../icons/fortify.svg?react';
import styles from './styles/index.module.scss';

export const ApproveConnection: React.FunctionComponent<{
  challenge: string;
}> = (props) => {
  const { challenge } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.box_wrapper}>
      <div className={styles.icon_wrapper}>
        <FortifyIcon />
      </div>

      <Typography variant="h5" color="black">
        {t('connection.approve.message')}
      </Typography>
      {challenge?.length
        ? (
            <div className={styles.challenge}>
              {challenge.split('').map((el, index) => (
                <div key={`challenge-itm-${el}-${index}`}>
                  <Typography variant="h5" color="black">
                    {el}
                  </Typography>
                </div>
              ))}
            </div>
          )
        : null}
      <Typography variant="b2" color="gray-9">
        {t('connection.approve.description')}
      </Typography>
    </div>
  );
};
