import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import withDefaultToggling from 'behandlingFpsak/src/fakta/withDefaultToggling';
import { getFeatureToggles } from 'behandlingFpsak/src/duck';
import {
  FaktaEkspandertpanel, aksjonspunktPropType, faktaPanelCodes,
} from '@fpsak-frontend/fp-behandling-felles';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { featureToggle } from '@fpsak-frontend/fp-felles';
import connect from 'react-redux/es/connect/connect';
import StartdatoForForeldrepengerperiodenForm from './startdatoForPeriode/StartdatoForForeldrepengerperiodenForm';
import OppholdInntektOgPerioderFormNew from './oppholdInntektOgPerioderNew/OppholdInntektOgPerioderForm';
import OppholdInntektOgPerioderForm from './oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';

const {
  AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, AVKLAR_OM_BRUKER_ER_BOSATT, AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD, AVKLAR_FORTSATT_MEDLEMSKAP,
} = aksjonspunktCodes;

/**
 * MedlemskapInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å vise faktapanelene for medlemskap.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export const MedlemskapInfoPanelImpl = ({
  intl,
  hasOpenAksjonspunkter,
  submittable,
  openInfoPanels,
  toggleInfoPanelCallback,
  aksjonspunkter,
  readOnly,
  submitCallback,
  skalBrukeNyeMedlemskap,
}) => {
  const avklarStartdatoAksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
  return (
    <FaktaEkspandertpanel
      title={intl.formatMessage({ id: 'MedlemskapInfoPanel.Medlemskap' })}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.MEDLEMSKAPSVILKARET)}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      faktaId={faktaPanelCodes.MEDLEMSKAPSVILKARET}
      readOnly={readOnly}
    >
      { avklarStartdatoAksjonspunkt
        && (
        <StartdatoForForeldrepengerperiodenForm
          readOnly={readOnly}
          aksjonspunkt={avklarStartdatoAksjonspunkt}
          submitCallback={submitCallback}
          submittable={submittable}
          hasOpenMedlemskapAksjonspunkter={hasOpenAksjonspunkter}
        />
        )
      }

      { (skalBrukeNyeMedlemskap && (!avklarStartdatoAksjonspunkt || !isAksjonspunktOpen(avklarStartdatoAksjonspunkt.status.kode)))
        && (
        <OppholdInntektOgPerioderFormNew
          readOnly={readOnly}
          submitCallback={submitCallback}
          submittable={submittable}
          aksjonspunkter={aksjonspunkter.filter(ap => ap.definisjon.kode !== AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN)}
        />
        )
      }
      { (!skalBrukeNyeMedlemskap && (!avklarStartdatoAksjonspunkt || !isAksjonspunktOpen(avklarStartdatoAksjonspunkt.status.kode)))
      && (
        <OppholdInntektOgPerioderForm
          readOnly={readOnly}
          submitCallback={submitCallback}
          submittable={submittable}
          aksjonspunkter={aksjonspunkter.filter(ap => ap.definisjon.kode !== AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN)}
        />
      )
      }
    </FaktaEkspandertpanel>
  );
};

MedlemskapInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  skalBrukeNyeMedlemskap: PropTypes.bool,
};

MedlemskapInfoPanelImpl.defaultProps = {
  skalBrukeNyeMedlemskap: false,
};

const mapStateToProps = state => ({
  skalBrukeNyeMedlemskap: getFeatureToggles(state)[featureToggle.LØPENDE_MEDLESMKAP],
});

const medlemAksjonspunkter = [AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, AVKLAR_OM_BRUKER_ER_BOSATT, AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD, AVKLAR_FORTSATT_MEDLEMSKAP];

const ConnectedComponent = connect(mapStateToProps)(injectIntl(MedlemskapInfoPanelImpl));

const MedlemskapInfoPanel = withDefaultToggling(faktaPanelCodes.MEDLEMSKAPSVILKARET, medlemAksjonspunkter)(ConnectedComponent);

MedlemskapInfoPanel.supports = personopplysninger => personopplysninger !== null && personopplysninger !== undefined;

export default MedlemskapInfoPanel;
