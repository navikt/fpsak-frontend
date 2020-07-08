import React, { FunctionComponent } from 'react';
import classnames from 'classnames/bind';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Undertekst, TypografiProps } from 'nav-frontend-typografi';

import LabelType from './LabelType';

import styles from './label.less';

const classNames = classnames.bind(styles);

interface LabelProps {
  input?: LabelType;
  typographyElement?: React.ComponentType<TypografiProps>;
  readOnly?: boolean;
}

export const Label: FunctionComponent<LabelProps & WrappedComponentProps> = (props) => {
  const format = (label) => {
    if (label && label.id) {
      const { intl } = props;
      return intl.formatMessage({ id: label.id }, label.args);
    }
    return label;
  };

  const { input, readOnly, typographyElement: TypoElem } = props;
  if (!input) {
    return null;
  }
  return (
    <span className={classNames('labelWrapper', { readOnly })}>
      <TypoElem tag="span" className={styles.label}>
        {format(input)}
      </TypoElem>
    </span>
  );
};

Label.defaultProps = {
  input: null,
  typographyElement: Undertekst,
  readOnly: false,
};

export default injectIntl(Label);
