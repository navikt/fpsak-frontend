import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { historikkinnslagDelPropType } from '@fpsak-frontend/prop-types';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleKodeverk } from 'kodeverk/duck';
import { findHendelseText } from './historikkUtils';

import BubbleText from './bubbleText';

const HistorikkMalType4 = ({ historikkinnslagDeler, getKodeverknavn }) => (
  <div>
    {
      historikkinnslagDeler.map((del, delIndex) => (
        <div key={`del${delIndex}` // eslint-disable-line react/no-array-index-key
      }
        >
          <Element className="snakkeboble-panel__tekst">{findHendelseText(del.hendelse, getKodeverknavn)}</Element>
          {del.aarsak && <Normaltekst>{getKodeverknavn(del.aarsak)}</Normaltekst>}
          {del.begrunnelse && <BubbleText bodyText={getKodeverknavn(del.begrunnelse)} className="snakkeboble-panel__tekst" />}
          {del.begrunnelseFritekst && <BubbleText bodyText={del.begrunnelseFritekst} className="snakkeboble-panel__tekst" />}
        </div>
      ))
    }
  </div>
);

HistorikkMalType4.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectKodeverk(getAlleKodeverk)(HistorikkMalType4);
