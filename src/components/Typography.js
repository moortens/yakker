import styled from 'styled-components';
import { typography, color, compose, space } from 'styled-system';

export const Header = styled.header(
  {
    fontSize: '3.2rem',
  },
  compose(
    typography,
    color,
    space,
  ),
);

export const Title = styled.div(
  {
    fontSize: '1.8rem',
  },
  compose(
    typography,
    color,
    space,
  ),
);

export const SubTitle = styled.span(
  {
    fontSize: '1.4rem',
  },
  compose(
    typography,
    color,
    space,
  ),
);
