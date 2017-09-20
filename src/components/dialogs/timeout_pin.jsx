import React, { PropTypes, Component } from 'react';
import { Dialog } from '../basic';

export default class TimeoutPinDialog extends Component {
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
        title={lang['Dialog.TimeoutPin.Title']}
        acceptText={lang['Dialog.TimeoutPin.Btn.Accept']}
        cancelText=""
        onAccept={onAccept}
      />
    );
  }
}
