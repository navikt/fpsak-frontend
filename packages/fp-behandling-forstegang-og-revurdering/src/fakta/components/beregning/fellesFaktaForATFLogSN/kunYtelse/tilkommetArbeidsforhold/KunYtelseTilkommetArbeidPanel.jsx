import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { isArrayEmpty, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { getKunYtelse, getEndringBeregningsgrunnlagPerioder } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { besteberegningField } from '../KunYtelseBesteberegningPanel';
import KunYtelsePanel from '../KunYtelsePanel';
import EndringBeregningsgrunnlagForm, { getFieldNameKey }
  from '../../endringBeregningsgrunnlag/EndringBeregningsgrunnlagForm';
import {
  settAndelIArbeid, setGenerellAndelsinfo, setArbeidsforholdInitialValues, settFastsattBelop,
} from '../../BgFordelingUtils';
import { validateAndelFields, validateSumFastsattBelop, validateUlikeAndeler } from '../../ValidateAndelerUtils';
import { getFormValuesForBeregning } from '../../../BeregningFormUtils';

const harKunYtelseOgEndretBeregningsgrunnlag = aktivertePaneler => (aktivertePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE)
&& aktivertePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG));

/**
 * KunYtelseTilkommetArbeidPanel
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for fastsetting av bg for kun ytelse.
 */

export const KunYtelseTilkommetArbeidPanel = ({
  readOnly,
  skalSjekkeBesteberegning,
  isAksjonspunktClosed,
  perioder,
  skalViseTilkommetTabell,
}) => (
  <div>
    <KunYtelsePanel
      readOnly={readOnly}
      isAksjonspunktClosed={isAksjonspunktClosed}
      skalSjekkeBesteberegning={skalSjekkeBesteberegning}
    />
    {skalViseTilkommetTabell
    && (
    <EndringBeregningsgrunnlagForm
      skalHaEndretInformasjonIHeader
      isAksjonspunktClosed={isAksjonspunktClosed}
      readOnly={readOnly}
      perioder={perioder}
    />
    )
    }
  </div>
);

KunYtelseTilkommetArbeidPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  skalSjekkeBesteberegning: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  skalViseTilkommetTabell: PropTypes.bool.isRequired,
};


const buildPeriodeInitialValues = (periode, isRevurdering) => {
  if (!periode || !periode.endringBeregningsgrunnlagAndeler) {
    return {};
  }
  return (
    periode.endringBeregningsgrunnlagAndeler.map((andel) => {
      const andelsInfo = setGenerellAndelsinfo(andel);
      const erBrukersAndel = andelsInfo.aktivitetStatus === aktivitetStatus.BRUKERS_ANDEL;
      return ({
        ...andelsInfo,
        ...setArbeidsforholdInitialValues(andel),
        andel: andelsInfo.aktivitetStatus === aktivitetStatus.BRUKERS_ANDEL ? 'Ytelse' : andelsInfo.andel,
        andelIArbeid: settAndelIArbeid(andel.andelIArbeid),
        fordelingForrigeBehandling: isRevurdering && (andel.fordelingForrigeBehandling || andel.fordelingForrigeBehandling === 0)
          ? formatCurrencyNoKr(andel.fordelingForrigeBehandling) : null,
        fastsattBeløp: settFastsattBelop(periode.harPeriodeAarsakGraderingEllerRefusjon,
          andel.beregnetPrMnd, andel.fastsattForrige, andel.fordelingForrigeBehandling, andel.fastsattAvSaksbehandler),
        refusjonskrav: andel.refusjonskrav && !erBrukersAndel ? formatCurrencyNoKr(andel.refusjonskrav) : '0',
        skalKunneEndreRefusjon: periode.skalKunneEndreRefusjon && !erBrukersAndel ? periode.skalKunneEndreRefusjon : false,
        belopFraInntektsmelding: andel.belopFraInntektsmelding,
        harPeriodeAarsakGraderingEllerRefusjon: periode.harPeriodeAarsakGraderingEllerRefusjon,
        refusjonskravFraInntektsmelding: andel.refusjonskravFraInntektsmelding,
      });
    })
  );
};

