import React from 'react';
import PropTypes from 'prop-types';
import { Root, Row, Title, RowCertInfo, ColCert, RowCert } from './styled/info';

const KeyInfo = (props, context) => {
  const {
    algorithm,
    usages,
    publicExponent,
    modulusLength,
    namedCurve,
  } = props;
  const { lang } = context;

  const renderRowContainer = (title, value, index, monospace) => {
    if (value && title !== 'name') {
      return (
        <RowCertInfo
          key={index}
        >
          <ColCert>
            { title }{title === 'None' ? '' : ':'}
          </ColCert>
          <ColCert monospace={monospace}>
            { value }
          </ColCert>
        </RowCertInfo>
      );
    }
    return null;
  };

  return (
    <Root>

      <Row>
        <Title>
          { lang['Info.Body.PublicKeyInfo'] }
        </Title>
        <RowCert>
          { renderRowContainer(lang['Info.Body.Algorithm'], algorithm) }
          { renderRowContainer(lang['Info.Body.ModulusBits'], modulusLength) }
          { renderRowContainer(lang['Info.Body.PublicExponent'], publicExponent) }
          { renderRowContainer(lang['Info.Body.NamedCurve'], namedCurve) }
          { renderRowContainer(lang['Info.Body.Usages'], usages.join(', ')) }
        </RowCert>
      </Row>

    </Root>
  );
};

KeyInfo.propTypes = {
  algorithm: PropTypes.string,
  publicExponent: PropTypes.oneOfType([PropTypes.any]),
  modulusLength: PropTypes.oneOfType([PropTypes.any]),
  namedCurve: PropTypes.oneOfType([PropTypes.any]),
  usages: PropTypes.arrayOf(PropTypes.string),
};

KeyInfo.defaultProps = {
  algorithm: '',
  usages: [],
  publicExponent: '',
  modulusLength: '',
  namedCurve: '',
};

KeyInfo.contextTypes = {
  lang: PropTypes.object,
};

export default KeyInfo;
