import { Typography } from '@peculiar/react-components';
import React, { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import styles from './styles/index.module.scss';

interface IDateProps {
  date?: Date;
  className?: ComponentProps<'div'>['className'];
}

export const Date: React.FunctionComponent<IDateProps> = (props) => {
  const { date, className } = props;
  const { i18n } = useTranslation();

  return (
    <Typography
      className={clsx(className, styles.date)}
      variant="b2"
      color="black"
    >
      {date
        ? date.toLocaleDateString(i18n.resolvedLanguage, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : '-'}
    </Typography>
  );
};
