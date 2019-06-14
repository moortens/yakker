import React from 'react';
import propTypes from 'prop-types';
import { useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import { HorizontalBox } from './Box';

const expand = keyframes`
  from {
    letter-spacing: normal;
  }

  to {
    letter-spacing: 2px;
  }
`;

const AnimatedTypingDots = styled.span`
  letter-spacing: normal;
  animation-duration: 1s;
  animation-name: ${expand};
  animation-iteration-count: infinite;
  animation-direction: alternate;
`;

const TypingText = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.typing};
`;

const TypingIndicator = ({ bid }) => {
  const typings = useSelector(state => {
    if (state.typing[bid] === undefined) {
      return [];
    }

    return state.typing[bid].map(({ uid }) => {
      return {
        ...state.userlist.entities[uid],
      };
    });
  });

  const getUniqueNickString = () => {
    const nicks = typings.map(({ nick }) => nick);
    if (nicks.length === 0) {
      return '';
    }

    if (nicks.length === 1) {
      return `${nicks.pop()} is typing`;
    }

    const first = nicks.slice(0, 3);
    const rest = nicks.slice(3);
    if (rest.length > 0) {
      return `${first.join(', ')} and ${rest.length} more are typing`;
    }

    const last = first.pop();

    return `${first.join(', ')} and ${last} are typing`;
  };

  return (
    <HorizontalBox>
      {typings.length !== 0 && (
        <TypingText>
          {getUniqueNickString()}
          <AnimatedTypingDots />
        </TypingText>
      )}
    </HorizontalBox>
  );
};

TypingIndicator.propTypes = {
  bid: propTypes.string.isRequired,
};

export default TypingIndicator;
