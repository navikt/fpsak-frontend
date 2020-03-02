import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes, { isBeregningAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aktivitetStatus, {
  isStatusArbeidstakerOrKombinasjon,
  isStatusDagpengerOrAAP,
  isStatusFrilanserOrKombinasjon,
  isStatusKombinasjon,
  isStatusMilitaer,
  isStatusSNOrKombinasjon,
  isStatusTilstotendeYtelse,
} from '@fpsak-frontend/kodeverk/src/aktivitetStatus';

import BeregningForm2 from './beregningForm/BeregningForm';
import GraderingUtenBG2 from './gradering/GraderingUtenBG';
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
  isAAP: bg.aktivitetStatus.some(({ kode }) => kode === aktivitetStatus.ARBEIDSAVKLARINGSPENGER),
  isDagpenger: bg.aktivitetStatus.some(({ kode }) => kode === aktivitetStatus.DAGPENGER),
  skalViseBeregningsgrunnlag: bg.aktivitetStatus && bg.aktivitetStatus.length > 0,
  isKombinasjonsstatus: bg.aktivitetStatus.some(({ kode }) => isStatusKombinasjon(kode)) || bg.aktivitetStatus.length > 1,
  isMilitaer: bg.aktivitetStatus.some(({ kode }) => isStatusMilitaer(kode)),
}) : null);

const getBGVilkar = (vilkar) => (vilkar ? vilkar.find((v) => v.vilkarType && v.vilkarType.kode === vilkarType.BEREGNINGSGRUNNLAGVILKARET) : undefined);


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
  const vilkaarBG = getBGVilkar(vilkar);
  const sokerHarGraderingPaaAndelUtenBG = getAksjonspunktForGraderingPaaAndelUtenBG(aksjonspunkter);
  return (
    <>
      <BeregningForm2
        readOnly={readOnly}
        beregningsgrunnlag={beregningsgrunnlag}
        gjeldendeAksjonspunkter={gjeldendeAksjonspunkter}
        relevanteStatuser={relevanteStatuser}
        submitCallback={submitCallback}
        readOnlySubmitButton={readOnlySubmitButton}
        alleKodeverk={alleKodeverk}
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        vilkaarBG={vilkaarBG}
      />

      {sokerHarGraderingPaaAndelUtenBG
          && (
          <GraderingUtenBG2
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
