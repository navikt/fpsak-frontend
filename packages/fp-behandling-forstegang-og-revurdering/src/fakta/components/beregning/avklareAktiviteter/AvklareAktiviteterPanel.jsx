import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer, BorderBox, AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  getAksjonspunkter,
  getAvklarAktiviteter,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { getFormValuesForBeregning, getFormInitialValuesForBeregning } from '../BeregningFormUtils';
import VurderAktiviteterPanel from './VurderAktiviteterPanel';

const {
  AVKLAR_AKTIVITETER,
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

export const BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME = 'begrunnelseAvklareAktiviteter';


const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const findAksjonspunktMedBegrunnelse = aksjonspunkter => aksjonspunkter
  .filter(ap => ap.definisjon.kode === AVKLAR_AKTIVITETER && ap.begrunnelse !== null)[0];


export const erAvklartAktivitetEndret = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter, getFormValuesForBeregning, getFormInitialValuesForBeregning],
  (aksjonspunkter, avklarAktiviteter, values, initialValues) => {
    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
      return false;
    }
    let harEndring = false;
    if (values && avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping) {
      harEndring = VurderAktiviteterPanel.hasValueChangedFromInitial(avklarAktiviteter.aktiviteterTomDatoMapping, values, initialValues);
    }
    if (values && !harEndring) {
      harEndring = initialValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] !== values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
    }
    return harEndring;
  },
);

export const getHelpTextsAvklarAktiviteter = createSelector(
  [getAksjonspunkter],
  aksjonspunkter => (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
    ? [<FormattedMessage key="VurderFaktaForBeregningen" id="BeregningInfoPanel.AksjonspunktHelpText.VurderAktiviteter" />]
    : []),
);

/**
 * AvklareAktiviteterPanel
 *
 * Container komponent.. Inneholder panel for å avklare om aktivitet fra opptjening skal tas med i beregning
 */
export const AvklareAktiviteterPanelImpl = ({
  readOnly,
  avklarAktiviteter,
  isAksjonspunktClosed,
  submittable,
  hasBegrunnelse,
  isDirty,
  submitEnabled,
  formName,
  helpText,
  harAndreAksjonspunkterIPanel,
  erEndret,
}) => (
  <React.Fragment>
    <AksjonspunktHelpText isAksjonspunktOpen={!isAksjonspunktClosed}>{helpText}</AksjonspunktHelpText>
    <VerticalSpacer twentyPx />
    <BorderBox>
      {avklarAktiviteter.aktiviteterTomDatoMapping
        && (
        <VurderAktiviteterPanel
          aktiviteterTomDatoMapping={avklarAktiviteter.aktiviteterTomDatoMapping}
          readOnly={readOnly}
          isAksjonspunktClosed={isAksjonspunktClosed}
        />
        )
      }
      <VerticalSpacer twentyPx />
      <FaktaBegrunnelseTextField
        name={BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME}
        isDirty={isDirty}
        isSubmittable={submittable}
        isReadOnly={readOnly}
        hasBegrunnelse={hasBegrunnelse}
      />
      {harAndreAksjonspunkterIPanel
          && (
          <FaktaSubmitButton
            buttonTextId="AvklarAktivitetPanel.ButtonText"
            formName={formName}
            isSubmittable={submittable && submitEnabled && erEndret}
            isReadOnly={readOnly}
            hasOpenAksjonspunkter={!isAksjonspunktClosed}
          />
         )
      }
    </BorderBox>
    {harAndreAksjonspunkterIPanel
      && <VerticalSpacer twentyPx />
    }
  </React.Fragment>
);


AvklareAktiviteterPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  avklarAktiviteter: PropTypes.shape().isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  submitEnabled: PropTypes.bool.isRequired,
  harAndreAksjonspunkterIPanel: PropTypes.bool.isRequired,
  helpText: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  formName: PropTypes.string.isRequired,
  erEndret: PropTypes.bool.isRequired,
};

// /// TRANSFORM VALUES METHODS ///////

export const transformValuesAvklarAktiviteter = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter, erAvklartAktivitetEndret],
  (aksjonspunkter, avklarAktiviteter, endret) => (values) => {
    if (endret || (!hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter) && hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter))) {
      if (avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping) {
        const vurderAktiviteterTransformed = VurderAktiviteterPanel.transformValues(values, avklarAktiviteter.aktiviteterTomDatoMapping);
        const beg = values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
        return [{
          kode: AVKLAR_AKTIVITETER,
          begrunnelse: beg === undefined ? null : beg,
          ...vurderAktiviteterTransformed,
        }];
      }
    }
    return null;
  },
);

// /// BUILD INITIAL VALUES METHODS ///////

export const buildInitialValuesAvklarAktiviteter = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter],
  (aksjonspunkter, avklarAktiviteter) => {
    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
      return {};
    }
    let initialValues = {};
    if (avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping) {
      initialValues = VurderAktiviteterPanel.buildInitialValues(avklarAktiviteter.aktiviteterTomDatoMapping);
    }
    return {
      ...initialValues,
      ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter), BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME),
    };
  },
);


// // MAP STATE TO PROPS METHODS //////

const mapStateToProps = (state) => {
  const avklarAktiviteter = getAvklarAktiviteter(state);
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp.filter(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_AKTIVITETER);
  const isAksjonspunktClosed = relevantAp.length === 0 ? undefined : !isAksjonspunktOpen(relevantAp[0].status.kode);
  const initialValues = getFormInitialValuesForBeregning(state);
  const values = getFormValuesForBeregning(state);
  const hasBegrunnelse = initialValues
  && !!initialValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
  return {
    values,
    isAksjonspunktClosed,
    avklarAktiviteter,
    hasBegrunnelse,
    erEndret: erAvklartAktivitetEndret(state),
    helpText: getHelpTextsAvklarAktiviteter(state),
  };
};

export default connect(mapStateToProps)(AvklareAktiviteterPanelImpl);
