import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes, { isBeregningAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
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
import beregningsgrunnlagBehandlingPropType from '../propTypes/beregningsgrunnlagBehandlingPropType';
import beregningsgrunnlagPropType from '../propTypes/beregningsgrunnlagPropType';
import beregningsgrunnlagAksjonspunkterPropType from '../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import beregningsgrunnlagVilkarPropType from '../propTypes/beregningsgrunnlagVilkarPropType';

const visningForManglendeBG = () => (
  <>
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
  </>
);

const getAksjonspunkterForBeregning = (aksjonspunkter) => (aksjonspunkter ? aksjonspunkter.filter((ap) => isBeregningAksjonspunkt(ap.definisjon.kode)) : []);

const getRelevanteStatuser = (bg) => (bg.aktivitetStatus ? ({
  isArbeidstaker: bg.aktivitetStatus.some(({ kode }) => isStatusArbeidstakerOrKombinasjon(kode)),
  isFrilanser: bg.aktivitetStatus.some(({ kode }) => isStatusFrilanserOrKombinasjon(kode)),
  isSelvstendigNaeringsdrivende: bg.aktivitetStatus.some(({ kode }) => isStatusSNOrKombinasjon(kode)),
  harAndreTilstotendeYtelser: bg.aktivitetStatus.some(({ kode }) => isStatusTilstotendeYtelse(kode)),
  harDagpengerEllerAAP: bg.aktivitetStatus.some(({ kode }) => isStatusDagpengerOrAAP(kode)),
  skalViseBeregningsgrunnlag: bg.aktivitetStatus && bg.aktivitetStatus.length > 0,
  isKombinasjonsstatus: bg.aktivitetStatus.some(({ kode }) => isStatusKombinasjon(kode)) || bg.aktivitetStatus.length > 1,
  isMilitaer: bg.aktivitetStatus.some(({ kode }) => isStatusMilitaer(kode)),
}) : null);

const getBGVilkar = (vilkar) => (vilkar ? vilkar.find((v) => v.vilkarType && v.vilkarType.kode === vilkarType.BEREGNINGSGRUNNLAGVILKARET) : undefined);

const getErBgVilkarOppfylt = (vilkar) => {
  const bgVilkar = getBGVilkar(vilkar);
  return bgVilkar ? bgVilkar.vilkarStatus.kode === vilkarUtfallType.OPPFYLT : false;
};

const dagsatsErSatt = (beregningsperioder) => {
  if (!beregningsperioder) {
    return false;
  }
  return beregningsperioder.some((p) => p.dagsats !== undefined && p.dagsats !== null);
};

const vilkarErAvslaatt = (vilkar) => vilkar && vilkar.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT;

const getErBeregningFastsatt = (vilkar, bg) => dagsatsErSatt(bg.beregningsgrunnlagPeriode) || vilkarErAvslaatt(getBGVilkar(vilkar));

const getAksjonspunktForGraderingPaaAndelUtenBG = (aksjonspunkter) => (aksjonspunkter
  ? aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.VURDER_GRADERING_UTEN_BEREGNINGSGRUNNLAG)
  : undefined);

/**
 * BeregningFP
 *
 * Presentasjonskomponent. Holder på alle komponenter relatert til beregning av foreldrepenger.
 * Finner det gjeldende aksjonspunktet hvis vi har et.
 */
const BeregningFP = ({
  behandling,
  beregningsgrunnlag,
  aksjonspunkter,
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  vilkar,
  alleKodeverk,
}) => {
  if (!beregningsgrunnlag) {
    return visningForManglendeBG();
  }
  const gjeldendeAksjonspunkter = getAksjonspunkterForBeregning(aksjonspunkter);
  const relevanteStatuser = getRelevanteStatuser(beregningsgrunnlag);
  const isVilkarOppfylt = getErBgVilkarOppfylt(vilkar);
  const beregningErFastsatt = getErBeregningFastsatt(vilkar, beregningsgrunnlag);
  const sokerHarGraderingPaaAndelUtenBG = getAksjonspunktForGraderingPaaAndelUtenBG(aksjonspunkter);
  return (
    <>
      <BeregningForm
        readOnly={readOnly}
        beregningsgrunnlag={beregningsgrunnlag}
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        relevanteStatuser={relevanteStatuser}
        submitCallback={submitCallback}
        readOnlySubmitButton={readOnlySubmitButton}
        alleKodeverk={alleKodeverk}
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
      />
      { beregningErFastsatt
        && (
          <BeregningsresultatTable
            halvGVerdi={beregningsgrunnlag.halvG}
            beregningsgrunnlagPerioder={beregningsgrunnlag.beregningsgrunnlagPeriode}
            ledetekstBrutto={beregningsgrunnlag.ledetekstBrutto}
            ledetekstAvkortet={beregningsgrunnlag.ledetekstAvkortet}
            ledetekstRedusert={beregningsgrunnlag.ledetekstRedusert}
            isVilkarOppfylt={isVilkarOppfylt}
          />
        )}
      {sokerHarGraderingPaaAndelUtenBG
          && (
          <GraderingUtenBG
            submitCallback={submitCallback}
            readOnly={readOnly}
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            aksjonspunkter={aksjonspunkter}
            andelerMedGraderingUtenBG={beregningsgrunnlag.andelerMedGraderingUtenBG}
            alleKodeverk={alleKodeverk}
            venteaarsakKode={behandling.venteArsakKode}
          />
          )}
    </>
  );
};

BeregningFP.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  beregningsgrunnlag: beregningsgrunnlagPropType,
  vilkar: PropTypes.arrayOf(beregningsgrunnlagVilkarPropType).isRequired,
  behandling: beregningsgrunnlagBehandlingPropType,
};

BeregningFP.defaultProps = {
  beregningsgrunnlag: undefined,
};

export default BeregningFP;
