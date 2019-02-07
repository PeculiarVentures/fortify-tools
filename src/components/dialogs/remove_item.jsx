import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '../basic';
import { QShortcuts } from '../../controllers';

export default class RemoveItemDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    certificateName: PropTypes.string,
    certificateType: PropTypes.string,
  };

  static defaultProps = {
    certificateName: '',
    certificateType: '',
  };

  static contextTypes = {
    lang: PropTypes.object,
  };

  constructor() {
    super();
    this.unbind = () => {};
  }

  componentDidMount() {
    const { onCancel } = this.props;
    QShortcuts.on('ESCAPE', onCancel);

    this.unbind = () => {
      QShortcuts.off('ESCAPE', onCancel);
    };
  }

  componentWillUnmount() {
    this.unbind();
  }

  getTypeText() {
    const { certificateType } = this.props;
    const { lang } = this.context;

    switch (certificateType) {
      case 'certificate':
        return lang['Dialog.RemoveCertificate.Type.Certificate'];

      case 'request':
        return lang['Dialog.RemoveCertificate.Type.Request'];

      case 'key':
        return lang['Dialog.RemoveCertificate.Type.Key'];

      default:
        return null;
    }
  }

  render() {
    const { onAccept, onCancel, certificateName } = this.props;
    const { lang } = this.context;

    return (
      <Dialog
        title={`${lang['Dialog.RemoveCertificate.Title']} ${this.getTypeText()} "${certificateName}"?`}
        acceptText={lang['Dialog.RemoveCertificate.Btn.Accept']}
        cancelText={lang['Dialog.RemoveCertificate.Btn.Cancel']}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );
  }
}
