import React, { Component } from 'react';
import PropTypes from 'prop-types';

const supportedLangs = [
  'en',
  'ru',
  'es',
  'fr',
  'zh',
  'pl',
  'nl',
  'pt',
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
    return require(`../langs/${lang}.json`);
  }

  constructor() {
    super();

    let language = window.navigator.language.slice(0, 2).toLowerCase();

    if (!supportedLangs.includes(language)) {
      language = 'en';
    }

    window.__lang = language;

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
