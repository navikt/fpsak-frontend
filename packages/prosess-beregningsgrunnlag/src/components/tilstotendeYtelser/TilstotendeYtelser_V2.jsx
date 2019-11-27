import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';
import { Column, Row } from 'nav-frontend-grid';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus, { isStatusDagpengerOrAAP } from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

export const getTekstForAndelBruktIBeregning = (andel, erIKombinasjonMedSN) => {
  if (erIKombinasjonMedSN === true) {
    if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
      return 'Beregningsgrunnlag.TilstottendeYtelse.DagpengerOppjustert';
    }
    if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER) {
      return 'Beregningsgrunnlag.TilstottendeYtelse.AAPOppjustert';
    }
  } else {
    if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
      return 'Beregningsgrunnlag.TilstottendeYtelse.Dagpenger';
    }
    if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER) {
      return 'Beregningsgrunnlag.TilstottendeYtelse.AAP';
    }
  }
  return '';
};

const getTekstForAndelensGrunnlag = (andel) => {
  if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
    return 'Beregningsgrunnlag.TilstottendeYtelse.DagpengerGrunnlag';
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER) {
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
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
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
  relevanteStatuser,
  gjelderBesteberegning,
}) => {
  const relevanteAndeler = alleAndeler.filter((andel) => isStatusDagpengerOrAAP(andel.aktivitetStatus.kode));
  const skalViseOppjustertGrunnlag = relevanteStatuser.isSelvstendigNaeringsdrivende && !gjelderBesteberegning;
  return (
    <Panel className={beregningStyles.panel}>
      {relevanteStatuser.isKombinasjonsstatus
      && (
        <>
          <Element>
            <FormattedMessage id="Beregningsgrunnlag.TilstottendeYtelse.TittelNav" />
          </Element>
          <VerticalSpacer fourPx />
        </>
      )}
      <Row>
        <Column xs="4" />
        <Column xs="2" />
        <Column xs="2" className={beregningStyles.rightAlignElement}>
          <Undertekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Maaned" />
          </Undertekst>
        </Column>
        <Column xs="2" className={beregningStyles.rightAlignElement}>
          <Undertekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Aar" />
          </Undertekst>
        </Column>
        <Column xs="2" />
      </Row>

      <Row>

        {relevanteAndeler.map((andel, index) => (
          <div key={andel.aktivitetStatus.kode.concat('_'.concat(index))}>

            <Column xs="4">
              <Normaltekst>
                <FormattedMessage
                  id={getTekstForAndelBruktIBeregning(andel, skalViseOppjustertGrunnlag)}
                />
              </Normaltekst>
            </Column>
            {skalViseOppjustertGrunnlag
            && (
              <>
                <Column xs="4">
                  <Normaltekst>
                    <FormattedMessage
                      id={getTekstForAndelensGrunnlag(andel)}
                    />
                  </Normaltekst>
                </Column>
              </>
            )}
            {skalViseOppjustertGrunnlag
            && (
              <>
                <Column xs="2" />
                <Column xs="2">
                  <Normaltekst>{formatCurrencyNoKr(finnOppjustertGrunnlag(andel))}</Normaltekst>
                </Column>
                <Column xs="2">
                  <Normaltekst>{formatCurrencyNoKr(andel.beregnetPrAar)}</Normaltekst>
                </Column>
              </>
            )}
            {!skalViseOppjustertGrunnlag
          && (
            <>
              <Column xs="2" />
              <Column xs="2" className={beregningStyles.rightAlignElement}><Normaltekst>{formatCurrencyNoKr(andel.beregnetPrAar / 12)}</Normaltekst></Column>
              <Column xs="2" className={beregningStyles.rightAlignElement}><Normaltekst>{formatCurrencyNoKr(andel.beregnetPrAar)}</Normaltekst></Column>
              <Column xs="2" />
            </>
          )}
            <VerticalSpacer eightPx />
          </div>
        ))}
      </Row>
    </Panel>
  );
};

TilstotendeYtelser.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  relevanteStatuser: PropTypes.shape().isRequired,
  gjelderBesteberegning: PropTypes.bool.isRequired,
};

export default TilstotendeYtelser;
