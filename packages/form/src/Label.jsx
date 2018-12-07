import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { injectIntl, intlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import styles from './label.less';

const classNames = classnames.bind(styles);

export class Label extends Component {
  constructor() {
    super();
    this.format = this.format.bind(this);
  }

  format(label) {
    if (label && label.id) {
      const { intl } = this.props;
      return intl.formatMessage({ id: label.id }, label.args);
    }
    return label;
  }

  render() {
    const { input, readOnly, typographyElement: TypoElem } = this.props;
    if (!input) {
      return null;
    }
    return <span className={classNames('labelWrapper', { readOnly })}><TypoElem tag="span" className={styles.label}>{this.format(input)}</TypoElem></span>;
  }
}

export const labelPropType = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    args: PropTypes.shape(),
  }),
]);

Label.propTypes = {
  intl: intlShape.isRequired,
  input: labelPropType,
  typographyElement: PropTypes.func,
  readOnly: PropTypes.bool,
};

Label.defaultProps = {
  input: null,
  typographyElement: Undertekst,
  readOnly: false,
};

export default injectIntl(Label);
