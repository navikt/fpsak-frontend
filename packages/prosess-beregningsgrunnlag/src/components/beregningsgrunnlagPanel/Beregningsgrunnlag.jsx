import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import {
  BehandlingspunktSubmitButton,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import { TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidText, maxLength, minLength, removeSpacesFromNumber, required,
} from '@fpsak-frontend/utils';


import YtelserFraInfotrygd from '../tilstotendeYtelser/YtelserFraInfotrygd';
import GrunnlagForAarsinntektPanelSN from '../selvstendigNaeringsdrivende/GrunnlagForAarsinntektPanelSN';
import OppsummeringSN from '../selvstendigNaeringsdrivende/OppsummeringSN';
import TilstotendeYtelser from '../tilstotendeYtelser/TilstotendeYtelser';
import MilitaerPanel from '../militær/MilitaerPanel';
import styles from './beregningsgrunnlag.less';
import VurderOgFastsettSN from '../selvstendigNaeringsdrivende/VurderOgFastsettSN';
import GrunnlagForAarsinntektPanelFL from '../frilanser/GrunnlagForAarsinntektPanelFL';
import GrunnlagForAarsinntektPanelAT from '../arbeidstaker/GrunnlagForAarsinntektPanelAT';
import FastsettInntektTidsbegrenset from '../arbeidstaker/FastsettInntektTidsbegrenset';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';

// ------------------------------------------------------------------------------------------ //
// Variables
// ------------------------------------------------------------------------------------------ //

export const TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING = 'begrunnDekningsgradEndring';

const {
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  VURDER_DEKNINGSGRAD,
} = aksjonspunktCodes;
const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

// ------------------------------------------------------------------------------------------ //
// Methods
// ------------------------------------------------------------------------------------------ //

const harPerioderMedAvsluttedeArbeidsforhold = (allePerioder, gjeldendeAksjonspunkter) => allePerioder.some(({ periodeAarsaker }) => periodeAarsaker
    && periodeAarsaker.some(({ kode }) => kode === periodeAarsak.ARBEIDSFORHOLD_AVSLUTTET))
    && gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.some((ap) => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD);

const skalFastsetteSN = (aksjonspunkter) => aksjonspunkter && aksjonspunkter.some(
  (ap) => ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE
  || ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
);

const isSelvstendigMedKombinasjonsstatus = (relevanteStatuser) => relevanteStatuser.isSelvstendigNaeringsdrivende && relevanteStatuser.isKombinasjonsstatus;

const skalViseSNOppsummering = (relevanteStatuser, gjeldendeAksjonspunkter) => isSelvstendigMedKombinasjonsstatus(relevanteStatuser)
  && (gjeldendeAksjonspunkter ? gjeldendeAksjonspunkter.every((ap) => ap.definisjon.kode !== FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET) : true);

const finnAksjonspunktForATFL = (gjeldendeAksjonspunkter) => gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.find(
  (ap) => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS
  || ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
);

const finnAksjonspunktForVurderDekningsgrad = (gjeldendeAksjonspunkter) => gjeldendeAksjonspunkter
  && gjeldendeAksjonspunkter.find((ap) => ap.definisjon.kode === VURDER_DEKNINGSGRAD);

const erVurderDekningsgradEnesteAksjonspunkt = (gjeldendeAksjonspunkter) => !!gjeldendeAksjonspunkter
  && gjeldendeAksjonspunkter.some((ap) => ap.definisjon.kode === VURDER_DEKNINGSGRAD)
  && gjeldendeAksjonspunkter.length === 1;

const harFlereAksjonspunkter = (gjeldendeAksjonspunkter) => !!gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.length > 1;

const harFlereAksjonspunkterOgVurderDekningsgradErInkludert = (gjeldendeAksjonspunkter) => !!gjeldendeAksjonspunkter
  && gjeldendeAksjonspunkter.some((ap) => ap.definisjon.kode === VURDER_DEKNINGSGRAD)
  && harFlereAksjonspunkter(gjeldendeAksjonspunkter);

const finnATFLVurderingLabel = (gjeldendeAksjonspunkter) => {
  if (harFlereAksjonspunkter(gjeldendeAksjonspunkter)) {
    return <FormattedMessage id="Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag" />;
  }
  return <FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />;
};
const finnAlleAndelerIFørstePeriode = (allePerioder) => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};

