import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { OppChevron, NedChevron } from 'nav-frontend-chevron';
import styles from './bubbleText.less';

/**
 * Ekspanderbar tekst med chevron i nedre høyre hørnet - den skall vare expanderbar om den innehåller for mye tekst
 * för gjenbruk kan man återanvända. Man sender in teksten og var cut-off pointen skall vare.
 *
 *
 * Eksempel:
 * ```html
 * <BubbleText bodyText={tekst} cutOffLength={70} />
 * ```
 */

const truncateText = (tekst, cutOffLength) => {
  if (tekst.length > cutOffLength) {
    return (`${tekst.substring(0, cutOffLength - 3)}...`);
  }
  return tekst;
};

class BubbleText extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleClick(event) {
    const { expanded } = this.state;
    if (event) {
      event.preventDefault();
    }
    this.setState({ expanded: !expanded });
  }

  handleKeyDown(event) {
    const { expanded } = this.state;
    if (event && event.keyCode === 32) {
      this.setState({ expanded: !expanded });
    }
  }

  render() {
    const {
      bodyText,
      cutOffLength,
    } = this.props;
    const { expanded } = this.state;
    if (bodyText) {
      if (bodyText.length < cutOffLength + 1) {
        return (<div>{bodyText}</div>);
      }

      if (expanded) {
        return (
          <div>
            <div>
              {bodyText}
            </div>
            <a
              href="#"
              onClick={this.handleClick}
              onKeyDown={this.handleKeyDown}
              className={styles.clickableArea}
              title="Lukke tekstfelt"
            >
              <OppChevron />
            </a>
          </div>
        );
      }

      return (
        <div>
          <div>
            {truncateText(bodyText, cutOffLength)}
          </div>
          <a
            href="#"
            onClick={this.handleClick}
            className={styles.clickableArea}
            onKeyDown={this.handleKeyDown}
            title="Åpne tekstfelt"
          >
            <NedChevron />
          </a>
        </div>
      );
    }

    return false;
  }
}

BubbleText.propTypes = {
  bodyText: PropTypes.string,
  cutOffLength: PropTypes.number,
};

BubbleText.defaultProps = {
  cutOffLength: 83,
  bodyText: '',
};

export default BubbleText;
