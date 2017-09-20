import React, { PropTypes, Component } from 'react';
import { Dialog } from '../basic';
import { QShortcuts } from '../../controllers';

export default class IncorrectPinDialog extends Component {

  static propTypes = {
    onAccept: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
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

  render() {
    const { onAccept, onCancel } = this.props;
    const { lang } = this.context;

    return (
      <Dialog
        title={lang['Dialog.IncorrectPin.Title']}
        acceptText={lang['Dialog.IncorrectPin.Btn.Accept']}
        cancelText={lang['Dialog.IncorrectPin.Btn.Cancel']}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );
  }
}
