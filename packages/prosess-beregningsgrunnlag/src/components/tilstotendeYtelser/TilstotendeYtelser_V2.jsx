import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { Column, Row } from 'nav-frontend-grid';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import aktivitetStatus, { isStatusDagpengerOrAAP } from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import AvsnittSkiller from '../redesign/AvsnittSkiller';


export const getTekstForAndelBruktIBeregning = (andel) => {
  if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
    return 'Beregningsgrunnlag.TilstottendeYtelse.Dagpenger';
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER) {
    return 'Beregningsgrunnlag.TilstottendeYtelse.AAP';
  }
  return '';
};
const isAktivitetKodeDagpenger = (aktivitetStatusKode) => aktivitetStatusKode === aktivitetStatus.DAGPENGER;

const TilstotendeYtelser2 = ({
  alleAndeler,
  relevanteStatuser,
  gjelderBesteberegning,
}) => {
  const relevanteAndeler = alleAndeler.filter((andel) => isStatusDagpengerOrAAP(andel.aktivitetStatus.kode));
  const harFlereYtelser = relevanteAndeler.length > 1;

  return (
    <>
      {relevanteStatuser.isKombinasjonsstatus
      && (
        <>
          <AvsnittSkiller luftOver luftUnder />
          <Element className={beregningStyles.avsnittOverskrift}>
            <FormattedMessage id="Beregningsgrunnlag.TilstottendeYtelse.TittelNav" />
          </Element>
          <VerticalSpacer eightPx />
        </>
      )}
      <Row>
        <Column xs="7" />
        <Column xs="2" className={beregningStyles.colMaanedText}>
          <Undertekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Maaned" />
          </Undertekst>
        </Column>
        <Column xs="2" className={beregningStyles.colAarText}>
          <Undertekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Aar" />
          </Undertekst>
        </Column>
        <Column xs="2" />
      </Row>

      <>
        {relevanteAndeler.map((andel, index) => (
          <div key={andel.aktivitetStatus.kode.concat('_'.concat(index))}>
            <Row>
              <Column xs="4">
                <Element>
                  <FormattedMessage
                    id={getTekstForAndelBruktIBeregning(andel)}
                  />
                </Element>
              </Column>
              <Column xs="3" />
              <Column xs="2" className={beregningStyles.colMaanedText}><Normaltekst>{formatCurrencyNoKr(andel.beregnetPrAar / 12)}</Normaltekst></Column>
              <Column xs="2" className={beregningStyles.colAarText}>
                <Normaltekst className={!harFlereYtelser ? beregningStyles.semiBoldText : ''}>{formatCurrencyNoKr(andel.beregnetPrAar)}</Normaltekst>
              </Column>
              <Column xs="2" />
            </Row>
            {gjelderBesteberegning && isAktivitetKodeDagpenger(andel.aktivitetStatus.kode) && (
              <Row>
                <Column xs="12">
                  <Normaltekst>
                    <FormattedMessage id="Beregningsgrunnlag.TilstottendeYtelse.Besteberegning" />
                  </Normaltekst>
                </Column>
              </Row>
            )}
          </div>
        ))}
      </>
    </>
  );
};

TilstotendeYtelser2.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  relevanteStatuser: PropTypes.shape().isRequired,
  gjelderBesteberegning: PropTypes.bool.isRequired,
};

export default TilstotendeYtelser2;
