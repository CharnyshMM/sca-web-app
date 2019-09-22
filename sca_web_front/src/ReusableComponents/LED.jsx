import React from 'react';
import styled from 'styled-components';

const LED = styled.div`
  display: inline-block;
  background-color: ${props => props.color};
  height: ${props => props.height ? props.height : "1rem"};
  width: ${props => props.width ? props.width : "1rem"};
  border-radius: 50%;

  animation: ${props => props.blinking ? "blinking-animation 1s infinite" : "none"}

  @keyframes blinking-animation {
    0%   { opacity: 0.01; }
    50% { opacity: 1; }
    100%   { opacity: 0.01; }
  }
`;

export default LED;
