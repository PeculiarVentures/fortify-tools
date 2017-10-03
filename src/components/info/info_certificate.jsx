import React, { PropTypes } from 'react';
import { Root, Row, Title, RowCertInfo, RowCert, ColCert } from './styled/info';

const regexpURl = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

const CertificateInfo = (props, context) => {
  const {
    general,
    subject,
    issuer,
    publicKey,
    signature,
    extensions,
  } = props;
  const { lang } = context;

  const renderRowContainer = (title, value, index, monospace) => {
    if (value && title !== 'name') {
      return (
        <RowCertInfo
          key={index}
        >
          <ColCert>
            {title}{title === 'None' ? '' : ':'}
          </ColCert>
          <ColCert monospace={monospace}>
            {regexpURl.test(value) ? (
              <a href={value} target="_blank" rel="noopener noreferrer">
                {value}
              </a>
            ) : value}
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
          {lang['Info.Body.General']}
        </Title>
        <RowCert>
          {renderRowContainer(lang['Info.Body.SerialNumber'], general.serialNumber, '', true)}
          {renderRowContainer(lang['Info.Body.Version'], general.version)}
          {renderRowContainer(lang['Info.Body.Issued'], general.notBefore)}
          {renderRowContainer(lang['Info.Body.Expired'], general.notAfter)}
          <RowCert>
            {renderRowContainer(lang['Info.Body.Thumbprint'], general.thumbprint, '', true)}
          </RowCert>
        </RowCert>
      </Row>

      <Row>
        <Title>
          {lang['Info.Body.SubjectName']}
        </Title>
        <RowCert>
          {
            Object.keys(subject).map((iss, index) => renderRowContainer(lang[`Info.Body.${iss.replace(' ', '')}`] || iss, subject[iss], index))
          }
        </RowCert>
      </Row>

      <Row>
        <Title>
          {lang['Info.Body.IssuerName']}
        </Title>
        <RowCert>
          {
            Object.keys(issuer).map((iss, index) => renderRowContainer(lang[`Info.Body.${iss.replace(' ', '')}`] || iss, issuer[iss], index))
          }
        </RowCert>
      </Row>

      <Row>
        <Title>
          {lang['Info.Body.PublicKeyInfo']}
        </Title>
        <RowCert>
          {renderRowContainer(lang['Info.Body.Algorithm'], publicKey.algorithm)}
          {renderRowContainer(lang['Info.Body.ModulusBits'], publicKey.modulusBits)}
          {renderRowContainer(lang['Info.Body.PublicExponent'], publicKey.publicExponent)}
          {renderRowContainer(lang['Info.Body.NamedCurve'], publicKey.namedCurve)}
        </RowCert>
        <RowCert>
          {renderRowContainer(lang['Info.Body.Value'], publicKey.value, '', true)}
        </RowCert>
      </Row>

      <Row>
        <Title>
          {lang['Info.Body.Signature']}
        </Title>
        <RowCert>
          {renderRowContainer(lang['Info.Body.Algorithm'], signature.algorithm)}
          {renderRowContainer(lang['Info.Body.Hash'], signature.hash)}
        </RowCert>
        <RowCert>
          {renderRowContainer(lang['Info.Body.Value'], signature.value, '', true)}
        </RowCert>
      </Row>

      <Row>
        <Title>
          {lang['Info.Body.Extensions']}
        </Title>
        {extensions.length ? (
          extensions.map((ext, index) => {
            const { name, critical, value } = ext;
            let valueBlock;

            if (typeof value === 'string') {
              valueBlock = renderRowContainer(lang['Info.Body.Value'], value, '', true);
            } else if (Array.isArray(value) && typeof value[0] === 'string') {
              valueBlock = renderRowContainer(lang['Info.Body.Value'], value.join(', '), '', true);
            } else {
              valueBlock = value.map((val, ind) => (
                Object.keys(val).map((keyVal, keyIndex) => {
                  let valueText = lang[`Info.Body.${keyVal}`] || keyVal;
                  if (keyVal === 'Purpose' || keyVal === 'Method') {
                    valueText = `${valueText} #${ind + 1}`;
                  }
                  return renderRowContainer(valueText, val[keyVal], `${ind}${keyIndex}`, true);
                })
              ));
            }

            return (
              <RowCert key={index}>
                {renderRowContainer(lang['Info.Body.Name'], name)}
                {renderRowContainer(lang['Info.Body.Critical'], critical ? lang['Info.Body.Critical.Yes'] : lang['Info.Body.Critical.No'])}
                {valueBlock}
              </RowCert>
            );
          })
        ) : (
          <RowCert>
            {renderRowContainer(lang['Info.Body.None'], ' ')}
          </RowCert>
        )}
      </Row>
    </Root >
  );
};

CertificateInfo.propTypes = {
  general: PropTypes.shape({
    serialNumber: PropTypes.string,
    version: PropTypes.number,
    notBefore: PropTypes.string,
    notAfter: PropTypes.string,
    thumbprint: PropTypes.string,
  }),
  subject: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  issuer: PropTypes.oneOfType([
    PropTypes.object,
  ]),
  publicKey: PropTypes.shape({
    modulusBits: PropTypes.any,
    namedCurve: PropTypes.any,
    publicExponent: PropTypes.any,
    algorithm: PropTypes.string,
    value: PropTypes.string,
  }),
  signature: PropTypes.shape({
    algorithm: PropTypes.string,
    hash: PropTypes.string,
    value: PropTypes.string,
  }),
  extensions: PropTypes.oneOfType([
    PropTypes.array,
  ]),
};

CertificateInfo.defaultProps = {
  general: {
    serialNumber: '',
    version: '',
    notBefore: '',
    notAfter: '',
    thumbprint: '',
  },
  subject: {},
  issuer: {},
  publicKey: {
    modulusBits: '',
    namedCurve: '',
    publicExponent: '',
    algorithm: '',
    value: '',
  },
  signature: {
    algorithm: '',
    hash: '',
    value: '',
  },
  extensions: [],
};

CertificateInfo.contextInfo = {
  lang: PropTypes.object,
};

export default CertificateInfo;
