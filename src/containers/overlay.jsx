import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Taber } from '../helpers';
import { SegueHandler } from '../components/basic';
import * as Dialog from '../components/dialogs';
import { ACTIONS_CONST } from '../constants';
import { WSActions } from '../actions/state';
import { DialogActions } from '../actions/ui';
import ImportCertificate from '../components/import_certificate';
import { WSController } from '../controllers/webcrypto_socket';
import { EventChannel } from '../controllers';

const OverlayStyled = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 11;
  overflow: auto;
`;

export default class Overlay extends Component {

  static propTypes = {
    dialog: PropTypes.string,
    modal: PropTypes.string,
    provider: PropTypes.oneOfType([
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    dialog: '',
    modal: '',
  };

  static contextTypes = {
    dispatch: PropTypes.func,
  };

  static checkNeedRender({ dialog, modal }) {
    return dialog || modal;
  }

  constructor() {
    super();

    this.state = {
      message: '',
    };

    EventChannel.on('DIALOG:SET_MESSAGE', this.onSetMessage);
  }

  componentDidMount() {
    if (Overlay.checkNeedRender(this.props)) {
      this.initTaber();
    }
  }

  componentDidUpdate(prevProps) {
    const needRender = Overlay.checkNeedRender(this.props);

    if (Overlay.checkNeedRender(prevProps) !== needRender) {
      if (needRender) {
        this.initTaber();
      }
    }

    if (prevProps.dialog !== this.props.dialog && !this.props.dialog) {
      this.onSetMessage('');
    }
  }

  onSetMessage = (message) => {
    this.setState({
      message,
    });
  };

  initTaber() {
    return new Taber({
      rootNode: this.refRootNode,
    });
  }

  renderModal() {
    const { modal, providers } = this.props;

    if (modal) {
      return (
        <SegueHandler
          query={modal}
          name="Confirms"
        >
          <ImportCertificate
            name="import_certificate"
            providers={providers}
          />
        </SegueHandler>
      );
    }

    return null;
  }

  getSelectedItemProps() {
    const { provider } = this.props;
    let item = false;

    if (provider.items) {
      provider.items.map((itm) => {
        if (itm.selected) {
          item = itm;
        }
        return true;
      });
    }

    return item;
  }

  handleAction = (payload) => {
    const { provider } = this.props;
    const { type, value } = payload;
    const { dispatch } = this.context;

    switch (type) {
      case ACTIONS_CONST.WS_REMOVE_ITEM: {
        return dispatch(WSActions.removeItem());
      }

      case ACTIONS_CONST.DIALOG_OPEN: {
        return dispatch(DialogActions.open(value));
      }

      case ACTIONS_CONST.DIALOG_CLOSE: {
        return dispatch(DialogActions.close());
      }

      case 'TRY_AGAIN_LOGIN': {
        dispatch(WSActions.login(provider.id));
        return dispatch(DialogActions.close());
      }

      case 'TRY_AGAIN_PIN': {
        WSController.isLogged();
        return dispatch(DialogActions.close());
      }

      default:
        return true;
    }
  };

  renderDialog() {
    const { dialog, provider } = this.props;
    const { message } = this.state;

    if (dialog) {
      const selectedItemProps = provider ? provider.items.filter(i => i.selected)[0] : false;
      return (
        <SegueHandler
          query={dialog}
          name="Confirms"
        >
          <Dialog.RemoveItemDialog
            name="remove_item"
            certificateName={selectedItemProps ? selectedItemProps.name : ''}
            certificateType={selectedItemProps ? selectedItemProps.type : ''}
            onAccept={() => (
              this.handleAction({
                type: ACTIONS_CONST.WS_REMOVE_ITEM,
              })
            )}
            onCancel={() => (
              this.handleAction({
                type: ACTIONS_CONST.DIALOG_CLOSE,
              })
            )}
          />
          <Dialog.RemoveItemErrorDialog
            name="remove_item_error"
            certificateName={selectedItemProps ? selectedItemProps.name : ''}
            certificateType={selectedItemProps ? selectedItemProps.type : ''}
            onAccept={() => (
              this.handleAction({
                type: ACTIONS_CONST.DIALOG_OPEN,
                value: 'remove_item',
              })
            )}
            onCancel={() => (
              this.handleAction({
                type: ACTIONS_CONST.DIALOG_CLOSE,
              })
            )}
            message={message}
          />
          <Dialog.IncorrectPinDialog
            name="incorrect_pin"
            onAccept={() => (
              this.handleAction({
                type: 'TRY_AGAIN_LOGIN',
              })
            )}
            onCancel={() => (
              this.handleAction({
                type: ACTIONS_CONST.DIALOG_CLOSE,
              })
            )}
          />
          <Dialog.UnauthorizePinDialog
            name="unauthorize_pin"
            onAccept={() => (
              this.handleAction({
                type: 'TRY_AGAIN_PIN',
              })
            )}
          />
          <Dialog.NotSupportedLocalhostDialog
            name="not_supported_localhost"
          />
          <Dialog.RequestCreateErrorDialog
            name="request_create_error"
            message={message}
            onAccept={() => {
              this.handleAction({
                type: ACTIONS_CONST.DIALOG_CLOSE,
              });
            }}
          />
          <Dialog.CertificateImportErrorDialog
            message={message}
            name="certificate_import_error"
            onAccept={() => {
              this.handleAction({
                type: ACTIONS_CONST.DIALOG_CLOSE,
              });
            }}
          />
          <Dialog.LoadDialog
            name="load"
          />
          <Dialog.ServerOfflineDialog
            name="server_offline"
          />
          <Dialog.FortifyAuthorizationDialog
            name="fortify_authorization"
            message={message}
          />
          <Dialog.EmptyProviders
            name="empty_providers"
          />
        </SegueHandler>
      );
    }

    return null;
  }

  render() {
    if (Overlay.checkNeedRender(this.props)) {
      return (
        <OverlayStyled
          innerRef={rootNode => (this.refRootNode = rootNode)}
        >
          { this.renderModal() }
          { this.renderDialog() }
        </OverlayStyled>
      );
    }

    return null;
  }
}
