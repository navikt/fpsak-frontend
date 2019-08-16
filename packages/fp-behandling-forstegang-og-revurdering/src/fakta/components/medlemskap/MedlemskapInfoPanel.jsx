import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';

import { getFeatureToggles, isForeldrepengerFagsak } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { FaktaEkspandertpanel, withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { featureToggle, faktaPanelCodes } from '@fpsak-frontend/fp-felles';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import connect from 'react-redux/es/connect/connect';
import StartdatoForForeldrepengerperiodenForm from './startdatoForPeriode/StartdatoForForeldrepengerperiodenForm';
import OppholdInntektOgPerioderFormNew from './oppholdInntektOgPerioderNew/OppholdInntektOgPerioderForm';
import OppholdInntektOgPerioderForm from './oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';

const {
  AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, AVKLAR_OM_BRUKER_ER_BOSATT, AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD, AVKLAR_FORTSATT_MEDLEMSKAP, OVERSTYR_AVKLAR_STARTDATO,
} = aksjonspunktCodes;

const avklarStartdatoAp = [AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, OVERSTYR_AVKLAR_STARTDATO];

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
  aksjonspunkterMinusAvklarStartDato,
  readOnly,
  submitCallback,
  skalBrukeNyeMedlemskap,
  isForeldrepenger,
}) => {
  const avklarStartdatoAksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
  const avklarStartdatoOverstyring = aksjonspunkter.find(ap => ap.definisjon.kode === OVERSTYR_AVKLAR_STARTDATO);
  return (
    <FaktaEkspandertpanel
      title={intl.formatMessage({ id: 'MedlemskapInfoPanel.Medlemskap' })}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.MEDLEMSKAPSVILKARET)}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      faktaId={faktaPanelCodes.MEDLEMSKAPSVILKARET}
      readOnly={readOnly}
    >
      { (avklarStartdatoAksjonspunkt || (isForeldrepenger && (aksjonspunkterMinusAvklarStartDato.length === 0 || !hasOpenAksjonspunkter)))
        && (
        <StartdatoForForeldrepengerperiodenForm
          readOnly={readOnly}
          aksjonspunkt={avklarStartdatoAksjonspunkt || avklarStartdatoOverstyring}
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
          aksjonspunkter={aksjonspunkterMinusAvklarStartDato}
        />
        )
      }
      { (!skalBrukeNyeMedlemskap && (!avklarStartdatoAksjonspunkt || !isAksjonspunktOpen(avklarStartdatoAksjonspunkt.status.kode)))
      && (
        <OppholdInntektOgPerioderForm
          readOnly={readOnly}
          submitCallback={submitCallback}
          submittable={submittable}
          aksjonspunkter={aksjonspunkterMinusAvklarStartDato}
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
  aksjonspunkterMinusAvklarStartDato: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  skalBrukeNyeMedlemskap: PropTypes.bool,
  isForeldrepenger: PropTypes.bool,
};

MedlemskapInfoPanelImpl.defaultProps = {
  skalBrukeNyeMedlemskap: false,
  isForeldrepenger: true,
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunkterMinusAvklarStartDato = ownProps.aksjonspunkter.filter(ap => !avklarStartdatoAp.includes(ap.definisjon.kode));
  return state => ({
    skalBrukeNyeMedlemskap: getFeatureToggles(state)[featureToggle.LØPENDE_MEDLESMKAP],
    isForeldrepenger: isForeldrepengerFagsak(state),
    aksjonspunkterMinusAvklarStartDato,
  });
};

const medlemAksjonspunkter = [AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, AVKLAR_OM_BRUKER_ER_BOSATT, AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD, AVKLAR_FORTSATT_MEDLEMSKAP, OVERSTYR_AVKLAR_STARTDATO];

const ConnectedComponent = connect(mapStateToPropsFactory)(injectIntl(MedlemskapInfoPanelImpl));

const MedlemskapInfoPanel = withDefaultToggling(faktaPanelCodes.MEDLEMSKAPSVILKARET, medlemAksjonspunkter)(ConnectedComponent);

MedlemskapInfoPanel.supports = personopplysninger => personopplysninger !== null && personopplysninger !== undefined;

export default MedlemskapInfoPanel;
