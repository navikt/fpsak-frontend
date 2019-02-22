import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import {
  getAlleAndelerIForstePeriode,
  getBehandlingGjelderBesteberegning,
  getBeregningsgrunnlagPerioder,
} from 'behandlingFpsak/src/behandlingSelectors';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import BehandlingspunktSubmitButton from 'behandlingFpsak/src/behandlingsprosess/components/BehandlingspunktSubmitButton';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BorderBox, ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import { TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidText, maxLength, minLength, required, removeSpacesFromNumber,
} from '@fpsak-frontend/utils';
import YtelserFraInfotrygd
  from 'behandlingFpsak/src/behandlingsprosess/components/beregningsgrunnlag/tilstotendeYtelser/YtelserFraInfotrygd';
import GrunnlagForAarsinntektPanelFL from '../frilanser/GrunnlagForAarsinntektPanelFL';
import GrunnlagForAarsinntektPanelAT from '../arbeidstaker/GrunnlagForAarsinntektPanelAT';
import GrunnlagForAarsinntektPanelSN from '../selvstendigNaeringsdrivende/GrunnlagForAarsinntektPanelSN';
import FastsettNaeringsinntektSN from '../selvstendigNaeringsdrivende/FastsettNaeringsinntektSN';
import OppsummeringSN from '../selvstendigNaeringsdrivende/OppsummeringSN';
import TilstotendeYtelser from '../tilstotendeYtelser/TilstotendeYtelser';
import MilitaerPanel from '../militær/MilitaerPanel';
import FastsettInntektTidsbegrenset from '../arbeidstaker/FastsettInntektTidsbegrenset';
import styles from './beregningsgrunnlag.less';

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
    && gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.some(ap => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD);

const skalFastsetteSN = aksjonspunkter => aksjonspunkter && aksjonspunkter.some(
  ap => ap.definisjon.kode === VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE
  || ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
);

const isSelvstendigMedKombinasjonsstatus = relevanteStatuser => relevanteStatuser.isSelvstendigNaeringsdrivende && relevanteStatuser.isKombinasjonsstatus;

const skalViseSNOppsummering = (relevanteStatuser, gjeldendeAksjonspunkter) => isSelvstendigMedKombinasjonsstatus(relevanteStatuser)
  && (gjeldendeAksjonspunkter ? gjeldendeAksjonspunkter.every(ap => ap.definisjon.kode !== FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET) : true);

const finnAksjonspunktForATFL = gjeldendeAksjonspunkter => gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.find(
  ap => ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS
  || ap.definisjon.kode === FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
);

const finnAksjonspunktForVurderDekningsgrad = gjeldendeAksjonspunkter => gjeldendeAksjonspunkter
  && gjeldendeAksjonspunkter.find(ap => ap.definisjon.kode === VURDER_DEKNINGSGRAD);

const erVurderDekningsgradEnesteAksjonspunkt = gjeldendeAksjonspunkter => !!gjeldendeAksjonspunkter
  && gjeldendeAksjonspunkter.some(ap => ap.definisjon.kode === VURDER_DEKNINGSGRAD)
  && gjeldendeAksjonspunkter.length === 1;

const harFlereAksjonspunkter = gjeldendeAksjonspunkter => !!gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.length > 1;

const harFlereAksjonspunkterOgVurderDekningsgradErInkludert = gjeldendeAksjonspunkter => !!gjeldendeAksjonspunkter
  && gjeldendeAksjonspunkter.some(ap => ap.definisjon.kode === VURDER_DEKNINGSGRAD)
  && harFlereAksjonspunkter(gjeldendeAksjonspunkter);

const finnATFLVurderingLabel = (gjeldendeAksjonspunkter) => {
  if (harFlereAksjonspunkter(gjeldendeAksjonspunkter)) {
    return <FormattedMessage id="Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag" />;
  }
  return <FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />;
};

