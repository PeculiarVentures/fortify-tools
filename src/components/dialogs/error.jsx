import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Dialog } from '../basic';

const DescrStyled = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-top: 30px;
  color: ${props => props.theme.dialog.colorDescr};
`;

export default class ErrorDialog extends Component {
  static propTypes = {
    message: PropTypes.string,
    onAccept: PropTypes.func,
  };

  static contextTypes = {
    lang: PropTypes.object,
  };

  render() {
    const { message, onAccept } = this.props;
    const { lang } = this.context;

    return (
      <Dialog
        title={lang['Dialog.Error.Title']}
        acceptText={lang['Dialog.Error.Btn.Accept']}
        cancelText=""
        onAccept={onAccept}
      >
        <DescrStyled>
          {message}
        </DescrStyled>
      </Dialog>
    );
  }
}
