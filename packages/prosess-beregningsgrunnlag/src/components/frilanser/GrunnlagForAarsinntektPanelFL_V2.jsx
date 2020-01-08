import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import Panel from 'nav-frontend-paneler';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { dateFormat, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';


/**
 * GrunnlagForAarsinntektPanelFL
 *
 * Presentasjonskomponent. Viser beregningsgrunnlag for frilansere.
 * Viser kun én frilanserinntekt og et inputfelt for å oversyre det ved aksjonspunkt.
 * Vises også hvis status er en kombinasjonsstatus som inkluderer frilanser.
 */
export const GrunnlagForAarsinntektPanelFL2 = ({
  alleAndeler,
  isKombinasjonsstatus,
}) => {
  const relevanteAndeler = alleAndeler.filter((andel) => andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER);
  const beregnetAarsinntekt = relevanteAndeler[0].beregnetPrAar;
  const startDato = relevanteAndeler[0].arbeidsforhold.startdato;
  return (
    <Panel className={beregningStyles.panelLeft}>
      { isKombinasjonsstatus
      && (
        <>
          <Element>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Frilansinntekt" />
          </Element>
          <VerticalSpacer eightPx />
        </>
      )}
      {startDato && (
      <Row>
        <Column xs="12">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.FrilansStartDato2" />
            <span className={beregningStyles.semiBoldText}>
              {dateFormat(startDato)}
            </span>
          </Normaltekst>
        </Column>
      </Row>
      )}
      <VerticalSpacer eightPx />
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
        <Column className={beregningStyles.colLink} />
      </Row>
      <Row>
        <Column xs="7">
          <Normaltekst>
            <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.InnrapportertFrilans" />
          </Normaltekst>
        </Column>
        <Column className={beregningStyles.colMaanedText}>
          <Normaltekst>{formatCurrencyNoKr(beregnetAarsinntekt / 12)}</Normaltekst>
        </Column>
        <Column className={beregningStyles.colAarText}>
          <Element>{formatCurrencyNoKr(beregnetAarsinntekt)}</Element>
        </Column>
        <Column className={beregningStyles.colLink} />
      </Row>
    </Panel>
  );
};
GrunnlagForAarsinntektPanelFL2.propTypes = {
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isKombinasjonsstatus: PropTypes.bool.isRequired,
};

GrunnlagForAarsinntektPanelFL2.defaultProps = {

};

GrunnlagForAarsinntektPanelFL2.buildInitialValues = (relevanteAndeler) => {
  if (relevanteAndeler.length === 0) {
    return undefined;
  }
  return {
    inntektFrilanser: relevanteAndeler[0].overstyrtPrAar ? formatCurrencyNoKr(relevanteAndeler[0].overstyrtPrAar) : '',
  };
};

export default GrunnlagForAarsinntektPanelFL2;