const createRelevantePaneler = (alleAndelerIForstePeriode,
  gjeldendeAksjonspunkter,
  relevanteStatuser,
  allePerioder,
  readOnly,
  gjelderBesteberegning) => (
    <div>
      { relevanteStatuser.isSelvstendigNaeringsdrivende
    && (
    <GrunnlagForAarsinntektPanelSN
      alleAndeler={alleAndelerIForstePeriode}
    />
    )
    }
      {(relevanteStatuser.harDagpengerEllerAAP)
    && (
    <div>
      <TilstotendeYtelser
        alleAndeler={alleAndelerIForstePeriode}
        isKombinasjonsstatus={relevanteStatuser.isKombinasjonsstatus}
        skalViseOppjustertGrunnlag={relevanteStatuser.isSelvstendigNaeringsdrivende && !gjelderBesteberegning}
      />
      <VerticalSpacer twentyPx />
    </div>
    )
    }
      <VerticalSpacer eightPx />
      {(relevanteStatuser.isMilitaer)
      && (
        <div>
          <MilitaerPanel
            alleAndeler={alleAndelerIForstePeriode}
          />
          <VerticalSpacer twentyPx />
        </div>
      )
      }
      {(relevanteStatuser.harAndreTilstotendeYtelser)
    && (
      <div>
        <YtelserFraInfotrygd
          alleAndeler={alleAndelerIForstePeriode}
          isKombinasjonsstatus={relevanteStatuser.isKombinasjonsstatus}
          bruttoPrAar={allePerioder[0].bruttoPrAar}
        />
        <VerticalSpacer twentyPx />
      </div>
    )
    }
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
    )
    }
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
      />
      )
      }
      { harPerioderMedAvsluttedeArbeidsforhold(allePerioder, gjeldendeAksjonspunkter)
      && (
      <FastsettInntektTidsbegrenset
        readOnly={readOnly}
      />
      )
      }
    </div>
    )
    }
      { skalViseSNOppsummering(relevanteStatuser, gjeldendeAksjonspunkter)
    && (
    <OppsummeringSN
      alleAndeler={alleAndelerIForstePeriode}
    />
    )
    }
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
  alleAndelerIForstePeriode,
  readOnlySubmitButton,
  gjelderBesteberegning,
  formName,
}) => (
  <div className={styles.beregningsgrunnlagPanel}>
    { harFlereAksjonspunkterOgVurderDekningsgradErInkludert(gjeldendeAksjonspunkter) && (
      <ElementWrapper>
        <TextAreaField
          name={TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING}
          label={<FormattedMessage id="Beregningsgrunnlag.Forms.BegrunnEndringAvDekningsgrad" />}
          validate={[required, maxLength1500, minLength3, hasValidText]}
          maxLength={1500}
          readOnly={readOnly}
        />
        <VerticalSpacer eightPx />
      </ElementWrapper>)}
    { finnAksjonspunktForATFL(gjeldendeAksjonspunkter)
      && (
      <TextAreaField
        name="ATFLVurdering"
        label={finnATFLVurderingLabel(gjeldendeAksjonspunkter)}
        validate={[required, maxLength1500, minLength3, hasValidText]}
        maxLength={1500}
        readOnly={readOnly}
      />
      )
      }
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
          )
        }
    </BorderBox>
    { skalFastsetteSN(gjeldendeAksjonspunkter)
      && (
      <FastsettNaeringsinntektSN
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        readOnly={readOnly}
      />
      )
      }
    <VerticalSpacer sixteenPx />
    { erVurderDekningsgradEnesteAksjonspunkt(gjeldendeAksjonspunkter) && (
      <TextAreaField
        name={TEKSTFELTNAVN_BEGRUNN_DEKNINGSGRAD_ENDRING}
        label={<FormattedMessage id="Beregningsgrunnlag.Forms.BegrunnEndring" />}
        validate={[required, maxLength1500, minLength3, hasValidText]}
        maxLength={1500}
        readOnly={readOnly}
      />)}
    { gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.length > 0
        && (
        <ElementWrapper>
          <VerticalSpacer sixteenPx />
          <BehandlingspunktSubmitButton formName={formName} isReadOnly={readOnly} isSubmittable={!readOnlySubmitButton} />
        </ElementWrapper>
        )
      }
  </div>
);

BeregningsgrunnlagImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  gjeldendeAksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  relevanteStatuser: PropTypes.shape().isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  readOnlySubmitButton: PropTypes.bool.isRequired,
  gjelderBesteberegning: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
};

BeregningsgrunnlagImpl.defaultProps = {
  allePerioder: undefined,
};

const mapStateToProps = (state) => {
  const alleAndelerIForstePeriode = getAlleAndelerIForstePeriode(state);
  const allePerioder = getBeregningsgrunnlagPerioder(state);
  const gjelderBesteberegning = getBehandlingGjelderBesteberegning(state);
  return {
    gjelderBesteberegning,
    alleAndelerIForstePeriode,
    allePerioder,
  };
};

const Beregningsgrunnlag = connect(mapStateToProps)(BeregningsgrunnlagImpl);

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