const createRelevantePaneler = (alleAndelerIForstePeriode,
  gjeldendeAksjonspunkter,
  relevanteStatuser,
  allePerioder,
  readOnly,
  gjelderBesteberegning,
  behandlingId,
  behandlingVersjon,
  alleKodeverk) => (
    <div>
      { relevanteStatuser.isSelvstendigNaeringsdrivende
    && (
    <GrunnlagForAarsinntektPanelSN
      alleAndeler={alleAndelerIForstePeriode}
    />
    )}
      {(relevanteStatuser.harDagpengerEllerAAP)
    && (
    <div>
      <TilstotendeYtelser
        alleAndeler={alleAndelerIForstePeriode}
        relevanteStatuser={relevanteStatuser}
        gjelderBesteberegning={gjelderBesteberegning}
      />
      <VerticalSpacer twentyPx />
    </div>
    )}
      <VerticalSpacer eightPx />
      {(relevanteStatuser.isMilitaer)
      && (
        <div>
          <MilitaerPanel
            alleAndeler={alleAndelerIForstePeriode}
          />
          <VerticalSpacer twentyPx />
        </div>
      )}
      {(relevanteStatuser.harAndreTilstotendeYtelser)
    && (
      <div>
        <YtelserFraInfotrygd
          bruttoPrAar={allePerioder[0].bruttoPrAar}
        />
        <VerticalSpacer twentyPx />
      </div>
    )}
      { relevanteStatuser.isFrilanser
    && (
    <div>
      <GrunnlagForAarsinntektPanelFL
        alleAndeler={alleAndelerIForstePeriode}
        aksjonspunkter={gjeldendeAksjonspunkter}
        readOnly={readOnly}
        isKombinasjonsstatus={relevanteStatuser.isKombinasjonsstatus}
      />
      <VerticalSpacer twentyPx />
    </div>
    )}
      <VerticalSpacer eightPx />
      { relevanteStatuser.isArbeidstaker
    && (
      <div>
        {!harPerioderMedAvsluttedeArbeidsforhold(allePerioder, gjeldendeAksjonspunkter)
        && (
        <GrunnlagForAarsinntektPanelAT
          alleAndeler={alleAndelerIForstePeriode}
          aksjonspunkter={gjeldendeAksjonspunkter}
          allePerioder={allePerioder}
          readOnly={readOnly}
          isKombinasjonsstatus={relevanteStatuser.isKombinasjonsstatus}
          alleKodeverk={alleKodeverk}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
        )}
        { harPerioderMedAvsluttedeArbeidsforhold(allePerioder, gjeldendeAksjonspunkter)
        && (
        <FastsettInntektTidsbegrenset
          readOnly={readOnly}
          aksjonspunkter={gjeldendeAksjonspunkter}
          allePerioder={allePerioder}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          alleKodeverk={alleKodeverk}
        />
        )}
      </div>
    )}
      { skalViseSNOppsummering(relevanteStatuser, gjeldendeAksjonspunkter)
    && (
    <OppsummeringSN
      alleAndeler={alleAndelerIForstePeriode}
    />
    )}
    </div>
);

// ------------------------------------------------------------------------------------------ //
// Component : BeregningsgrunnlagImpl
// ------------------------------------------------------------------------------------------ //
/**
 * Beregningsgrunnlag
 *
 * Presentasjonsskomponent. Holder på alle komponenter relatert til å vise beregningsgrunnlaget til de forskjellige
 * statusene og viser disse samlet i en faktagruppe.
 */
