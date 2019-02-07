import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EmptyCertIcon } from '../svg';

const IconStyled = styled(EmptyCertIcon)`
  width: 74px;
`;

const TextStyled = styled.div`
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0.03em;
  margin: 32px auto 0;
  max-width: 250px;
  color: ${props => (
    props.blackBg
      ? props.theme.sidebar.colorEmpty
      : props.theme.info.empty.color
  )};
  @media ${props => props.theme.media.mobile} {
    font-size: 15px;
    line-height: 20px;
    margin-top: 28px;
  }
`;

const ContainerStyled = styled.div`
  padding: 20px 50px;
  text-align: center;
  font-size: 0;
  display: inline-block;
  vertical-align: middle;
  width: 100%;
`;

const EmptyBodyStyled = styled.div`
  height: 100%;
  overflow: auto;
  ${props => props.theme.mixins.ghostVerticalAlign}
`;

const EmptyBody = ({ blackBg }, { lang }) => (
  <EmptyBodyStyled>
    <ContainerStyled>
      <IconStyled blackBg={blackBg} />
      <TextStyled blackBg={blackBg}>
        { lang['Sidebar.Body.Empty'] }
      </TextStyled>
    </ContainerStyled>
  </EmptyBodyStyled>
);

EmptyBody.propTypes = {
  blackBg: PropTypes.bool,
};

EmptyBody.defaultProps = {
  blackBg: false,
};

EmptyBody.contextTypes = {
  lang: PropTypes.object,
};

export default EmptyBody;
