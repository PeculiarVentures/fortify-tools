import React, { PropTypes } from 'react';
import * as HeaderStyled from '../create_certificate/styled/header.styled';

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
          { lang['ImportCertificate.Header.Title'] }
        </HeaderStyled.Title>
      </HeaderStyled.Container>
    </HeaderStyled.Header>
  );
};

Header.propTypes = {
  onBack: PropTypes.func,
};

Header.defaultProps = {
  onBack: null,
};

Header.contextTypes = {
  lang: PropTypes.object,
};

export default Header;
