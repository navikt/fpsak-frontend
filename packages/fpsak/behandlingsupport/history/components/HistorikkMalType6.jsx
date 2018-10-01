import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import historikkinnslagDelPropType from 'behandling/proptypes/historikkinnslagDelPropType';
import styles from './historikkMalType.less';
import { findHendelseText } from './historikkUtils';

const HistorikkMalType6 = ({ historikkinnslagDeler, intl }) => {
  const { formatMessage } = intl;

  const formaterOpplysning = (opplysning, index) => (
    (
      <div key={`opplysning${index}`}>
        <Normaltekst className={styles.keyValuePair}>
          {formatMessage({ id: opplysning.opplysningType.navn })}
:
        </Normaltekst>
        &ensp;
        <Element className={styles.keyValuePair}>{opplysning.tilVerdi}</Element>
      </div>
    )
  );

  return (
    <div>
      {
        historikkinnslagDeler.map(del => (
          <div>
            <Element className="snakkeboble-panel__tekst">{findHendelseText(del.hendelse)}</Element>
            {del.opplysninger.map(formaterOpplysning)}
          </div>
        ))
      }
    </div>
  );
};


HistorikkMalType6.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(HistorikkMalType6);
