import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import historikkinnslagDelPropType from 'behandling/proptypes/historikkinnslagDelPropType';
import { findAarsakText, findBegrunnelseTekst, findHendelseText } from './historikkUtils';

import BubbleText from './bubbleText';


const HistorikkMalType4 = ({ intl, historikkinnslagDeler }) => (
  <div>
    {
      historikkinnslagDeler.map((del, delIndex) => (
        <div key={`del${delIndex}` // eslint-disable-line react/no-array-index-key
      }
        >
          <Element className="snakkeboble-panel__tekst">{findHendelseText(del.hendelse)}</Element>
          {del.aarsak && <Normaltekst>{findAarsakText(del.aarsak, intl)}</Normaltekst>}
          <BubbleText bodyText={findBegrunnelseTekst(del.begrunnelse, intl)} className="snakkeboble-panel__tekst" />
        </div>
      ))
    }
  </div>
);

HistorikkMalType4.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(HistorikkMalType4);
