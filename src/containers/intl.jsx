import React, { Component } from 'react';
import PropTypes from 'prop-types';

const supportedLangs = [
  'en',
  'ru',
];

export default class Intl extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  static defaultProps = {
    children: [],
  };

  static childContextTypes = {
    lang: PropTypes.object,
  };

  static getLangFile(lang) {
    if (supportedLangs.indexOf(lang) !== -1) {
      return require(`../langs/${lang}.json`);
    }
    return require('../langs/en.json');
  }

  constructor() {
    super();

    this.state = {
      lang: Intl.getLangFile(window.__lang),
    };
  }

  getChildContext() {
    return {
      lang: this.state.lang,
    };
  }

  render() {
    return this.props.children;
  }
}
