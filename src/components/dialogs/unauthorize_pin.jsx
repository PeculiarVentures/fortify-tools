import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '../basic';

export default class UnauthorizePinDialog extends Component {
  static propTypes = {
    onAccept: PropTypes.func.isRequired,
  };

  static contextTypes = {
    lang: PropTypes.object,
  };

  render() {
    const { onAccept } = this.props;
    const { lang } = this.context;

    return (
      <Dialog
        title={lang['Dialog.UnauthorizePin.Title']}
        acceptText={lang['Dialog.UnauthorizePin.Btn.Accept']}
        cancelText=""
        onAccept={onAccept}
      />
    );
  }
}
