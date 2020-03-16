import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element } from 'nav-frontend-typografi';

import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';

import historikkinnslagType from '../../kodeverk/historikkinnslagType';
import { findEndretFeltVerdi } from './felles/historikkUtils';
import BubbleText from './felles/bubbleText';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';

import styles from './historikkMalType.less';

export const HistorikkMalType9 = ({
  historikkinnslagDeler, behandlingLocation, originType, intl, getKodeverknavn, createLocationForSkjermlenke,
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
        <div key={
          `historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
        }
        >
          <div>
            {historikkinnslagDel.skjermlenke
            && (
              <Element>
                <NavLink to={createLocationForSkjermlenke(behandlingLocation, historikkinnslagDel.skjermlenke.kode)}>
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

            {(originType.kode === historikkinnslagType.TILBAKEKR_VIDEREBEHANDLING && historikkinnslagDel.endredeFelter) && (
              historikkinnslagDel.endredeFelter
                .filter((endretFelt) => endretFelt.tilVerdi !== tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK)
                .map((endretFelt, index) => (
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
  intl: PropTypes.shape().isRequired,
  originType: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  createLocationForSkjermlenke: PropTypes.func.isRequired,
};

export default injectIntl(HistorikkMalType9);