export const BeregningsgrunnlagImpl = ({
  readOnly,
  relevanteStatuser,
  gjeldendeAksjonspunkter,
  allePerioder,
  readOnlySubmitButton,
  gjelderBesteberegning,
  behandlingId,
  behandlingVersjon,
  formName,
  alleKodeverk,
}) => {
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(allePerioder);
  return (
    <div className={styles.beregningsgrunnlagPanel}>
      { harFlereAksjonspunkterOgVurderDekningsgradErInkludert(gjeldendeAksjonspunkter) && (
        <>
          <TextAreaField
            name={TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING}
            label={<FormattedMessage id="Beregningsgrunnlag.Forms.BegrunnEndringAvDekningsgrad" />}
            validate={[required, maxLength1500, minLength3, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
          <VerticalSpacer eightPx />
        </>
      )}
      { finnAksjonspunktForATFL(gjeldendeAksjonspunkter)
      && (
      <TextAreaField
        name="ATFLVurdering"
        label={finnATFLVurderingLabel(gjeldendeAksjonspunkter)}
        validate={[required, maxLength1500, minLength3, hasValidText]}
        maxLength={1500}
        readOnly={readOnly}
      />
      )}
      <BorderBox>
        <Element>
          <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Beregningsgrunnlag" />
        </Element>
        {
          createRelevantePaneler(
            alleAndelerIForstePeriode,
            gjeldendeAksjonspunkter,
            relevanteStatuser,
            allePerioder,
            readOnly,
            gjelderBesteberegning,
            behandlingId,
            behandlingVersjon,
            alleKodeverk,
          )
        }
      </BorderBox>
      { skalFastsetteSN(gjeldendeAksjonspunkter)
      && (
      <VurderOgFastsettSN
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        readOnly={readOnly}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
      )}
      <VerticalSpacer sixteenPx />
      { erVurderDekningsgradEnesteAksjonspunkt(gjeldendeAksjonspunkter) && (
      <TextAreaField
        name={TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING}
        label={<FormattedMessage id="Beregningsgrunnlag.Forms.BegrunnEndring" />}
        validate={[required, maxLength1500, minLength3, hasValidText]}
        maxLength={1500}
        readOnly={readOnly}
      />
      )}
      { gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.length > 0
        && (
          <>
            <VerticalSpacer sixteenPx />
            <BehandlingspunktSubmitButton
              formName={formName}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              isReadOnly={readOnly}
              isSubmittable={!readOnlySubmitButton}
              isBehandlingFormSubmitting={isBehandlingFormSubmitting}
              isBehandlingFormDirty={isBehandlingFormDirty}
              hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            />
          </>
        )}
    </div>
  );
};

BeregningsgrunnlagImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  relevanteStatuser: PropTypes.shape().isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  readOnlySubmitButton: PropTypes.bool.isRequired,
  gjelderBesteberegning: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

BeregningsgrunnlagImpl.defaultProps = {
  allePerioder: undefined,
};

const Beregningsgrunnlag = BeregningsgrunnlagImpl;

Beregningsgrunnlag.buildInitialValues = (gjeldendeAksjonspunkter) => {
  const aksjonspunktATFL = finnAksjonspunktForATFL(gjeldendeAksjonspunkter);
  const aksjonspunktVurderDekninsgrad = finnAksjonspunktForVurderDekningsgrad(gjeldendeAksjonspunkter);
  return {
    ATFLVurdering: (aksjonspunktATFL) ? aksjonspunktATFL.begrunnelse : '',
    [TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING]: (aksjonspunktVurderDekninsgrad) ? aksjonspunktVurderDekninsgrad.begrunnelse : '',
  };
};

Beregningsgrunnlag.transformValues = (values, allePerioder) => ({
  kode: FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  begrunnelse: values.ATFLVurdering,
  fastsatteTidsbegrensedePerioder: FastsettInntektTidsbegrenset.transformValues(values, allePerioder),
  frilansInntekt: values.inntektFrilanser ? removeSpacesFromNumber(values.inntektFrilanser) : null,
});

export default Beregningsgrunnlag;