const buildInitialValuesForPerioder = (endringBGPerioder, isRevurdering) => {
  const initialValues = {};
  if (!endringBGPerioder) {
    return initialValues;
  }
  endringBGPerioder.forEach((periode, index) => {
    initialValues[getFieldNameKey(index)] = buildPeriodeInitialValues(periode, isRevurdering);
  });
  return initialValues;
};


KunYtelseTilkommetArbeidPanel.buildInitialValues = (kunYtelse, endringBGPerioder, isRevurdering, aktivertePaneler) => {
  if (!harKunYtelseOgEndretBeregningsgrunnlag(aktivertePaneler)) {
    return null;
  }
  if (!kunYtelse || !kunYtelse.andeler || kunYtelse.andeler.length === 0) {
    return {};
  }
  if (!endringBGPerioder || endringBGPerioder.length < 2) {
    return {};
  }
  const perioder = endringBGPerioder.slice(1, endringBGPerioder.length);
  return {
    ...KunYtelsePanel.buildInitialValues(kunYtelse),
    ...buildInitialValuesForPerioder(perioder, isRevurdering),
  };
};


KunYtelseTilkommetArbeidPanel.transformValues = (values, kunYtelse, endringBGPerioder) => ({
  ...EndringBeregningsgrunnlagForm.transformValues(values, endringBGPerioder.slice(1, endringBGPerioder.length), true),
  ...KunYtelsePanel.transformValues(values, kunYtelse),
});

const validatePeriode = (periode, sumFordelingKunYtelse) => {
  const arrayErrors = periode.map((andelFieldValues) => {
    if (!andelFieldValues.harPeriodeAarsakGraderingEllerRefusjon) {
      return null;
    }
    return validateAndelFields(andelFieldValues);
  });
  if (arrayErrors.some(errors => errors !== null)) {
    return arrayErrors;
  }
  if (isArrayEmpty(periode)) {
    return null;
  }
  const ulikeAndelerError = validateUlikeAndeler(periode);
  if (ulikeAndelerError) {
    return { _error: ulikeAndelerError };
  }
  const fastsattBelopError = validateSumFastsattBelop(periode, sumFordelingKunYtelse);
  if (fastsattBelopError) {
    return { _error: fastsattBelopError };
  }
  return null;
};

KunYtelseTilkommetArbeidPanel.validate = (values, aktivertePaneler, kunYtelse, endringBGPerioder) => {
  if (!values || !harKunYtelseOgEndretBeregningsgrunnlag(aktivertePaneler)) {
    return null;
  }
  const kunYtelseErrors = KunYtelsePanel.validate(values, aktivertePaneler, kunYtelse);
  const perioderEtterForste = endringBGPerioder.slice(1, endringBGPerioder.length);
  const sumFordeling = KunYtelsePanel.summerFordeling(values);
  const endringErrors = {};
  for (let i = 0; i < perioderEtterForste.length; i += 1) {
    endringErrors[getFieldNameKey(i)] = validatePeriode(values[getFieldNameKey(i)], sumFordeling);
  }
  return {
    ...kunYtelseErrors,
    ...endringErrors,
  };
};

const mapStateToProps = (state) => {
  const kunYtelse = getKunYtelse(state);
  const perioder = getEndringBeregningsgrunnlagPerioder(state);
  return {
    skalSjekkeBesteberegning: kunYtelse.fodendeKvinneMedDP,
    perioder: perioder.slice(1, perioder.length),
    skalViseTilkommetTabell: !kunYtelse.fodendeKvinneMedDP
    || getFormValuesForBeregning(state)[besteberegningField] !== undefined,
  };
};

export default connect(mapStateToProps)(KunYtelseTilkommetArbeidPanel);
