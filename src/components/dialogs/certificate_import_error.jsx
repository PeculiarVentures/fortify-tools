import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Dialog } from '../basic';

const DescrStyled = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-top: 30px;
  color: ${props => props.theme.dialog.colorDescr};
`;

export default class CertificateImportErrorDialog extends Component {
  static propTypes = {
    onAccept: PropTypes.func.isRequired,
    message: PropTypes.string,
  };

  static contextTypes = {
    lang: PropTypes.object,
  };

  render() {
    const { onAccept, message } = this.props;
    const { lang } = this.context;

    return (
      <Dialog
        title={lang['Dialog.CertificateImportError.Title']}
        acceptText={lang['Dialog.CertificateImportError.Btn.Accept']}
        cancelText=""
        onAccept={onAccept}
      >
        <DescrStyled>
          { message }
        </DescrStyled>
      </Dialog>
    );
  }
}
