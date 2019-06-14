import styled from 'styled-components';

const toHslColor = (text, saturation = 40, lightness = 80) => {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`;
};

const Avatar = styled.div`
  ::before {
    content: ${({ small, text }) =>
      small ? '' : `'${text.charAt(0).toUpperCase()}'`}
  }

  border-radius: 50%;
  border: 1px solid #ececec;
  color: #333;
  text-align: center;
  font-size: 12px;

  width: ${({ small }) => (small ? '15px' : '45px')}
  height: ${({ small }) => (small ? '15px' : '45px')}
  line-height: ${({ small }) => (small ? '15px' : '45px')}
  background-color: ${({ text }) => toHslColor(text)}
`;

export default Avatar;
