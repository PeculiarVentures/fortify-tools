import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Overlay from './overlay';
import CertificateCreate from '../components/create_certificate';

const ContentStyled = styled.div`
  height: 100%;
`;

class CreateContainer extends Component {
  static propTypes = {
    loaded: PropTypes.bool,
    status: PropTypes.string,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    readOnly: PropTypes.bool,
    dialog: PropTypes.string,
    modal: PropTypes.string,
  };

  static defaultProps = {
    loaded: false,
    status: 'seaching',
    providers: [],
    readOnly: false,
    dialog: '',
    modal: '',
  };

  render() {
    const { loaded, status, providers, dialog, modal } = this.props;
    const selectedProviderProps = providers.filter(p => p.selected)[0];

    return (
      <ContentStyled>
        <CertificateCreate
          loaded={loaded}
          status={status}
          providers={providers}
          provider={selectedProviderProps}
        />
        <Overlay
          provider={selectedProviderProps}
          dialog={dialog}
          providers={providers}
          modal={modal}
        />
      </ContentStyled>
    );
  }
}

export default connect(state => state.get(), null, null, { pure: false })(CreateContainer);
