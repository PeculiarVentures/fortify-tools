import React, { PropTypes, Component } from 'react';
import { Dialog } from '../basic';

export default class EmptyProviders extends Component {
  static contextTypes = {
    lang: PropTypes.object,
  };

  render() {
    const { lang } = this.context;

    return (
      <Dialog
        title={lang['Dialog.EmptyProviders.Title']}
        acceptText=""
        cancelText=""
      />
    );
  }
}
