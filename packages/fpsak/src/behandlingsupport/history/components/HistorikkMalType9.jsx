import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, injectIntl, intlShape } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element } from 'nav-frontend-typografi';

import historikkinnslagType from '@fpsak-frontend/kodeverk/src/historikkinnslagType';
import avregningCodes from '@fpsak-frontend/kodeverk/src/avregningCodes';
import { historikkinnslagDelPropType } from '@fpsak-frontend/prop-types';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleKodeverk } from 'kodeverk/duck';
import { createLocationForHistorikkItems } from 'kodeverk/skjermlenkeCodes';
import { findEndretFeltVerdi } from './historikkUtils';
import BubbleText from './bubbleText';

import styles from './historikkMalType.less';

export const HistorikkMalType9 = ({
  historikkinnslagDeler, behandlingLocation, originType, intl, getKodeverknavn,
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
                  {getKodeverknavn(historikkinnslagDeler[0].skjermlenke)}
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

            {originType.kode === historikkinnslagType.TILBAKEKR_VIDEREBEHANDLING
            && (
              historikkinnslagDel.endredeFelter.map((endretFelt, index) => endretFelt.tilVerdi !== avregningCodes.TILBAKEKR_INNTREKK && (
                <div className={styles.tilbakekrevingTekst} key={`endretFelt${index + 1}`}>
                  <FormattedHTMLMessage
                    id="Historikk.Template.9.TilbakekrViderebehandling"
                    values={{
                      felt: getKodeverknavn(endretFelt.endretFeltNavn),
                      verdi: findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl),
                    }}
                  />
                </div>
              ))
            )}
            {historikkinnslagDel.begrunnelse && <BubbleText bodyText={getKodeverknavn(historikkinnslagDel.begrunnelse)} className="snakkeboble-panel__tekst" />}
            {historikkinnslagDel.begrunnelseFritekst && <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} className="snakkeboble-panel__tekst" />}
          </div>
        </div>
      )));
};

HistorikkMalType9.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
  originType: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectIntl(injectKodeverk(getAlleKodeverk)(HistorikkMalType9));
