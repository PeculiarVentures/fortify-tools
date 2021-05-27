import React from 'react';
import styled from 'styled-components';

const SVG = styled.svg``;

const InfoIcon = props => (
  <SVG
    viewBox="0 0 24 24"
    {...props}
  >
    <g opacity=".8">
      <circle cx="12" cy="12" r="7" fill="#F7A831" />
      <path d="M11 8h1.897l-.64 5.302h-.612L11 8zm.064 7.007c0-.167.023-.306.07-.416a.698.698 0 01.186-.272.732.732 0 01.287-.144 1.403 1.403 0 01.693 0 .672.672 0 01.48.416c.05.11.074.249.074.415 0 .164-.025.3-.074.41a.678.678 0 01-.48.411 1.254 1.254 0 01-.693 0 .732.732 0 01-.287-.144.705.705 0 01-.187-.266 1.064 1.064 0 01-.07-.41z" fill="#2A3134" />
    </g>
  </SVG>
);

export default InfoIcon;
