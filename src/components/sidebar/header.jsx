import React, { PropTypes, Component } from 'react';
import { SelectField, SelectItem, SelectNative } from '../basic';
import { ModalActions } from '../../actions/ui';
import { ProviderActions, AppActions } from '../../actions/state';
import enLang from '../../langs/en.json';
import { ReloadIcon, Logo } from '../svg';
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

  render() {
    const { loaded, providers, readOnly } = this.props;
    const { deviceType } = this.context;
    const selectedProvider = providers.filter(obj => obj.selected);
    const currentProvider = selectedProvider.length
      ? selectedProvider[0]
      : false;
    const disabledReload = !providers.length || !currentProvider.loaded;

    return (
      <S.SidebarHeader>
        <S.Logo>
          <Logo />
        </S.Logo>
        <S.BtnsContainer>
          <S.Btn
            disabled={!loaded || readOnly}
            onClick={this.onClickCreateHandler}
          >
            <S.CreateIc />
            { enLang['Sidebar.Header.Btn.Create'] }
          </S.Btn>
          <S.Btn
            disabled={!loaded || readOnly}
            onClick={this.onClickImportHandler}
          >
            <S.ImportIc />
            { enLang['Sidebar.Header.Btn.Import'] }
          </S.Btn>
        </S.BtnsContainer>
        <S.Container disabled={!providers.length}>
          <S.SelectContainer>
            {
              deviceType === 'phone'
              ? <SelectNative
                labelText={enLang['CertificateCreate.Provider.Field.Name']}
                placeholder={enLang['Select.Label.Provider']}
                options={providers.map(item => ({
                  value: item.id,
                  name: item.name,
                }))}
                value={currentProvider ? currentProvider.id : ''}
                onChange={this.onSelectHandler}
              />
              : <SelectField
                labelText={enLang['CertificateCreate.Provider.Field.Name']}
                placeholder={enLang['Select.Label.Provider']}
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
            }
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
