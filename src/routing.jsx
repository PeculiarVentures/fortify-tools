import React, { PropTypes, Component } from 'react';
import isMobile from 'ismobilejs';
import { connect } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { Router, Route, browserHistory } from 'react-router';
import { getTheme } from './components/theme';
import { RootContainer, CreateContainer, Intl } from './containers';
import { getAppPath } from './helpers';

class Routing extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
  };

  static defaultProps = {
    dispatch: () => {},
  };

  static childContextTypes = {
    dispatch: PropTypes.func,
    deviceType: PropTypes.string,
    windowSize: PropTypes.object,
  };

  static getDeviceType() {
    let deviceType = 'desktop';

    if (isMobile.tablet) {
      deviceType = 'tablet';
    } else if (isMobile.phone) {
      deviceType = 'phone';
    }

    return deviceType;
  }

  static getWindowSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let device = 'desktop';

    if (width <= 1024 && width > 736) {
      device = 'tablet';
    } else if (width <= 736) {
      device = 'mobile';
    }

    return {
      width,
      height,
      device,
    };
  }

  constructor() {
    super();

    this.state = {
      windowSize: Routing.getWindowSize(),
    };

    this.bindedOnResize = ::this.onResize;
    window.addEventListener('resize', this.bindedOnResize);
  }

  getChildContext() {
    return {
      deviceType: Routing.getDeviceType(),
      windowSize: this.state.windowSize,
      dispatch: this.props.dispatch,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { windowSize } = this.state;

    return (
      nextState.windowSize.width !== windowSize.width
      || nextState.windowSize.height !== windowSize.height
      || nextState.windowSize.device !== windowSize.device
    );
  }

  onResize() {
    this.setState({
      windowSize: Routing.getWindowSize(),
    });
  }

  render() {
    return (
      <ThemeProvider theme={getTheme()}>
        <Intl>
          <Router history={browserHistory}>
            <Route path={getAppPath()} component={RootContainer} />
            <Route path={`${getAppPath()}certificate/:id`} component={RootContainer} />
            <Route path={`${getAppPath()}request/:id`} component={RootContainer} />
            <Route path={`${getAppPath()}key/:id`} component={RootContainer} />
            <Route path={`${getAppPath()}create`} component={CreateContainer} />
          </Router>
        </Intl>
      </ThemeProvider>
    );
  }
}

export default connect(state => state.get(), null, null, { pure: false })(Routing);
