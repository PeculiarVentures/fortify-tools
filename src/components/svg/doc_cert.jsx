import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const DocCertIcon = props => (
  <SVG
    viewBox="0 0 40 40"
    fill="none"
    {...props}
  >
    <path d="M20.346 20.576a6.23 6.23 0 100-12.46 6.23 6.23 0 000 12.46z" stroke="#B6C3CC" strokeMiterlimit="10" />
    <path d="M20.346 23.692a9.346 9.346 0 100-18.692 9.346 9.346 0 000 18.692z" stroke="#B6C3CC" strokeMiterlimit="10" />
    <path d="M19.91 23.91L15.88 35l-1.702-2.939L11 33.224l4.03-11.09M20.772 23.91L24.812 35l1.692-2.939 3.188 1.163-4.04-11.09" stroke="#B6C3CC" strokeMiterlimit="10" />
  </SVG>
);

export default DocCertIcon;
