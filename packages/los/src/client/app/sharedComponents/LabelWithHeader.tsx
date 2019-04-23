import React from 'react';
import PropTypes from 'prop-types';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import styles from './labelWithHeader.less';

/**
 * LabelWithHeader
 *
 * Presentasjonskomponent. Presenterer tekst med en overskrift. (På samme måte som input-felter med overskrifter)
 */
const LabelWithHeader = ({
  header,
  texts,
}) => (
  <div className={styles.container}>
    <Undertekst>
      {header}
    </Undertekst>
    <div className={styles.text}>
      {texts.map(text => (
        <Normaltekst key={text}>
          {text}
        </Normaltekst>
      ))}
    </div>
  </div>
);

LabelWithHeader.propTypes = {
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  texts: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired).isRequired,
};

export default LabelWithHeader;
