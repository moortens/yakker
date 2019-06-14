import styled from 'styled-components';
import { typography, color, compose, space } from 'styled-system';

export const Header = styled.header(
  {
    fontSize: '32px',
  },
  compose(
    typography,
    color,
    space,
  ),
);

export const Title = styled.div(
  {
    fontSize: '18px',
  },
  compose(
    typography,
    color,
    space,
  ),
);

export const SubTitle = styled.span(
  {
    fontSize: '14px',
  },
  compose(
    typography,
    color,
    space,
  ),
);