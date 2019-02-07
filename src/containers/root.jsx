import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Info from '../components/info/index';
import Sidebar from '../components/sidebar/index';
import Overlay from './overlay';
import Snackbars from '../components/snackbars';

const ContentStyled = styled.div`
  height: 100%;
`;

const InfoStyled = styled.div`
  width: calc(100% - 360px);
  height: 100%;
  display: inline-block;
  vertical-align: top;
  background: ${props => props.theme.info.background};
  @media ${props => props.theme.media.mobile} {
    width: 100%;
  }
`;

class RootContainer extends Component {
  static propTypes = {
    loaded: PropTypes.bool,
    status: PropTypes.string,
    providers: PropTypes.oneOfType([
      PropTypes.array,
    ]),
    dialog: PropTypes.string,
    modal: PropTypes.string,
  };

  static defaultProps = {
    loaded: false,
    status: 'seaching',
    providers: [],
    dialog: '',
    modal: '',
  };

  static childContextTypes = {
    handleRootAction: PropTypes.func,
  };

  constructor() {
    super();

    this.state = {
      sidebarOpen: false,
    };
  }

  getChildContext() {
    return {
      handleRootAction: this.handleRootAction.bind(this),
    };
  }

  componentDidMount() {
    this.handleRootAction({ type: 'SIDEBAR:OPEN' });
  }

  componentDidUpdate(prevProps) {
    const { providers } = this.props;
    const selectedProviderProps = providers.filter(p => p.selected)[0];
    const selectedPrevProviderProps = prevProps.providers.filter(p => p.selected)[0];

    if (
      typeof selectedPrevProviderProps === 'object' &&
      {}.hasOwnProperty.call(selectedPrevProviderProps, 'items') &&
      typeof selectedProviderProps === 'object' &&
      {}.hasOwnProperty.call(selectedProviderProps, 'items')
    ) {
      if (selectedPrevProviderProps.items.length === 1 && !selectedProviderProps.items.length) {
        this.handleRootAction({ type: 'SIDEBAR:OPEN' });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.bindedOnResize);
  }

  handleRootAction(payload) {
    const { type } = payload;

    switch (type) {
      case 'SIDEBAR:OPEN': {
        this.setState({
          sidebarOpen: true,
        });
        return true;
      }

      case 'SIDEBAR:CLOSE': {
        this.setState({
          sidebarOpen: false,
        });
        return true;
      }

      default:
        return true;
    }
  }

  render() {
    const { loaded, status, providers, dialog, modal } = this.props;
    const { sidebarOpen } = this.state;
    const selectedProviderProps = providers.filter(p => p.selected)[0];

    return (
      <ContentStyled>
        <Sidebar
          open={sidebarOpen}
          loaded={loaded}
          status={status}
          providers={providers}
          provider={selectedProviderProps}
        />
        <InfoStyled>
          <Info
            loaded={loaded}
            provider={selectedProviderProps}
          />
        </InfoStyled>
        <Snackbars />
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

export default connect(state => state.get(), null, null, { pure: false })(RootContainer);
