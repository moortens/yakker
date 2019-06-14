import React, { useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import Img from 'react-image';
import uniqBy from 'lodash/uniqBy';
import LinkifyIt from 'linkify-it';
import twemoji from 'twemoji';

import styled from 'styled-components';

const fontWeight = ({ bold }) => (bold ? 'bold' : 'none');

const fontFamily = ({ monospace }) =>
  monospace ? 'monospace' : "'Roboto', sans-serif";

const textDecoration = ({ underline, strikethrough }) => {
  if (strikethrough) {
    return 'strikethrough';
  }
  return underline ? 'underline' : 'none';
};

const backgroundColor = ({ background, monospace, theme }) => {
  if (monospace) {
    return '#ececec';
  }
  return theme.colors.irc[background] || 'inherit';
};

const fontStyle = ({ italic }) => (italic ? 'italic' : 'none');

const color = ({ foreground, theme }) =>
  theme.colors.irc[foreground] || 'inherit';

const StyledText = styled.span`
  font-size: inherit;
  font-family: ${props => fontFamily(props)};
  font-weight: ${props => fontWeight(props)};
  text-decoration: ${props => textDecoration(props)};
  font-style: ${props => fontStyle(props)};
  background-color: ${props => backgroundColor(props)};
  color: ${props => color(props)};

  ${({ monospace }) =>
    monospace &&
    `
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 5px;
      margin-right: 5px;
  `}
`;

const StyledLink = styled.span`
  text-decoration: none;
  color: inherit;
  background-color: inherit;
  font-weight: inherit;
  font-style: inherit;
  font-family: inherit;
  font-size: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

const Text = styled.div`
  font-family: 'Roboto', sans-serif;
  font-size: 1.4rem;

  img.emoji {
    font-size: inherit;
    height: 1em;
    width: 1em;
    margin: 0 0.05em 0 0.1em;
    vertical-align: -0.1em;
  }
`;

const StyledImage = styled.div`
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 3px;
  max-width: 300px;
  max-height: 300px;
`;

const getBlockType = char => {
  switch (char) {
    case '\x02':
      return 'bold';
    case '\x1d':
      return 'italic';
    case '\x1f':
      return 'underline';
    case '\x03':
      return 'color';
    case '\x1e':
      return 'strikethrough';
    case '\x11':
      return 'monospace';
    case '\x0f':
      return 'reset';
    default:
      return 'normal';
  }
};

const buildStyleBlocks = (
  d,
  {
    color = false,
    bold = false,
    italic = false,
    underline = false,
    monospace = false,
    strikethrough = false,
    data: { foreground = null, background = null } = {},
  } = {},
) => {
  let i = 0;
  const block = {
    content: '',
    color,
    bold,
    italic,
    underline,
    monospace,
    strikethrough,
    data: {
      foreground,
      background,
    },
    next: null,
  };

  if (block.color) {
    if (!/^(?!,)(\d{1,2})(?:,(\d{1,2}))?/.test(d)) {
      block.color = false;
    } else {
      const [match, fore, back] = d.match(/^(?!,)(\d{1,2})(?:,(\d{1,2}))?/);

      block.color = true;
      // since colors can be represented as both a two digit version
      // as well as a single digit, always parse the integer so things
      // like 01, 02, ... are turned into single digits.
      block.data.foreground = parseInt(fore, 10) || foreground;
      block.data.background = parseInt(back, 10) || background;

      i = match.length;
    }
  }

  while (i < d.length) {
    const char = d.charAt(i);
    const type = getBlockType(char);

    if (type === 'normal') {
      block.content += char;
    } else {
      // we recieved a new block type, the color block
      // is special in that it has parameters, and can happen
      // in layers.
      if (type === 'reset') {
        block.next = buildStyleBlocks(d.substring(i + 1));
      } else {
        block.next = buildStyleBlocks(
          d.substring(i + 1),
          Object.assign({}, block, {
            ...block,
            [type]: type === 'color' ? true : !block[type],
          }),
        );
      }
      return block;
    }

    i += 1;
  }
  return block;
};

const buildContentLinks = content => {
  const linkify = LinkifyIt();
  const urls = linkify.match(content);

  let children = [];
  if (urls) {
    let index = 0;
    urls.forEach(match => {
      if (index < match.index) {
        children = [...children, content.substring(index, match.index)];
      }

      children = [
        ...children,
        <StyledLink
          target="_blank"
          rel="noreferrer noopener"
          href={match.url}
          title={match.url}
        >
          {match.raw}
        </StyledLink>,
      ];

      index = match.lastIndex;
    });

    if (index < content.length) {
      children = [...children, content.substring(index)];
    }
  } else {
    children = [content];
  }
  return [urls, children];
};

const buildImagePreview = urls => {
  if (!urls) {
    return null;
  }

  const imageRe = /\.(gif|jpe?g|bmp|png|webp)$/;

  let images = [];

  uniqBy(urls, 'url').forEach(match => {
    if (imageRe.test(match.url)) {
      images = [
        ...images,
        <StyledImage>
          <Img src={match.url} alt={match.raw} />
        </StyledImage>,
      ];
    }
  });

  return images;
};

const TextFormatter = ({ text, embed }) => {
  const emojiRef = useRef();

  useEffect(() => {
    // Provides support for the standard Unicode emojis
    twemoji.parse(emojiRef.current);
  }, [emojiRef]);

  const blocks = buildStyleBlocks(text);

  const formatter = data => {
    if (data === null) {
      return null;
    }

    const {
      content,
      bold,
      italic,
      underline,
      monospace,
      strikethrough,
      color,
      data: { foreground, background },
      next,
    } = data;

    const props = {
      bold,
      italic,
      underline,
      monospace,
      strikethrough,
    };

    if (color) {
      props.foreground = foreground;
      props.background = background;
    }

    const [urls, children] = buildContentLinks(content);
    const images = buildImagePreview(urls);

    return [
      images,
      <>
        <StyledText {...props}>{children}</StyledText>
        {formatter(next)}
      </>,
    ];
  };

  const [images, children] = formatter(blocks);

  return (
    <>
      <Text ref={emojiRef}>{children}</Text>
      {embed && images}
    </>
  );
};

TextFormatter.propTypes = {
  text: propTypes.string.isRequired,
  embed: propTypes.bool,
};

TextFormatter.defaultProps = {
  embed: false,
};

export default TextFormatter;
