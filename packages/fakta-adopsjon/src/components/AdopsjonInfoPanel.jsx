import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { createSelector } from 'reselect';

import { kodeverkObjektPropType, aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import {
  faktaPanelCodes, FaktaBegrunnelseTextField, FaktaEkspandertpanel, withDefaultToggling, FaktaSubmitButton, behandlingForm,
  isFieldEdited,
} from '@fpsak-frontend/fp-felles';
import { adopsjonsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';
import { AksjonspunktHelpText, ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import MannAdoptererAleneFaktaForm from './MannAdoptererAleneFaktaForm';
import EktefelleFaktaForm from './EktefelleFaktaForm';
import DokumentasjonFaktaForm from './DokumentasjonFaktaForm';

const { ADOPSJONSDOKUMENTAJON, OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, OM_ADOPSJON_GJELDER_EKTEFELLES_BARN } = aksjonspunktCodes;
const adopsjonAksjonspunkter = [OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, ADOPSJONSDOKUMENTAJON, OM_ADOPSJON_GJELDER_EKTEFELLES_BARN];

const getHelpTexts = (aksjonspunkter) => {
  const helpTexts = [
    <FormattedMessage key="KontrollerMotDok" id="AdopsjonInfoPanel.KontrollerMotDok" />,
  ];

  if (hasAksjonspunkt(OM_ADOPSJON_GJELDER_EKTEFELLES_BARN, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="VurderOmEktefellesBarn" id="AdopsjonInfoPanel.VurderOmEktefellesBarn" />);
  }
  if (hasAksjonspunkt(OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="VurderOmMannAdoptererAlene" id="AdopsjonInfoPanel.VurderOmMannAdoptererAlene" />);
  }
  return helpTexts;
};

/**
 * AdopsjonInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for faktapenelet til Adopsjonsvilkåret.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export const AdopsjonInfoPanelImpl = ({
  intl,
  aksjonspunkter,
  openInfoPanels,
  toggleInfoPanelCallback,
  hasOpenAksjonspunkter,
  submittable,
  readOnly,
  initialValues,
  editedStatus,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  isForeldrepengerFagsak,
  behandlingId,
  behandlingVersjon,
  farSokerType,
  ...formProps
}) => (
  <FaktaEkspandertpanel
    title={intl.formatMessage({ id: 'AdopsjonInfoPanel.Adopsjon' })}
    hasOpenAksjonspunkter={hasOpenAksjonspunkter}
    isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.ADOPSJONSVILKARET)}
    toggleInfoPanelCallback={toggleInfoPanelCallback}
    faktaId={faktaPanelCodes.ADOPSJONSVILKARET}
    readOnly={readOnly}
  >
    <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
      {getHelpTexts(aksjonspunkter)}
    </AksjonspunktHelpText>
    <form onSubmit={formProps.handleSubmit}>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="6">
          <DokumentasjonFaktaForm
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            readOnly={readOnly}
            editedStatus={editedStatus}
            erForeldrepengerFagsak={isForeldrepengerFagsak}
            alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
            hasEktefellesBarnAksjonspunkt={hasAksjonspunkt(
              OM_ADOPSJON_GJELDER_EKTEFELLES_BARN,
              aksjonspunkter,
            )}
          />
        </Column>
        <Column xs="6">
          {hasAksjonspunkt(OM_ADOPSJON_GJELDER_EKTEFELLES_BARN, aksjonspunkter) && (
            <EktefelleFaktaForm
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              readOnly={readOnly}
              alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
              ektefellesBarnIsEdited={editedStatus.ektefellesBarn}
            />
          )}
          {hasAksjonspunkt(OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunkter) && (
            <MannAdoptererAleneFaktaForm
              farSokerType={farSokerType}
              readOnly={readOnly}
              mannAdoptererAlene={editedStatus.mannAdoptererAlene}
              alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
              alleKodeverk={alleKodeverk}
            />
          )}
        </Column>
      </Row>
      {aksjonspunkter && aksjonspunkter.length > 0 && (
      <ElementWrapper>
        <VerticalSpacer twentyPx />
        <FaktaBegrunnelseTextField
          isDirty={formProps.dirty}
          isSubmittable={submittable}
          isReadOnly={readOnly}
          hasBegrunnelse={!!initialValues.begrunnelse}
        />
        <VerticalSpacer twentyPx />
        <FaktaSubmitButton
          formName={formProps.form}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isSubmittable={submittable}
          isReadOnly={readOnly}
          hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        />
      </ElementWrapper>
      )}
    </form>
  </FaktaEkspandertpanel>
);

AdopsjonInfoPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  farSokerType: kodeverkObjektPropType,
  editedStatus: PropTypes.shape({
    mannAdoptererAlene: PropTypes.bool.isRequired,
    ektefellesBarn: PropTypes.bool.isRequired,
    adopsjonFodelsedatoer: PropTypes.shape().isRequired,
    omsorgsovertakelseDato: PropTypes.bool.isRequired,
    barnetsAnkomstTilNorgeDato: PropTypes.bool.isRequired,
  }).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  ...formPropTypes,
};

AdopsjonInfoPanelImpl.defaultProps = {
  farSokerType: undefined,
};

const buildInitialValues = createSelector([
  (ownProps) => ownProps.soknad,
  (ownProps) => ownProps.gjeldendeFamiliehendelse,
  (ownProps) => ownProps.aksjonspunkter], (
  soknad, familiehendelse, allAksjonspunkter,
) => {
  const aksjonspunkter = allAksjonspunkter.filter((ap) => adopsjonAksjonspunkter.includes(ap.definisjon.kode));

  let mannAdoptererAleneValues = {};
  if (hasAksjonspunkt(OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunkter)) {
    mannAdoptererAleneValues = MannAdoptererAleneFaktaForm.buildInitialValues(soknad, familiehendelse);
  }
  let omAdopsjonGjelderEktefellesBarn = {};
  if (hasAksjonspunkt(OM_ADOPSJON_GJELDER_EKTEFELLES_BARN, aksjonspunkter)) {
    omAdopsjonGjelderEktefellesBarn = EktefelleFaktaForm.buildInitialValues(familiehendelse);
  }

  return {
    ...DokumentasjonFaktaForm.buildInitialValues(soknad, familiehendelse),
    ...omAdopsjonGjelderEktefellesBarn,
    ...mannAdoptererAleneValues,
    ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter[0]),
  };
});

const transformValues = (values, aksjonspunkter) => {
  const aksjonspunkterArray = [DokumentasjonFaktaForm.transformValues(values)];
  if (hasAksjonspunkt(OM_ADOPSJON_GJELDER_EKTEFELLES_BARN, aksjonspunkter)) {
    aksjonspunkterArray.push(EktefelleFaktaForm.transformValues(values));
  }
  if (hasAksjonspunkt(OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunkter)) {
    aksjonspunkterArray.push(MannAdoptererAleneFaktaForm.transformValues(values));
  }

  return aksjonspunkterArray.map((ap) => ({
    ...ap,
    begrunnelse: values.begrunnelse,
  }));
};

const getEditedStatus = createSelector(
  [(ownProps) => ownProps.soknad,
    (ownProps) => ownProps.gjeldendeFamiliehendelse,
    (ownProps) => ownProps.personopplysninger],
  (soknad, familiehendelse, personopplysning) => (
    isFieldEdited(soknad || {}, familiehendelse || {}, personopplysning || {})
  ),
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback(transformValues(values, initialOwnProps.aksjonspunkter));
  return (state, ownProps) => ({
    editedStatus: getEditedStatus(ownProps),
    initialValues: buildInitialValues(ownProps),
    farSokerType: ownProps.soknad.farSokerType,
    onSubmit,
  });
};

const AdopsjonInfoPanel = withDefaultToggling(faktaPanelCodes.ADOPSJONSVILKARET, adopsjonAksjonspunkter)(
  connect(mapStateToPropsFactory)(behandlingForm({
    form: 'AdopsjonInfoPanel',
  })(injectIntl(AdopsjonInfoPanelImpl))),
);

AdopsjonInfoPanel.supports = (vilkarCodes, aksjonspunkter) => aksjonspunkter.some((ap) => adopsjonAksjonspunkter.includes(ap.definisjon.kode))
  || vilkarCodes.some((code) => adopsjonsvilkarene.includes(code));

export default AdopsjonInfoPanel;
