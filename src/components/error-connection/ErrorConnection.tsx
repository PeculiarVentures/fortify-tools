import React from 'react';
import { Typography } from '@peculiar/react-components';
import ErrorIcon from '../../icons/error-big.svg?react';
import styles from './styles/index.module.scss';

interface IErrorConnectionProps {
  message: string;
  description?: string;
}

export const ErrorConnection: React.FunctionComponent<IErrorConnectionProps> = (
  props,
) => {
  const { message, description } = props;

  return (
    <div className={styles.box_wrapper}>
      <div className={styles.icon_wrapper}>
        <ErrorIcon />
      </div>
      <Typography variant="h5" color="black">
        {message}
      </Typography>
      {description
        ? (
            <Typography variant="b2" color="gray-9">
              {description}
            </Typography>
          )
        : null}
    </div>
  );
};
