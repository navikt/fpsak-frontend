import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import medlemskapAksjonspunkterPropType from '../propTypes/medlemskapAksjonspunkterPropType';
import medlemskapMedlemskaPropType from '../propTypes/medlemskapMedlemskapPropType';
import medlemskapSoknadPropType from '../propTypes/medlemskapSoknadPropType';
import medlemskapInntektArbeidYtelsePropType from '../propTypes/medlemskapInntektArbeidYtelsePropType';
import StartdatoForForeldrepengerperiodenForm from './startdatoForPeriode/StartdatoForForeldrepengerperiodenForm';
import OppholdInntektOgPerioderForm from './oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';

const {
  AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, OVERSTYR_AVKLAR_STARTDATO,
} = aksjonspunktCodes;

const avklarStartdatoAp = [AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, OVERSTYR_AVKLAR_STARTDATO];

const hasOpen = (aksjonspunkt) => (aksjonspunkt && isAksjonspunktOpen(aksjonspunkt.status.kode));

const skalKunneLoseUtenAksjonpunkter = (isForeldrepenger, aksjonspunkterMinusAvklarStartDato, hasOpenAksjonspunkter) => (isForeldrepenger
  && (aksjonspunkterMinusAvklarStartDato.length === 0 || !hasOpenAksjonspunkter));

const harAksjonspunkterForAvklarStartdato = (aksjonspunkter) => aksjonspunkter
  .find((ap) => ap.definisjon.kode === AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN)
|| aksjonspunkter.find((ap) => ap.definisjon.kode === OVERSTYR_AVKLAR_STARTDATO);

const skalViseAvklarStartdatoPanel = (
  aksjonspunkter,
  isForeldrepenger,
  aksjonspunkterMinusAvklarStartDato,
  hasOpenAksjonspunkter,
) => (harAksjonspunkterForAvklarStartdato(aksjonspunkter)
  || skalKunneLoseUtenAksjonpunkter(isForeldrepenger, aksjonspunkterMinusAvklarStartDato, hasOpenAksjonspunkter));

/**
 * MedlemskapInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å vise faktapanelene for medlemskap.
 */
const MedlemskapInfoPanel = ({
  hasOpenAksjonspunkter,
  submittable,
  aksjonspunkter,
  readOnly,
  submitCallback,
  isForeldrepenger,
  alleMerknaderFraBeslutter,
  behandlingId,
  behandlingVersjon,
  behandlingType,
  behandlingStatus,
  soknad,
  inntektArbeidYtelse,
  alleKodeverk,
  medlemskap,
  fagsakPerson,
  behandlingPaaVent,
  readOnlyBehandling,
}) => {
  const avklarStartdatoAksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
  const avklarStartdatoOverstyring = aksjonspunkter.find((ap) => ap.definisjon.kode === OVERSTYR_AVKLAR_STARTDATO);
  const aksjonspunkterMinusAvklarStartDato = useMemo(() => aksjonspunkter
    .filter((ap) => !avklarStartdatoAp.includes(ap.definisjon.kode)), [aksjonspunkter]);

  return (
    <>
      {skalViseAvklarStartdatoPanel(aksjonspunkter, isForeldrepenger, aksjonspunkterMinusAvklarStartDato, hasOpenAksjonspunkter)
        && (
          <>
            <StartdatoForForeldrepengerperiodenForm
              readOnly={readOnly}
              aksjonspunkt={avklarStartdatoAksjonspunkt || avklarStartdatoOverstyring}
              submitCallback={submitCallback}
              submittable={submittable}
              hasOpenMedlemskapAksjonspunkter={hasOpenAksjonspunkter}
              alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              behandlingStatus={behandlingStatus}
              behandlingPaaVent={behandlingPaaVent}
              aksjonspunkter={aksjonspunkter}
              soknad={soknad}
              inntektArbeidYtelse={inntektArbeidYtelse}
              readOnlyBehandling={readOnlyBehandling}
            />
            <VerticalSpacer twentyPx />
          </>
        )}
      { (!hasOpen(avklarStartdatoAksjonspunkt) && !hasOpen(avklarStartdatoOverstyring))
        && (
        <OppholdInntektOgPerioderForm
          soknad={soknad}
          readOnly={readOnly}
          submitCallback={submitCallback}
          submittable={submittable}
          aksjonspunkter={aksjonspunkterMinusAvklarStartDato}
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          behandlingType={behandlingType}
          alleKodeverk={alleKodeverk}
          medlemskap={medlemskap}
          fagsakPerson={fagsakPerson}
        />
        )}
    </>
  );
};

MedlemskapInfoPanel.propTypes = {
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(medlemskapAksjonspunkterPropType.isRequired).isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  isForeldrepenger: PropTypes.bool,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fagsakPerson: PropTypes.shape().isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  behandlingStatus: kodeverkObjektPropType.isRequired,
  soknad: medlemskapSoknadPropType.isRequired,
  inntektArbeidYtelse: medlemskapInntektArbeidYtelsePropType.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  medlemskap: medlemskapMedlemskaPropType.isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  readOnlyBehandling: PropTypes.bool.isRequired,
};

MedlemskapInfoPanel.defaultProps = {
  isForeldrepenger: true,
};

export default MedlemskapInfoPanel;
