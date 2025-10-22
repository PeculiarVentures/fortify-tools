import React from 'react';
import { IProviderInfo } from '@peculiar/fortify-client-core';
import { useTranslation } from 'react-i18next';
import { Skeleton, Typography } from '@peculiar/react-components';
import { CertificatesProvidersListItem } from '../certificates-providers-list-item';
import AttentionCircleIcon from '../../icons/attention-circle.svg?react';
import styles from './styles/index.module.scss';

interface ICertificatesProvidersListProps {
  providers: Pick<IProviderInfo, 'id' | 'name' | 'isRemovable' | 'readOnly'>[];
  currentProviderId?: string;
  onSelect?: (id: string) => void;
  loading?: boolean;
}

export const CertificatesProvidersList: React.FunctionComponent<
  ICertificatesProvidersListProps
> = (props) => {
  const {
    providers, currentProviderId, loading, onSelect,
  } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.list_box_wrapper}>
      <Typography
        className={styles.label} variant="c1"
        color="gray-9"
      >
        {t('providers.list.label')}
      </Typography>

      {/* eslint-disable-next-line no-nested-ternary */}
      {loading
        ? (
            <div className={styles.loading_skeleton}>
              {[...Array(4).keys()].map((index) => (
                <Skeleton
                  className={styles.loading_skeleton_item}
                  key={`scel-itm-${index}`}
                  height={50}
                />
              ))}
            </div>
          )
        : !providers?.length
            ? (
                <div className={styles.empty_list}>
                  <div className={styles.empty_list_icon}>
                    <AttentionCircleIcon />
                  </div>
                  <Typography variant="s1" color="gray-8">
                    {t('providers.list.empty-text')}
                  </Typography>
                </div>
              )
            : (
                <div className={styles.list_wrapper}>
                  <ul className={styles.list}>
                    {providers.map((provider) => (
                      <CertificatesProvidersListItem
                        isSelected={currentProviderId === provider.id}
                        key={provider.id}
                        provider={provider}
                        onClick={(id) => {
                          if (onSelect) {
                            onSelect(id);
                          }
                        }}
                      />
                    ))}
                  </ul>
                </div>
              )}
    </div>
  );
};
