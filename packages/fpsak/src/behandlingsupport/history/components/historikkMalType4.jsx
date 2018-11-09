import React from 'react';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import historikkinnslagDelPropType from 'behandling/proptypes/historikkinnslagDelPropType';
import { findHendelseText } from './historikkUtils';

import BubbleText from './bubbleText';

const HistorikkMalType4 = ({ historikkinnslagDeler }) => (
  <div>
    {
      historikkinnslagDeler.map((del, delIndex) => (
        <div key={`del${delIndex}` // eslint-disable-line react/no-array-index-key
      }
        >
          <Element className="snakkeboble-panel__tekst">{findHendelseText(del.hendelse)}</Element>
          {del.aarsak && <Normaltekst>{del.aarsak.navn}</Normaltekst>}
          {del.begrunnelse && <BubbleText bodyText={del.begrunnelse.navn} className="snakkeboble-panel__tekst" />}
          {del.begrunnelseFritekst && <BubbleText bodyText={del.begrunnelseFritekst} className="snakkeboble-panel__tekst" />}
        </div>
      ))
    }
  </div>
);

HistorikkMalType4.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
};

export default HistorikkMalType4;
