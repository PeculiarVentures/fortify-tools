import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Checkbox } from '../../basic';
import { Title, GroupContainer, GroupPart } from './styles';

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-right: 40px;
  margin-top: 14px;
  &:last-child {
    margin-right: 0;
  }
  @media ${props => props.theme.media.mobile} {
    margin-right: 12px;
    width: calc(50% - 6px);
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
`;

export default class Options extends Component {

  static contextTypes = {
    lang: PropTypes.object,
  };

  constructor() {
    super();

    this.checkboxNodes = {};
  }

  shouldComponentUpdate() {
    return false;
  }

  getData = () => {
    const options = {
      selfSigned: false,
    };

    Object.keys(this.checkboxNodes).map((name) => {
      const node = this.checkboxNodes[name];
      options[name] = node.getValue();
      return true;
    });

    return options;
  };

  render() {
    const { lang } = this.context;

    return (
      <GroupContainer>
        <Title>
          { lang['CertificateCreate.Options.Title'] }
        </Title>
        <GroupPart>
          <CheckboxContainer>
            <Checkbox
              labelText={lang['CertificateCreate.Options.SelfSigned']}
              ref={node => (this.checkboxNodes.selfSigned = node)}
              defaultChecked={false}
            />
          </CheckboxContainer>
        </GroupPart>
      </GroupContainer>
    );
  }
}
