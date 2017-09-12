import React, { Component } from 'react';
import { SidebarShellIcon } from '../../svg';
import StyledAnimatedIcon from './shell.styles';

const StyledIcon = StyledAnimatedIcon(SidebarShellIcon, 's_gradient');

export default class Shell extends Component {
  render() {
    return (
      <StyledIcon />
    );
  }
}
