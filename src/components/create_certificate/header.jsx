import React from 'react';
import PropTypes from 'prop-types';
import * as HeaderStyled from './styled/header.styled';

const Header = (props, context) => {
  const { onBack } = props;
  const { lang } = context;

  const onClickhandler = () => {
    if (onBack) onBack();
  };

  return (
    <HeaderStyled.Header>
      <HeaderStyled.Container>
        <HeaderStyled.Btn
          onClick={onClickhandler}
        >
          <HeaderStyled.IconStyled />
          { lang['CertificateCreate.Header.Btn.Back'] }
        </HeaderStyled.Btn>
        <HeaderStyled.Title>
          { lang['CertificateCreate.Header.Title'] }
        </HeaderStyled.Title>
      </HeaderStyled.Container>
    </HeaderStyled.Header>
  );
};

Header.propTypes = {
  onBack: PropTypes.func,
};

Header.contextTypes = {
  lang: PropTypes.object,
};

export default Header;
