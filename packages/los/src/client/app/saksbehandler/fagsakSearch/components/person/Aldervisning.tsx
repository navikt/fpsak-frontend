
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import DateLabel from 'sharedComponents/DateLabel';

import styles from './aldervisning.less';

interface TsProps {
  erDod: boolean;
  alder: number;
  dodsdato?: string;
}

/**
 * AlderVisning
 *
 * Presentasjonskomponent. Definerer visning av personens alder. (Søker)
 */
const AlderVisning = ({
  erDod,
  alder,
  dodsdato,
}: TsProps) => {
  if (erDod) {
    return (
      <Normaltekst className={styles.displayInline}>
        { dodsdato
          ? <DateLabel dateString={dodsdato} />
          : <FormattedMessage id="Person.ManglerDodsdato" />
      }
      </Normaltekst>
    );
  }

  return (
    <span>
      <FormattedMessage id="Person.Age" values={{ age: alder }} />
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
