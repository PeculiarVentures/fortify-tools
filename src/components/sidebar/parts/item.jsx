import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ItemActions } from '../../../actions/state';
import { DocCertIcon, DocCertPrivateIcon } from '../../svg';

const AlgName = styled.div`
  font-size: 10px;
  line-height: 16px;
  letter-spacing: 0.02em;
  margin-top: 4px;
  display: inline-block;
  vertical-align: top;
  ${props => props.theme.mixins.truncateText}
  width: calc(100% - 60px);
  padding-right: 5px;
  opacity: 0.5;
  transition: color 300ms;
`;

const Size = styled(AlgName)`
  width: 60px;
  padding-right: 0;
  text-align: right;
`;

const Issuer = styled(AlgName)`
  width: 100%;
  margin-top: 0;
`;

const Name = styled.div`
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0.03em;
  transition: color 300ms;
  ${props => props.theme.mixins.truncateText}
`;

const CertDescrStyled = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  width: calc(100% - 20px - 40px);
  @media ${props => props.theme.media.mobile} {
    margin-left: 10px;
    width: calc(100% - 10px - 40px);
  }
`;

const ContainerStyled = styled.div`
  font-size: 0;
`;

const IconStyled = styled.div`
  display: inline-block;
  vertical-align: middle;
  width: 40px;
  height: 40px;
  transition: fill 300ms;
`;

const CertificateStyled = styled.div`
  cursor: pointer;
  padding: 15px 30px 15px 40px;
  color: #5F6B73;
  fill: rgba(112, 125, 134, .8);
  transition: opacity 300ms;
  &:hover {
    color: #4DA3FC;
    fill: #4DA3FC;
    opacity: .6;
  }
  ${props => {
    if (props.selected) {
      return `
        pointer-events: none;
        color: #4DA3FC;
        fill: #4DA3FC;
      `;
    }
    return '';
  }}
`;

const Item = (props, context) => {
  const {
    id,
    name,
    type,
    algorithm,
    selected,
    size,
    issuer,
    hasPrivateKey,
  } = props;
  const { dispatch, handleRootAction } = context;

  const onClickhandler = () => {
    handleRootAction({
      type: 'SIDEBAR:CLOSE',
    });
    if (!selected) {
      dispatch(ItemActions.select(id));
    }
  };

  const renderIcon = () => {
    if (hasPrivateKey) {
      return (
        <DocCertPrivateIcon />
      );
    }

    return (
      <DocCertIcon />
    );
  };

  return (
    <CertificateStyled
      selected={selected}
      onClick={onClickhandler}
    >
      <ContainerStyled>
        <IconStyled>
          {renderIcon()}
        </IconStyled>
        <CertDescrStyled>
          <Name>
            { name }
          </Name>
          {issuer && (
            <Issuer>
              { issuer }
            </Issuer>
          )}
          <AlgName>
            { algorithm }
          </AlgName>
          <Size>
            { size }
          </Size>
        </CertDescrStyled>
      </ContainerStyled>
    </CertificateStyled>
  );
};

Item.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  algorithm: PropTypes.string,
  selected: PropTypes.bool,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  issuer: PropTypes.string,
  hasPrivateKey: PropTypes.bool,
};

Item.defaultProps = {
  id: '',
  name: '',
  type: '',
  algorithm: '',
  selected: false,
  size: '',
  issuer: '',
  hasPrivateKey: false,
};

Item.contextTypes = {
  dispatch: PropTypes.func,
  handleRootAction: PropTypes.func,
};

export default Item;
