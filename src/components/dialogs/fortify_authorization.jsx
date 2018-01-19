import React, { PropTypes, Component } from 'react';
import styled from 'styled-components';
import { Dialog } from '../basic';

const NumberStyled = styled.div`
  display: inline-block;
  vertical-align: top;
  width: 30px;
  line-height: 40px;
  background: rgba(242, 243, 244, .6);
  border-radius: ${props => props.theme.borderRadius}px;
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;
  color: ${props => props.theme.dialog.color};
  &:first-child {
    margin-left: 0;
  }
`;

const NumbersContainerStyled = styled.div`
  margin-top: 53px;
  text-align: center;
`;

const DescrStyled = styled.div`
  font-size: 13px;
  line-height: 18px;
  color: ${props => props.theme.dialog.colorDescr};
`;

export default class FortifyAuthorizationDialog extends Component {

  static propTypes = {
    pin: PropTypes.string,
  };

  static defaultProps = {
    pin: '',
  };

  static contextTypes = {
    lang: PropTypes.object,
  };

  render() {
    const { pin } = this.props;
    const { lang } = this.context;

    return (
      <Dialog
        title={''}
        acceptText={''}
        cancelText={''}
      >
        <DescrStyled>
          { lang['Dialog.FortifyAuthorization.Description'] }
        </DescrStyled>
        <NumbersContainerStyled>
          {
            pin.split('').map((number, index) => (
              <NumberStyled
                key={index}
              >
                { number }
              </NumberStyled>
            ))
          }
        </NumbersContainerStyled>
      </Dialog>
    );
  }
}
