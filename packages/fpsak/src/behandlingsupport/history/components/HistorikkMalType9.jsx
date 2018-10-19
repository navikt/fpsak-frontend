import React from 'react';
import PropTypes from 'prop-types';
import historikkinnslagType from 'kodeverk/historikkinnslagType';
import { FormattedHTMLMessage, injectIntl, intlShape } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element } from 'nav-frontend-typografi';

import { createLocationForHistorikkItems } from 'app/paths';
import historikkinnslagDelPropType from 'behandling/proptypes/historikkinnslagDelPropType';

import BubbleText from './bubbleText';

export const HistorikkMalType9 = ({
  historikkinnslagDeler, behandlingLocation, originType,
}) => {
  const getSplitPeriods = (endredeFelter) => {
    let text = '';
    endredeFelter.forEach((felt, index) => {
      if (index === endredeFelter.length - 1) {
        text += ` og ${felt.tilVerdi}`;
      } else if (index === endredeFelter.length - 2) {
        text += `${felt.tilVerdi} `;
      } else {
        text += `${felt.tilVerdi}, `;
      }
    });

    return text;
  };

  return (
    historikkinnslagDeler
      .map((historikkinnslagDel, historikkinnslagDelIndex) => (
        <div key={`historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
        }
        >
          <div>
            {historikkinnslagDel.skjermlenke
            && (
              <Element>
                <NavLink to={createLocationForHistorikkItems(behandlingLocation, historikkinnslagDel.skjermlenke.kode)}>
                  {historikkinnslagDeler[0].skjermlenke.navn}
                </NavLink>
              </Element>
            )}

            {historikkinnslagDel.endredeFelter && originType.kode === historikkinnslagType.OVST_UTTAK_SPLITT
            && (
              <FormattedHTMLMessage
                id="Historikk.Template.9"
                values={{
                  opprinneligPeriode: historikkinnslagDel.endredeFelter[0].fraVerdi,
                  numberOfPeriods: historikkinnslagDel.endredeFelter.length,
                  splitPeriods: getSplitPeriods(historikkinnslagDel.endredeFelter),
                }}
              />
            )}

            {historikkinnslagDel.endredeFelter && originType.kode === historikkinnslagType.FASTSATT_UTTAK_SPLITT
            && (
              <FormattedHTMLMessage
                id="Historikk.Template.9.ManuellVurdering"
                values={{
                  opprinneligPeriode: historikkinnslagDel.endredeFelter[0].fraVerdi,
                  numberOfPeriods: historikkinnslagDel.endredeFelter.length,
                  splitPeriods: getSplitPeriods(historikkinnslagDel.endredeFelter),
                }}
              />
            )}
            {historikkinnslagDel.begrunnelse && (
              <BubbleText
                bodyText={historikkinnslagDel.begrunnelse.navn}
                className="snakkeboble-panel__tekst"
              />)}
          </div>
        </div>
      )));
};

HistorikkMalType9.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
  originType: PropTypes.shape().isRequired,
};

export default injectIntl(HistorikkMalType9);
