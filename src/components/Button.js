import styled from 'styled-components';
import { color } from 'styled-system';

const Button = styled.button(
  {
    outline: 'none',
    border: 0,
    padding: 0,
    margin: 0,
    font: 'inherit',
    backgroundColor: 'transparent',
    cursor: 'inherit',
    textAlign: 'left',
  },
  color,
);

export default Button;
