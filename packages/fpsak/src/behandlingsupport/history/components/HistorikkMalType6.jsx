import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { historikkinnslagDelPropType } from '@fpsak-frontend/prop-types';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleKodeverk } from 'kodeverk/duck';
import { findHendelseText } from './historikkUtils';

import styles from './historikkMalType.less';

const HistorikkMalType6 = ({ historikkinnslagDeler, intl, getKodeverknavn }) => {
  const { formatMessage } = intl;

  const formaterOpplysning = (opplysning, index) => (
    <div key={`opplysning${index}`}>
      <Normaltekst className={styles.keyValuePair}>
        {formatMessage({ id: getKodeverknavn(opplysning.opplysningType) })}
:
      </Normaltekst>
        &ensp;
      <Element className={styles.keyValuePair}>{opplysning.tilVerdi}</Element>
    </div>

  );

  return (
    <div>
      {
        historikkinnslagDeler.map((del) => (
          <div>
            <Element className="snakkeboble-panel__tekst">{findHendelseText(del.hendelse, getKodeverknavn)}</Element>
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
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectIntl(injectKodeverk(getAlleKodeverk)(HistorikkMalType6));
