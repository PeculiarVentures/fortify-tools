import React, { ComponentProps } from 'react';
import { clsx } from 'clsx';
import { Tooltip, Typography } from '@peculiar/react-components';
import { HighlightedText } from '../highlighted-text';
import styles from './styles/index.module.scss';

interface ICertificateNameProps {
  name?: string;
  highlight?: string;
  className?: ComponentProps<'div'>['className'];
}

export const CertificateName: React.FunctionComponent<ICertificateNameProps> = (
  props,
) => {
  const {
    className, name, highlight,
  } = props;

  if (!name) {
    return null;
  }

  const text = highlight
    ? (
        <HighlightedText text={name} highlight={highlight} />
      )
    : (
        name
      );

  return (
    <Tooltip
      placement="bottom-start" offset={5}
      title={text}
    >
      <Typography
        className={clsx(className, styles.certificate_name)}
        variant="b2"
        color="black"
      >
        {text}
      </Typography>
    </Tooltip>
  );
};
