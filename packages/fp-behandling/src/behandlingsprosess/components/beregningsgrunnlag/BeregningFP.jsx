import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';

import { aksjonspunktPropType, beregningsgrunnlagPropType, behandlingspunktCodes } from '@fpsak-frontend/fp-behandling-felles';
import { VerticalSpacer, FadingPanel } from '@fpsak-frontend/shared-components';
import {
  getAktivitetStatuser,
  getAlleAndelerIForstePeriode,
  getBehandlingGjelderBesteberegning,
  getBeregningsgrunnlag,
  getGjeldendeBeregningAksjonspunkter,
  getBeregningGraderingAksjonspunkt,
} from 'behandlingFpsak/src/behandlingSelectors';
import { getSelectedBehandlingspunktVilkar } from 'behandlingFpsak/src/behandlingsprosess/behandlingsprosessSelectors';
import aktivitetStatus, {
  isStatusArbeidstakerOrKombinasjon,
  isStatusDagpengerOrAAP,
  isStatusFrilanserOrKombinasjon,
  isStatusKombinasjon,
  isStatusMilitaer,
  isStatusSNOrKombinasjon,
  isStatusTilstotendeYtelse,
} from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import BeregningsresultatTable from './beregningsresultatPanel/BeregningsresultatTable';
import BeregningForm from './beregningForm/BeregningForm';
import GraderingUtenBG from './gradering/GraderingUtenBG';

const visningForManglendeBG = () => (
  <FadingPanel>
    <Undertittel>
      <FormattedMessage id="Beregningsgrunnlag.Title" />
    </Undertittel>
    <VerticalSpacer eightPx />
    <Row>
      <Column xs="6">
        <FormattedMessage id="Beregningsgrunnlag.HarIkkeBeregningsregler" />
      </Column>
    </Row>
    <Row>
      <Column xs="6">
        <FormattedMessage id="Beregningsgrunnlag.SakTilInfo" />
      </Column>
    </Row>
  </FadingPanel>
);

/**
 * BeregningFP
 *
 * Presentasjonskomponent. Holder på alle komponenter relatert til beregning av foreldrepenger.
 * Finner det gjeldende aksjonspunktet hvis vi har et.
 */
export const BeregningFPImpl = ({
  readOnly,
  submitCallback,
  berGr,
  beregnetAarsinntekt,
  sammenligningsgrunnlag,
  beregnetAvvikPromille,
  gjeldendeVilkar,
  gjeldendeAksjonspunkter,
  relevanteStatuser,
  readOnlySubmitButton,
  sokerHarGraderingPaaAndelUtenBG,
}) => {
  let avvikProsent;
  if (beregnetAvvikPromille !== null && beregnetAvvikPromille !== undefined) {
    avvikProsent = beregnetAvvikPromille / 10;
  }
  if (!berGr) {
    return visningForManglendeBG();
  }
  return (
    <FadingPanel>
      <BeregningForm
        readOnly={readOnly}
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        avvikProsent={avvikProsent}
        beregnetAarsinntekt={beregnetAarsinntekt}
        sammenligningsgrunnlag={sammenligningsgrunnlag}
        relevanteStatuser={relevanteStatuser}
        submitCallback={submitCallback}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      { gjeldendeVilkar && gjeldendeVilkar.vilkarStatus.kode !== vilkarUtfallType.IKKE_VURDERT
        && (
          <BeregningsresultatTable
            halvGVerdi={berGr.halvG}
            isVilkarOppfylt={gjeldendeVilkar && gjeldendeVilkar.vilkarStatus.kode === vilkarUtfallType.OPPFYLT}
            beregningsgrunnlagPerioder={berGr.beregningsgrunnlagPeriode}
            ledetekstBrutto={berGr.ledetekstBrutto}
            ledetekstAvkortet={berGr.ledetekstAvkortet}
            ledetekstRedusert={berGr.ledetekstRedusert}
          />
        )
        }
      {sokerHarGraderingPaaAndelUtenBG
          && (
          <GraderingUtenBG
            submitCallback={submitCallback}
            readOnly={readOnly}
          />
          )
        }
    </FadingPanel>
  );
};

BeregningFPImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  berGr: beregningsgrunnlagPropType,
  beregnetAarsinntekt: PropTypes.number,
  sammenligningsgrunnlag: PropTypes.number,
  beregnetAvvikPromille: PropTypes.number,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  gjeldendeVilkar: PropTypes.shape(),
  relevanteStatuser: PropTypes.shape().isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  sokerHarGraderingPaaAndelUtenBG: PropTypes.bool,
};

BeregningFPImpl.defaultProps = {
  berGr: undefined,
  beregnetAarsinntekt: undefined,
  gjeldendeVilkar: undefined,
  sammenligningsgrunnlag: undefined,
  beregnetAvvikPromille: undefined,
  sokerHarGraderingPaaAndelUtenBG: false,
};

const bestemGjeldendeStatuser = createSelector([getAktivitetStatuser], aktivitetStatuser => ({
  isArbeidstaker: aktivitetStatuser.some(({ kode }) => isStatusArbeidstakerOrKombinasjon(kode)),
  isFrilanser: aktivitetStatuser.some(({ kode }) => isStatusFrilanserOrKombinasjon(kode)),
  isSelvstendigNaeringsdrivende: aktivitetStatuser.some(({ kode }) => isStatusSNOrKombinasjon(kode)),
  harAndreTilstotendeYtelser: aktivitetStatuser.some(({ kode }) => isStatusTilstotendeYtelse(kode)),
  harDagpengerEllerAAP: aktivitetStatuser.some(({ kode }) => isStatusDagpengerOrAAP(kode)),
  skalViseBeregningsgrunnlag: aktivitetStatuser && aktivitetStatuser.length > 0,
  isKombinasjonsstatus: aktivitetStatuser.some(({ kode }) => isStatusKombinasjon(kode)) || aktivitetStatuser.length > 1,
  isMilitaer: aktivitetStatuser.some(({ kode }) => isStatusMilitaer(kode)),
}));

const getBeregnetAarsinntekt = createSelector(
  [getBeregningsgrunnlag, bestemGjeldendeStatuser, getAlleAndelerIForstePeriode, getBehandlingGjelderBesteberegning],
  (beregningsgrunnlag, relevanteStatuser, alleAndelerIForstePeriode, gjelderBesteberegning) => {
    if (!beregningsgrunnlag) {
      return {};
    }
    if (relevanteStatuser.harAndreTilstotendeYtelser) {
      return beregningsgrunnlag.beregningsgrunnlagPeriode[0].bruttoPrAar;
    }
    if (relevanteStatuser.isSelvstendigNaeringsdrivende) {
      if (gjelderBesteberegning) {
        return beregningsgrunnlag.beregningsgrunnlagPeriode[0].bruttoPrAar;
      }
      const snAndel = alleAndelerIForstePeriode.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE)[0];
      return snAndel.erNyIArbeidslivet ? undefined : snAndel.pgiSnitt;
    }
    return beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregnetPrAar;
  },
);

const buildProps = createSelector(
  [getBeregningsgrunnlag, getSelectedBehandlingspunktVilkar, bestemGjeldendeStatuser,
    getGjeldendeBeregningAksjonspunkter, getBeregnetAarsinntekt, getBeregningGraderingAksjonspunkt],
  (berGr, gjeldendeVilkar, relevanteStatuser, gjeldendeAksjonspunkter, beregnetAarsinntekt, graderingAP) => {
    if (!berGr) {
      return {};
    }
    const sammenligningsgrunnlag = berGr.sammenligningsgrunnlag ? berGr.sammenligningsgrunnlag.rapportertPrAar : undefined;
    const beregnetAvvikPromille = berGr.sammenligningsgrunnlag ? berGr.sammenligningsgrunnlag.avvikPromille : undefined;
    const sokerHarGraderingPaaAndelUtenBG = !!graderingAP;
    return {
      gjeldendeVilkar: gjeldendeVilkar.length > 0 ? gjeldendeVilkar[0] : undefined,
      gjeldendeAksjonspunkter,
      berGr,
      beregnetAarsinntekt,
      sammenligningsgrunnlag,
      beregnetAvvikPromille,
      relevanteStatuser,
      sokerHarGraderingPaaAndelUtenBG,
    };
  },
);

const mapStateToProps = state => ({
  ...buildProps(state),
});

const BeregningFP = connect(mapStateToProps)(BeregningFPImpl);
BeregningFP.supports = bp => bp === behandlingspunktCodes.BEREGNINGSGRUNNLAG;
export default BeregningFP;
