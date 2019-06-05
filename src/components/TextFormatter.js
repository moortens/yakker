import React, { useRef, useEffect } from 'react';
import propTypes from 'prop-types';
import classnames from 'classnames';
import Img from 'react-image';
import uniqBy from 'lodash/uniqBy';
import LinkifyIt from 'linkify-it';
import twemoji from 'twemoji';

import './TextFormatter.css';

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
        <a
          target="_blank"
          rel="noreferrer noopener"
          className="text-link"
          href={match.url}
          title={match.url}
        >
          {match.raw}
        </a>,
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
        <Img className="text-image" src={match.url} alt={match.raw} />,
      ];
    }
  });

  return images;
};

const TextFormatter = ({ text, embed, ...props }) => {
  const emojiRef = useRef();

  useEffect(() => {
    // Provides support for the standard Unicode emojis
    twemoji.parse(emojiRef.current, {
      className: 'text-emoji',
    });
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

    const styles = {
      'text-bold': bold,
      'text-italic': italic,
      'text-underline': underline,
      'text-monospace': monospace,
      'text-strikethrough': strikethrough,
    };

    if (color === true) {
      if (foreground) {
        styles[`foreground-${foreground}`] = true;
      }
      if (background) {
        styles[`background-${background}`] = true;
      }
    }

    const [urls, children] = buildContentLinks(content);
    const images = buildImagePreview(urls);

    return [
      images,
      <>
        <span className={classnames('text-container', styles)}>{children}</span>
        {formatter(next)}
      </>,
    ];
  };

  const [images, children] = formatter(blocks);

  return (
    <>
    <div ref={emojiRef} className={props.className}>{children}</div>
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
