import React, { PropTypes } from 'react';
import { Root, Row, Title, RowCertInfo, RowCert, ColCert } from './styled/info';
// import { CertHelper } from '../../helpers';

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
            {value}
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
            Object.keys(subject).map((iss, index) => renderRowContainer(iss, subject[iss], index))
          }
        </RowCert>
      </Row>

      <Row>
        <Title>
          {lang['Info.Body.IssuerName']}
        </Title>
        <RowCert>
          {
            Object.keys(issuer).map((iss, index) => renderRowContainer(iss, issuer[iss], index))
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
        {
          extensions.length
            ? extensions.map((ext, index) => {
              let value;
              if (typeof ext.value === 'string') {
                value = ext.value;
              } else {
                switch (ext.oid) {
                  case '2.5.29.15': // key usage
                  case '2.5.29.37': // Extended Key Usage
                  case '2.5.29.17': // Subject Alternative Name
                  case '2.16.840.1.113730.1.1': // Netscape Certificate Type
                    value = ext.value.join(', ');
                    break;
                  case '2.5.29.31': // CRL Distribution Points
                    value = (
                      ext.value.distributionPoints.map(dp => (
                        <div>{dp.distributionPoint[0].value}</div>
                      ))
                    );
                    break;
                  case '2.5.29.35': // Authority Key Identifier
                    value = (
                      <div>
                        {ext.value.keyIdentifier
                          ? <div>Key identifier: {ext.value.keyIdentifier}</div>
                          : null
                        }
                        {ext.value.authorityCertSerialNumber
                          ? <div>
                            Authority serial number: {ext.value.authorityCertSerialNumber}
                          </div>
                          : null
                        }
                        {ext.value.authorityCertIssuer
                          ? <div>Authority issuer name: {ext.value.authorityCertIssuer}</div>
                          : null
                        }
                      </div>
                    );
                    break;
                  case '1.3.6.1.5.5.7.1.1': // Authority Info Access
                    value = (
                      ext.value.map(access => (
                        <div>
                          <div>Location: {access.location}</div>
                          <div>Method: {access.method}</div>
                          <br />
                        </div>
                      ))
                    );
                    break;
                  default:
                    value = ext.value;
                }
              }
              return (
                <RowCert
                  key={index}
                >
                  {renderRowContainer(lang['Info.Body.Name'], ext.name)}
                  {renderRowContainer(lang['Info.Body.Critical'], ext.critical ? 'yes' : 'no')}
                  {renderRowContainer(lang['Info.Body.Value'], value, '', true)}
                </RowCert>
              );
            })
            : <RowCert>
              {renderRowContainer(lang['Info.Body.None'], ' ')}
            </RowCert>
        }
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
