import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';

import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import FadingPanel from '@fpsak-frontend/shared-components/FadingPanel';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import {
  getBeregningsgrunnlag, getAktivitetStatuser, getAlleAndelerIForstePeriode, getGjeldendeBeregningAksjonspunkt,
} from 'behandling/behandlingSelectors';
import beregningsgrunnlagPropType from 'behandling/proptypes/beregningsgrunnlagPropType';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import { getSelectedBehandlingspunktVilkar } from 'behandlingsprosess/behandlingsprosessSelectors';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/aksjonspunktCodes';
import AksjonspunktHelpText from '@fpsak-frontend/shared-components/AksjonspunktHelpText';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/aksjonspunktStatus';
import aktivitetStatus, {
  isStatusFrilanserOrKombinasjon, isStatusArbeidstakerOrKombinasjon,
  isStatusSNOrKombinasjon, isStatusKombinasjon, isStatusDagpengerOrAAP,
  isStatusTilstotendeYtelse,
} from '@fpsak-frontend/kodeverk/aktivitetStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/vilkarUtfallType';
import InntektsopplysningerPanel from './fellesPaneler/InntektsopplysningerPanel';
import SkjeringspunktOgStatusPanel from './fellesPaneler/SkjeringspunktOgStatusPanel';
import BeregningsgrunnlagForm from './beregningsgrunnlagPanel/BeregningsgrunnlagForm';
import BeregningsresultatTable from './beregningsresultatPanel/BeregningsresultatTable';

const {
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
} = aksjonspunktCodes;


const showBeregningsgrunnlagPanel = relevanteStatuser => relevanteStatuser.isArbeidstaker
  || relevanteStatuser.isFrilanser || relevanteStatuser.isSelvstendigNaeringsdrivende || relevanteStatuser.harAndreTilstotendeYtelser;

const findAksjonspunktHelpTekst = (gjeldendeAksjonspunkt) => {
  switch (gjeldendeAksjonspunkt.definisjon.kode) {
    case FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS:
      return 'Beregningsgrunnlag.Helptext.Arbeidstaker';
    case VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE:
      return 'Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende';
    case FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD:
      return 'Beregningsgrunnlag.Helptext.TidsbegrensetArbeidsforhold';
    case FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET:
      return 'Beregningsgrunnlag.Helptext.NyIArbeidslivetSN';
    default:
      return '';
  }
};


