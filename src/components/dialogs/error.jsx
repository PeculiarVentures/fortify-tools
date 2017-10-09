import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Dialog } from '../basic';

const DescrStyled = styled.div`
  font-size: 14px;
  line-height: 18px;
  margin-top: 30px;
  color: ${props => props.theme.dialog.colorDescr};
`;

export default class ErrorDialog extends Component {
  static contextTypes = {
    lang: PropTypes.object,
  };

  render() {
    const { message } = this.props;
    const { lang } = this.context;

    return (
      <Dialog
        title="Error"
        acceptText=""
        cancelText=""
      >
        <DescrStyled>
          {message}
        </DescrStyled>
      </Dialog>
    );
  }
}
