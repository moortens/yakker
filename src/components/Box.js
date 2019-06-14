import styled from 'styled-components';
import { layout, flexbox } from 'styled-system';

export const Box = styled.div(layout, flexbox);

export const FlexBox = styled(Box)`
  display: flex;
  box-sizing: border-box;
  ${({ viewport }) =>
    viewport &&
    `
      width: 100vw;
      height: 100vh;
    `}
`;

export const VerticalBox = styled(FlexBox)`
  flex-direction column;
`;

export const HorizontalBox = styled(FlexBox)`
  flex-direction: row;
`;

export const FullScreenBox = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #031d44;
`;

export const FixedBox = styled.div(
  {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  layout,
);
