import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '../basic';
import { QShortcuts } from '../../controllers';

export default class EmptyPinDialog extends Component {

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
        title={lang['Dialog.EmptyPin.Title']}
        acceptText={lang['Dialog.IncorrectPin.Btn.Accept']}
        cancelText={lang['Dialog.IncorrectPin.Btn.Cancel']}
        onAccept={onAccept}
        onCancel={onCancel}
      />
    );
  }
}
