import React from 'react';
import styled from 'styled-components';

const TextOnlyButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.color};
  cursor: pointer;
`;

export default TextOnlyButton;