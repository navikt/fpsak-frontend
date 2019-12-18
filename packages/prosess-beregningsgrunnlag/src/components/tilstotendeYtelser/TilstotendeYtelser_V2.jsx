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

export const getTekstForAndelBruktIBeregning = (andel) => {
  if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
    return 'Beregningsgrunnlag.TilstottendeYtelse.Dagpenger';
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER) {
    return 'Beregningsgrunnlag.TilstottendeYtelse.AAP';
  }
  return '';
};

const TilstotendeYtelser2 = ({
  alleAndeler,
  relevanteStatuser,
}) => {
  const relevanteAndeler = alleAndeler.filter((andel) => isStatusDagpengerOrAAP(andel.aktivitetStatus.kode));
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
        <Column xs="7" />
        <Column className={beregningStyles.colMaanedText}>
          <Undertekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidsinntekt.Maaned" />
          </Undertekst>
        </Column>
        <Column className={beregningStyles.colAarText}>
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
                <Normaltekst>
                  <FormattedMessage
                    id={getTekstForAndelBruktIBeregning(andel)}
                  />
                </Normaltekst>
              </Column>
              <Column xs="3" />
              <Column xs="2" className={beregningStyles.colMaanedText}><Normaltekst>{formatCurrencyNoKr(andel.beregnetPrAar / 12)}</Normaltekst></Column>
              <Column xs="2" className={beregningStyles.colAarText}><Normaltekst>{formatCurrencyNoKr(andel.beregnetPrAar)}</Normaltekst></Column>
              <Column xs="2" />
            </Row>
            <VerticalSpacer eightPx />
          </div>
        ))}
      </>
    </Panel>
  );
};

TilstotendeYtelser2.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  relevanteStatuser: PropTypes.shape().isRequired,
};

export default TilstotendeYtelser2;
