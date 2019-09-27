import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { isForeldrepengerFagsak } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import {
  faktaPanelCodes, FaktaEkspandertpanel, withDefaultToggling,
} from '@fpsak-frontend/fp-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import StartdatoForForeldrepengerperiodenForm from './startdatoForPeriode/StartdatoForForeldrepengerperiodenForm';
import OppholdInntektOgPerioderForm from './oppholdInntektOgPerioder/OppholdInntektOgPerioderForm';

const {
  AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, AVKLAR_OM_BRUKER_ER_BOSATT, AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD, AVKLAR_FORTSATT_MEDLEMSKAP, OVERSTYR_AVKLAR_STARTDATO,
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
  isForeldrepenger,
}) => {
  const avklarStartdatoAksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
  const avklarStartdatoOverstyring = aksjonspunkter.find((ap) => ap.definisjon.kode === OVERSTYR_AVKLAR_STARTDATO);
  return (
    <FaktaEkspandertpanel
      title={intl.formatMessage({ id: 'MedlemskapInfoPanel.Medlemskap' })}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.MEDLEMSKAPSVILKARET)}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      faktaId={faktaPanelCodes.MEDLEMSKAPSVILKARET}
      readOnly={readOnly}
    >
      {skalViseAvklarStartdatoPanel(aksjonspunkter, isForeldrepenger, aksjonspunkterMinusAvklarStartDato, hasOpenAksjonspunkter)
        && (
        <>
          <StartdatoForForeldrepengerperiodenForm
            readOnly={readOnly}
            aksjonspunkt={avklarStartdatoAksjonspunkt || avklarStartdatoOverstyring}
            submitCallback={submitCallback}
            submittable={submittable}
            hasOpenMedlemskapAksjonspunkter={hasOpenAksjonspunkter}
          />
          <VerticalSpacer twentyPx />
        </>
        )}
      { (!hasOpen(avklarStartdatoAksjonspunkt) && !hasOpen(avklarStartdatoOverstyring))
        && (
        <OppholdInntektOgPerioderForm
          readOnly={readOnly}
          submitCallback={submitCallback}
          submittable={submittable}
          aksjonspunkter={aksjonspunkterMinusAvklarStartDato}
        />
        )}
    </FaktaEkspandertpanel>
  );
};

MedlemskapInfoPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
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
  isForeldrepenger: PropTypes.bool,
};

MedlemskapInfoPanelImpl.defaultProps = {
  isForeldrepenger: true,
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunkterMinusAvklarStartDato = ownProps.aksjonspunkter.filter((ap) => !avklarStartdatoAp.includes(ap.definisjon.kode));
  return (state) => ({
    isForeldrepenger: isForeldrepengerFagsak(state),
    aksjonspunkterMinusAvklarStartDato,
  });
};

const medlemAksjonspunkter = [AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, AVKLAR_OM_BRUKER_ER_BOSATT, AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD, AVKLAR_FORTSATT_MEDLEMSKAP, OVERSTYR_AVKLAR_STARTDATO];

const ConnectedComponent = connect(mapStateToPropsFactory)(injectIntl(MedlemskapInfoPanelImpl));

const MedlemskapInfoPanel = withDefaultToggling(faktaPanelCodes.MEDLEMSKAPSVILKARET, medlemAksjonspunkter)(ConnectedComponent);

const isNotNullOrUndefined = (object) => object !== null && object !== undefined;

MedlemskapInfoPanel.supports = (personopplysninger, soknad) => isNotNullOrUndefined(personopplysninger) && isNotNullOrUndefined(soknad);

export default MedlemskapInfoPanel;
