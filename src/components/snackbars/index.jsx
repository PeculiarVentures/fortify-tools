import React from 'react';
import PropTypes from 'prop-types';
import { SegueHandler, Snackbar } from '../basic';
import { EventChannel } from '../../controllers';
import { ModalActions } from '../../actions/ui';
import { ACTIONS_CONST } from '../../constants';

export default class Snackbars extends React.Component {

  static contextTypes = {
    windowSize: PropTypes.object,
    lang: PropTypes.object,
    dispatch: PropTypes.func,
  };

  constructor() {
    super();

    window.EventChannel = EventChannel;

    this.state = {
      type: '',
      message: '',
      params: {},
      duration: 3000,
    };

    this.delay = null;

    this.bindedShow = this.show.bind(this);
    this.bindedHide = this.hide.bind(this);
    this.bindedSetHideTimeout = this.setHideTimeout.bind(this);
    this.bindedSetMessage = this.setMesssage.bind(this);
    this.bindedResetDelay = this.resetDelay.bind(this);

    EventChannel.on(ACTIONS_CONST.SNACKBAR_SET_MESSAGE, this.bindedSetMessage);
    EventChannel.on(ACTIONS_CONST.SNACKBAR_SHOW, this.bindedShow);
    EventChannel.on(ACTIONS_CONST.SNACKBAR_HIDE, this.bindedHide);
    EventChannel.on(ACTIONS_CONST.SNACKBAR_CLEAR_DELAY, this.bindedResetDelay);
  }

  componentWillUnmount() {
    clearTimeout(this.hideTimeout);
  }

  setMesssage(message = '') {
    this.setState({
      message,
    });
  }

  setHideTimeout(timeout) {
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(this.hide.bind(this), timeout);
  }

  handleAction(payload) {
    const { type, value } = payload;
    const { dispatch } = this.context;

    switch (type) {

      case ACTIONS_CONST.MODAL_OPEN:
        dispatch(ModalActions.open(value));
        break;

      default:
        return null;

    }

    return null;
  }

  resetDelay() {
    if (this.delay) {
      clearTimeout(this.delay);
    }
  }

  show(type, time = 3000, delay, params) {
    const show = () => {
      if (this.setState) {
        this.setState({
          type,
          params,
          duration: time,
        });
        if (Number.isFinite(time)) {
          this.setHideTimeout(time);
        }
      }
    };
    if (delay) {
      this.delay = setTimeout(show, delay);
    } else {
      this.resetDelay();
      show();
    }
  }

  hide(type) {
    if (typeof type === 'string' && type !== this.state.type) {
      return false;
    }
    clearTimeout(this.hideTimeout);

    return this.setState({
      type: '',
      message: '',
      params: {},
    });
  }

  render() {
    const { type, duration } = this.state;
    const { lang } = this.context;

    return (
      <SegueHandler
        query={type}
        name="Snackbars"
        onClose={this.bindedHide}
        transitionGroupEnable
        offset="16px"
        overflowWrapperStyle={{ zIndex: 4 }}
        onMouseOver={() => { clearTimeout(this.hideTimeout); }}
        onMouseLeave={
          () => (Number.isFinite(duration) ? this.bindedSetHideTimeout(duration) : null)
        }
      >
        <Snackbar
          type="error"
          name="offline"
          buttonText={lang['Snackbar.Offline.Btn.Get']}
          onButtonClick={() => console.log('click Get help button')}
          text={lang['Snackbar.Offline.Text']}
        />
        <Snackbar
          name="copied"
          buttonText={lang['Snackbar.Copy.Btn.Close']}
          onButtonClick={() => EventChannel.emit(ACTIONS_CONST.SNACKBAR_HIDE)}
          text={lang['Snackbar.Copy.Text']}
        />
        <Snackbar
          name="card_removed"
          text={lang['Snackbar.CardRemoved.Text']}
          buttonText=""
        />
        <Snackbar
          name="card_inserted"
          text={lang['Snackbar.CardInserted.Text']}
          buttonText=""
        />
      </SegueHandler>
    );
  }
}
