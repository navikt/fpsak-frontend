import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { DateLabel } from '@fpsak-frontend/shared-components';

import styles from './aldervisning.less';

/**
 * AlderVisning
 *
 * Presentasjonskomponent. Definerer visning av personens alder. (Søker)
 */

const renderDød = (dodsdato) => (
  dodsdato ? <DateLabel dateString={dodsdato} /> : <FormattedMessage id="Person.ManglerDodsdato" />
);

const AlderVisning = ({
  erDod,
  alder,
  dodsdato,
}) => {
  if (erDod) {
    return (
      <Normaltekst className={styles.displayInline}>
        (
        {renderDød(dodsdato)}
        )
      </Normaltekst>
    );
  }

  return (
    <span>
      (
      <FormattedMessage id="Person.Age" values={{ age: alder }} />
      )
    </span>
  );
};

AlderVisning.propTypes = {
  erDod: PropTypes.bool.isRequired,
  alder: PropTypes.number.isRequired,
  dodsdato: PropTypes.string,
};

AlderVisning.defaultProps = {
  dodsdato: '',
};

export default AlderVisning;