const findSammenligningsgrunnlagTekst = (relevanteStatuser) => {
  const tekster = [];
  if (relevanteStatuser.isSelvstendigNaeringsdrivende) {
    tekster.push('Beregningsgrunnlag.Inntektsopplysninger.InntektSoknad');
  } else {
    tekster.push('Beregningsgrunnlag.Inntektsopplysninger.Sammenligningsgrunnlag');
    tekster.push('Beregningsgrunnlag.Inntektsopplysninger.Sum12Mnd');
  }
  return tekster;
};

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
  gjeldendeAksjonspunkt,
  relevanteStatuser,
  readOnlySubmitButton,
}) => {
  let avvikProsent;
  if (beregnetAvvikPromille !== undefined && beregnetAvvikPromille !== null) {
    avvikProsent = beregnetAvvikPromille / 10;
  }
  return (
    <FadingPanel>
      <Undertittel>
        <FormattedMessage id="Beregningsgrunnlag.Title" />
      </Undertittel>
      <VerticalSpacer eightPx />
      { gjeldendeAksjonspunkt
      && (
      <ElementWrapper>
        <AksjonspunktHelpText isAksjonspunktOpen={isAksjonspunktOpen(gjeldendeAksjonspunkt.status.kode)}>
          {[<FormattedMessage key="berGr" id={findAksjonspunktHelpTekst(gjeldendeAksjonspunkt)} values={{ verdi: avvikProsent }} />]}
        </AksjonspunktHelpText>
        <VerticalSpacer eightPx />
      </ElementWrapper>
      )
      }
      <Row>
        <Column xs="6">
          <InntektsopplysningerPanel
            beregnetAarsinntekt={beregnetAarsinntekt}
            sammenligningsgrunnlag={sammenligningsgrunnlag}
            sammenligningsgrunnlagTekst={findSammenligningsgrunnlagTekst(relevanteStatuser)}
            avvik={avvikProsent}
          />
        </Column>
        <Column xs="6">
          <SkjeringspunktOgStatusPanel />
        </Column>
      </Row>
      { showBeregningsgrunnlagPanel(relevanteStatuser)
      && (
      <BeregningsgrunnlagForm
        relevanteStatuser={relevanteStatuser}
        readOnly={readOnly}
        submitCallback={submitCallback}
        gjeldendeAksjonspunkt={gjeldendeAksjonspunkt}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
      }
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
  gjeldendeAksjonspunkt: aksjonspunktPropType,
  gjeldendeVilkar: PropTypes.shape(),
  relevanteStatuser: PropTypes.shape().isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
};

BeregningFPImpl.defaultProps = {
  berGr: undefined,
  beregnetAarsinntekt: undefined,
  gjeldendeVilkar: undefined,
  sammenligningsgrunnlag: undefined,
  beregnetAvvikPromille: undefined,
  gjeldendeAksjonspunkt: undefined,
};

const bestemGjeldendeStatuser = createSelector([getAktivitetStatuser], (aktivitetStatuser) => {
  let isArbeidstaker = false;
  let isFrilanser = false;
  let isSelvstendigNaeringsdrivende = false;
  let isKombinasjonsstatus = false;
  let harDagpengerEllerAAP = false;
  let harAndreTilstotendeYtelser = false;
  const aktivitetStatusCodes = aktivitetStatuser ? aktivitetStatuser.map(status => status.kode) : [];
  aktivitetStatusCodes.forEach((status) => {
    if (isStatusArbeidstakerOrKombinasjon(status)) {
      isArbeidstaker = true;
    }
    if (isStatusFrilanserOrKombinasjon(status)) {
      isFrilanser = true;
    }
    if (isStatusSNOrKombinasjon(status)) {
      isSelvstendigNaeringsdrivende = true;
    }
    if (isStatusDagpengerOrAAP(status)) {
      harDagpengerEllerAAP = true;
    }
    if (isStatusTilstotendeYtelse(status)) {
      harAndreTilstotendeYtelser = true;
    }
    if (isStatusKombinasjon(status)) {
      isKombinasjonsstatus = true;
    }
  });
  if (aktivitetStatusCodes.length > 1) {
    isKombinasjonsstatus = true;
  }
  return {
    isArbeidstaker,
    isFrilanser,
    isSelvstendigNaeringsdrivende,
    isKombinasjonsstatus,
    harAndreTilstotendeYtelser,
    harDagpengerEllerAAP,
  };
});

const getBeregnetAarsinntekt = createSelector(
  [getBeregningsgrunnlag, bestemGjeldendeStatuser, getAlleAndelerIForstePeriode],
  (beregningsgrunnlag, relevanteStatuser, alleAndelerIForstePeriode) => {
    if (relevanteStatuser.harAndreTilstotendeYtelser) {
      return beregningsgrunnlag.beregningsgrunnlagPeriode[0].bruttoPrAar;
    }
    if (relevanteStatuser.isSelvstendigNaeringsdrivende) {
      const snAndel = alleAndelerIForstePeriode.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE)[0];
      return snAndel.erNyIArbeidslivet ? undefined : snAndel.pgiSnitt;
    }
    return beregningsgrunnlag.beregningsgrunnlagPeriode[0].beregnetPrAar;
  },
);

const buildProps = createSelector(
  [getBeregningsgrunnlag, getSelectedBehandlingspunktVilkar, bestemGjeldendeStatuser,
    getGjeldendeBeregningAksjonspunkt, getBeregnetAarsinntekt],
  (berGr, gjeldendeVilkar, relevanteStatuser, gjeldendeAksjonspunkt, beregnetAarsinntekt) => {
    const sammenligningsgrunnlag = berGr.sammenligningsgrunnlag ? berGr.sammenligningsgrunnlag.rapportertPrAar : undefined;
    const beregnetAvvikPromille = berGr.sammenligningsgrunnlag ? berGr.sammenligningsgrunnlag.avvikPromille : undefined;

    return {
      gjeldendeVilkar: gjeldendeVilkar.length > 0 ? gjeldendeVilkar[0] : undefined,
      gjeldendeAksjonspunkt,
      berGr,
      beregnetAarsinntekt,
      sammenligningsgrunnlag,
      beregnetAvvikPromille,
      relevanteStatuser,
    };
  },
);

const mapStateToProps = state => ({
  ...buildProps(state),
});

const BeregningFP = connect(mapStateToProps)(injectIntl(BeregningFPImpl));

BeregningFP.supports = bp => bp === behandlingspunktCodes.BEREGNINGSGRUNNLAG;

export default BeregningFP;
