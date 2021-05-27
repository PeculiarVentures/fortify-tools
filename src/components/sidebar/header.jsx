import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { SelectField, SelectItem, SelectNative } from '../basic';
import { ModalActions } from '../../actions/ui';
import { ProviderActions, AppActions } from '../../actions/state';
import { ReloadIcon } from '../svg';
import * as S from './styled/header.styled';

export default class SidebarHeader extends Component {

  static propTypes = {
    loaded: PropTypes.bool,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    readOnly: PropTypes.bool,
  };

  static defaultProps = {
    loaded: false,
    providers: [],
    readOnly: false,
  };

  static contextTypes = {
    dispatch: PropTypes.func,
    deviceType: PropTypes.string,
    lang: PropTypes.object,
  };

  onClickCreateHandler = () => {
    const { dispatch } = this.context;
    dispatch(AppActions.create(true));
  };

  onClickImportHandler = () => {
    const { dispatch } = this.context;
    dispatch(ModalActions.open('import_certificate'));
  };

  onSelectHandler = (data) => {
    const { dispatch } = this.context;
    if (typeof data === 'string') {
      dispatch(ProviderActions.select(data));
    } else {
      dispatch(ProviderActions.select(data.value));
    }
  };

  handleReloadProvider = (id) => {
    if (id) {
      const { dispatch } = this.context;
      dispatch(ProviderActions.reload(id));
    }
  };

  renderActions() {
    const { loaded, readOnly } = this.props;
    const { lang } = this.context;

    return (
      <Fragment>
        <S.Btn
          disabled={!loaded || readOnly}
          onClick={this.onClickCreateHandler}
        >
          <S.CreateIc />
          { lang['Sidebar.Header.Btn.Create'] }
        </S.Btn>
        <S.Btn
          disabled={!loaded || readOnly}
          onClick={this.onClickImportHandler}
        >
          <S.ImportIc />
          { lang['Sidebar.Header.Btn.Import'] }
        </S.Btn>
      </Fragment>
    );
  }

  renderReadOnlyStatus() {
    return (
      <S.ReadOnlyStatus>
        <S.InfoIconStyles />
        <S.ReadOnlyMessage>
          Read-only provider
        </S.ReadOnlyMessage>
      </S.ReadOnlyStatus>
    );
  }

  render() {
    const { providers, readOnly } = this.props;
    const { deviceType, lang } = this.context;
    const selectedProvider = providers.filter(obj => obj.selected);
    const currentProvider = selectedProvider.length
      ? selectedProvider[0]
      : false;
    const disabledReload = !providers.length || !currentProvider.loaded;

    return (
      <S.SidebarHeader>
        <S.Logo>
          <img
            src="/images/logo.svg"
            alt="Fortify logo"
          />
        </S.Logo>
        <S.BtnsContainer>
          {readOnly ? this.renderReadOnlyStatus() : this.renderActions()}
        </S.BtnsContainer>
        <S.Container disabled={!providers.length}>
          <S.SelectContainer>
            {deviceType === 'phone' ? (
              <SelectNative
                labelText={lang['CertificateCreate.Provider.Field.Name']}
                placeholder={lang['Select.Label.Provider']}
                options={providers.map(item => ({
                  value: item.id,
                  name: item.name,
                }))}
                value={currentProvider ? currentProvider.id : ''}
                onChange={this.onSelectHandler}
              />
            ) : (
              <SelectField
                labelText={lang['CertificateCreate.Provider.Field.Name']}
                placeholder={lang['Select.Label.Provider']}
                value={{
                  name: currentProvider ? currentProvider.name : '',
                  value: currentProvider ? currentProvider.id : '',
                  index: currentProvider ? currentProvider.index : null,
                }}
                disabled={!providers.length}
                onChange={this.onSelectHandler}
              >
                {
                  providers.map((item, index) => (
                    <SelectItem
                      key={index}
                      value={item.id}
                      primaryText={item.name}
                    />
                  ))
                }
              </SelectField>
            )}
          </S.SelectContainer>
          <S.ReloadBtn
            title="Reload"
            disabled={disabledReload}
            onClick={() => {
              if (!disabledReload) {
                this.handleReloadProvider(currentProvider.id);
              }
            }}
          >
            <ReloadIcon />
          </S.ReloadBtn>
        </S.Container>
      </S.SidebarHeader>
    );
  }
}
