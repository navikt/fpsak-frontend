import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import aktivitetStatus, { isStatusDagpengerOrAAP } from 'kodeverk/aktivitetStatus';

export const getTekstForAndelBruktIBeregning = (andel, erIKombinasjonMedSN) => {
  if (erIKombinasjonMedSN === true) {
    if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
      return 'Beregningsgrunnlag.TilstottendeYtelse.DagpengerOppjustert';
    } if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER) {
      return 'Beregningsgrunnlag.TilstottendeYtelse.AAPOppjustert';
    }
  } else {
    if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
      return 'Beregningsgrunnlag.TilstottendeYtelse.Dagpenger';
    } if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER) {
      return 'Beregningsgrunnlag.TilstottendeYtelse.AAP';
    }
  }
  return '';
};

const getTekstForAndelensGrunnlag = (andel) => {
  if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
    return 'Beregningsgrunnlag.TilstottendeYtelse.DagpengerGrunnlag';
  } if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER) {
    return 'Beregningsgrunnlag.TilstottendeYtelse.AAPGrunnlag';
  }
  return '';
};

/**
 * Regnes ut frontend da det ikke brukes noe annet sted enn til informasjon til saksbehandler
 * Metode for utregning beskrevet her: https://confluence.adeo.no/pages/viewpage.action?pageId=297094932#Applikasjonoginformasjon
 * @param grunnlag det originale grunnlaget på andelen
 * @returns {number} oppjustert dagsats
 */
const regnUtOppjustertAAP = (grunnlag) => {
  const mellomregning = grunnlag / 66;
  return mellomregning * 100;
};

/**
 * Regnes ut frontend da det ikke brukes noe annet sted enn til informasjon til saksbehandler
 * Metode for utregning beskrevet her: https://confluence.adeo.no/pages/viewpage.action?pageId=297094932#Applikasjonoginformasjon
 * @param grunnlag det originale grunnlaget på andelen
 * @returns {number} oppjustert dagsats
 */
const regnUtOppjustertDagpenger = (grunnlag) => {
  const mellomregning = grunnlag / 62.4;
  return mellomregning * 100;
};

const finnOppjustertGrunnlag = (andel) => {
  if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER) {
    return regnUtOppjustertAAP(andel.beregnetPrAar);
  } if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
    return regnUtOppjustertDagpenger(andel.beregnetPrAar);
  }
  return undefined;
};

/**
 * TilstotendeYtelser
 *
 * Presentasjonskomponent. Viser navn og sum på alle andeler som er tilstøttende ytelser
 * tilstøtendeYtelseType: Brukes for andre verdier enn dagpenger og arbeidsavklaringspenger.
 */
const TilstotendeYtelser = ({
  alleAndeler,
  isKombinasjonsstatus,
  skalViseOppjustertGrunnlag,
}) => {
  const relevanteAndeler = alleAndeler.filter(andel => isStatusDagpengerOrAAP(andel.aktivitetStatus.kode));
  return (
    <div>
      {isKombinasjonsstatus
      && (
      <div>
        <Element>
          <FormattedMessage id="Beregningsgrunnlag.TilstottendeYtelse.Tittel" />
        </Element>
        <VerticalSpacer fourPx />
      </div>
      )
      }
      {relevanteAndeler.map((andel, index) => (
        <div key={andel.aktivitetStatus.kode.concat('_'.concat(index))}>
          <Row>
            <Column xs="3">
              <Normaltekst>
                <FormattedMessage
                  id={getTekstForAndelBruktIBeregning(andel, skalViseOppjustertGrunnlag)}
                />
              </Normaltekst>
            </Column>
            {skalViseOppjustertGrunnlag
            && (
            <Column xs="3">
              <Normaltekst>
                <FormattedMessage
                  id={getTekstForAndelensGrunnlag(andel)}
                />
              </Normaltekst>
            </Column>
            )
            }
          </Row>
          {skalViseOppjustertGrunnlag
            && (
              <Row>
                <Column xs="3">
                  <Element>{formatCurrencyNoKr(finnOppjustertGrunnlag(andel))}</Element>
                </Column>
                <Column xs="3">
                  <Normaltekst>{formatCurrencyNoKr(andel.beregnetPrAar)}</Normaltekst>
                </Column>
              </Row>
            )
            }
          {!skalViseOppjustertGrunnlag
          && (
            <Row>
              <Column xs="6">
                <Element>{formatCurrencyNoKr(andel.beregnetPrAar)}</Element>
              </Column>
            </Row>
          )
          }
          <VerticalSpacer eightPx />
        </div>
      ))}
    </div>
  );
};

TilstotendeYtelser.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isKombinasjonsstatus: PropTypes.bool.isRequired,
  skalViseOppjustertGrunnlag: PropTypes.bool.isRequired,
};

export default TilstotendeYtelser;
