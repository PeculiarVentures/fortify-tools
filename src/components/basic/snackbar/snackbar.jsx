import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '../button';

const SnackbarStyled = styled.div`
  position: fixed;
  z-index: 12;
  width: ${props => props.width};
  left: calc((100% - ${props => props.width}) / 2);
  bottom: ${props => props.origin === 'bottom' ? props.offset : 'auto' };
  top: ${props => props.origin === 'top' ? props.offset : 'auto' };
  background: ${props => props.theme.snackbar.backgroundColor};
  box-shadow: ${props => props.theme.snackbar.shadow};
  border: 1px solid ${props => (
    props.type === 'info'
      ? props.theme.snackbar.borderColor
      : props.theme.snackbar.error.borderColor
  )};
  border-radius: 4px;
  padding: 11px 14px 11px 25px;
  transition: transform ${props => props.animationTime}ms;
  transform: translate(0, ${props => (
    props.origin === 'top'
      ? `calc(-100% - ${props.offset})`
      : `calc(100% + ${props.offset})`
  )});
  @media ${props => props.theme.media.mobile} {
    width: calc(100% - 20px);
    left: 10px;
    padding: 10px 12px 10px 18px;
  }
`;

const SnackbarContentStyled = styled.div`
  display: table;
  width: 100%;
`;

const TextStyled = styled.div`
  ${props => (
    !props.buttonText
      ? 'text-align: center;'
      : null
  )}
  font-size: 14px;
  line-height: 18px;
  font-weight: 600;
  display: table-cell;
  vertical-align: middle;
  padding-right: 10px;
  color: ${props => props.theme.snackbar.color};
  @media ${props => props.theme.media.mobile} {
    font-size: 13px;
  }
`;

const ButtonStyled = styled(Button)`
  height: 28px !important;
`;

const ButtonsWrapperStyled = styled.div`
  display: table-cell;
  text-align: right;
  vertical-align: middle;
  white-space: nowrap;
`;

export default class Snackbar extends Component {

  static propTypes = {
    width: PropTypes.string,
    offset: PropTypes.string,
    origin: PropTypes.string,
    type: PropTypes.string,
    buttonText: PropTypes.string,
    animationTime: PropTypes.number,
    animation: PropTypes.bool,
    onMouseOver: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ]),
    onMouseLeave: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ]),
    children: PropTypes.node,
    text: PropTypes.string,
  };

  static defaultProps = {
    width: '500px',
    offset: '16px',
    origin: 'bottom',
    type: 'info', // info, error
    buttonText: '',
    animationTime: 300,
    animation: true,
    onMouseOver: null,
    onMouseLeave: null,
  };

  static contextTypes = {
    lang: PropTypes.object,
  };

  constructor() {
    super();

    this.bindedOnButtonClick = this.onButtonClick.bind(this);
    this.bindedOnMouseEnter = this.onMouseEnter.bind(this);
    this.bindedOnMouseLeave = this.onMouseLeave.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.slideIn();
    });
  }

  componentWillUnmount() {
    this.slideOut();
  }

  getSlideOutDistance(node) {
    const { origin } = this.props;
    const { innerHeight } = window;
    const { offsetTop, offsetHeight } = node;

    let size = 0;

    switch (origin) {
      case 'top':
        size -= offsetTop + offsetHeight;
        break;

      case 'bottom':

        const distanceToBottom = innerHeight - offsetHeight - offsetTop;
        size += distanceToBottom + offsetHeight;
        break;

      default:
        break;
    }

    return size;
  }

  slideIn() {
    if(this.refRootNode) {
      // TODO: add autoprefixing
      this.refRootNode.style.transform = 'translate(0, 0)';
    }
  }

  slideOut() {
    const { animationTime } = this.props;
    const rootNodeClone = this.refRootNode.cloneNode(true);
    document.body.appendChild(rootNodeClone);

    const transformDistance = this.getSlideOutDistance(rootNodeClone);

    setTimeout(() => {
      // TODO: add autoprefixing
      rootNodeClone.style.webkitTransform = `translate(0, ${transformDistance}px)`;
    });

    setTimeout(() => {
      document.body.removeChild(rootNodeClone);
    }, animationTime);
  }

  onButtonClick() {
    const { onButtonClick } = this.props;

    if (onButtonClick) {
      onButtonClick();
    }
  }

  onMouseEnter() {
    const { onMouseEnter } = this.props;

    if (onMouseEnter) {
      onMouseEnter();
    }
  }

  onMouseLeave() {
    const { onMouseLeave } = this.props;

    if (onMouseLeave) {
      onMouseLeave();
    }
  }

  renderSnackbarContent() {
    const { lang } = this.context;
    const { children, text, buttonText = lang['Snackbar.Btn.Cancel'] } = this.props;

    if (children) {
      return (
        children
      );
    }

    return (
      <SnackbarContentStyled>
        <TextStyled buttonText={buttonText}>
          { text }
        </TextStyled>
        {
          buttonText
            ? <ButtonsWrapperStyled>
              <ButtonStyled
                onClick={this.bindedOnButtonClick}
                primary
              >
                { buttonText }
              </ButtonStyled>
            </ButtonsWrapperStyled>
            : null
        }
      </SnackbarContentStyled>
    );
  }

  render() {
    return (
      <SnackbarStyled
        {...this.props}
        onMouseOver={this.bindedOnMouseEnter}
        onMouseLeave={this.bindedOnMouseLeave}
        ref={(node) => { this.refRootNode = node; }}
      >
        { this.renderSnackbarContent() }
      </SnackbarStyled>
    );
  }

}
