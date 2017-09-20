import React, { PropTypes } from 'react';
import { Root, Row, Title, RowCertInfo, ColCert, RowCert } from './styled/info';

const RequestInfo = (props, context) => {
  const {
    subject,
    publicKey,
    signature,
  } = props;
  const { lang } = context;

  const renderRowContainer = (title, value, monospace) => {
    if (value && title !== 'name') {
      return (
        <RowCertInfo>
          <ColCert>
            { title }:
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
          { lang['Info.Body.SubjectInfo'] }
        </Title>
        <RowCert>
          { renderRowContainer(lang['Info.Body.CommonName'], subject['Common Name']) }
          { renderRowContainer(lang['Info.Body.Organization'], subject.Organization) }
          { renderRowContainer(lang['Info.Body.OrganizationUnit'], subject['Organization Unit']) }
          { renderRowContainer(lang['Info.Body.Country'], subject.Country) }
          { renderRowContainer(lang['Info.Body.Region'], subject.Region) }
          { renderRowContainer(lang['Info.Body.City'], subject.City) }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { lang['Info.Body.PublicKeyInfo'] }
        </Title>
        <RowCert>
          { renderRowContainer(lang['Info.Body.Algorithm'], publicKey.algorithm) }
          { renderRowContainer(lang['Info.Body.ModulusBits'], publicKey.modulusBits) }
          { renderRowContainer(lang['Info.Body.PublicExponent'], publicKey.publicExponent) }
          { renderRowContainer(lang['Info.Body.NamedCurve'], publicKey.namedCurve) }
        </RowCert>
        <RowCert>
          { renderRowContainer(lang['Info.Body.Value'], publicKey.value, true) }
        </RowCert>
      </Row>

      <Row>
        <Title>
          { lang['Info.Body.Signature'] }
        </Title>
        <RowCert>
          { renderRowContainer(lang['Info.Body.Algorithm'], signature.algorithm) }
          { renderRowContainer(lang['Info.Body.Hash'], signature.hash) }
        </RowCert>
        <RowCert>
          { renderRowContainer(lang['Info.Body.Value'], signature.value, true) }
        </RowCert>
      </Row>

    </Root>
  );
};

RequestInfo.propTypes = {
  subject: PropTypes.shape({
    'Common Name': PropTypes.string,
    City: PropTypes.string,
    Country: PropTypes.string,
    Organization: PropTypes.string,
    'Organization Unit': PropTypes.string,
    Region: PropTypes.string,
  }),
  publicKey: PropTypes.shape({
    algorithm: PropTypes.string,
    hash: PropTypes.string,
    modulusBits: PropTypes.any,
    namedCurve: PropTypes.any,
    publicExponent: PropTypes.any,
    value: PropTypes.string,
  }),
  signature: PropTypes.shape({
    algorithm: PropTypes.string,
    hash: PropTypes.string,
    value: PropTypes.string,
  }),
};

RequestInfo.defaultProps = {
  subject: {
    'Common Name': '',
    City: '',
    Country: '',
    Organization: '',
    'Organization Unit': '',
    Region: '',
  },
  publicKey: {
    algorithm: '',
    hash: '',
    modulusBits: '',
    namedCurve: '',
    publicExponent: '',
    value: '',
  },
  signature: {
    algorithm: '',
    hash: '',
    value: '',
  },
};

RequestInfo.contextTypes = {
  lang: PropTypes.object,
};

export default RequestInfo;
