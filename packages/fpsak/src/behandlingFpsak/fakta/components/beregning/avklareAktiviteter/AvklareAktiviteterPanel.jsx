import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import FaktaBegrunnelseTextField from 'behandlingFelles/fakta/components/FaktaBegrunnelseTextField';
import { getBehandlingFormValues, getBehandlingFormInitialValues } from 'behandlingFpsak/behandlingForm';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import {
  getAksjonspunkter,
  getAvklarAktiviteter,
} from 'behandlingFpsak/behandlingSelectors';
import { FormSection } from 'redux-form';
import VentelonnVartpengerPanel from './VentelonnVartpengerPanel';

const {
  AVKLAR_AKTIVITETER,
} = aksjonspunktCodes;

export const AVKLAR_AKTIVITETER_FORM_NAME = 'avklarAktiviteter';

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const findAksjonspunktMedBegrunnelse = aksjonspunkter => aksjonspunkter
  .filter(ap => ap.definisjon.kode === AVKLAR_AKTIVITETER && ap.begrunnelse !== null)[0];


export const erAvklartAktivitetEndret = formName => createSelector(
  [getAksjonspunkter, getAvklarAktiviteter, getBehandlingFormValues(formName), getBehandlingFormInitialValues(formName)],
  (aksjonspunkter, avklarAktiviteter, values, initialValues) => {
    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
      return false;
    }
    if (values && avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
      return VentelonnVartpengerPanel.hasValueChangedFromInitial(values[AVKLAR_AKTIVITETER_FORM_NAME], initialValues[AVKLAR_AKTIVITETER_FORM_NAME]);
    }
    return false;
  },
);

export const getHelpTextsAvklarAktiviteter = createSelector(
  [getAksjonspunkter],
  aksjonspunkter => (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
    ? [<FormattedMessage key="VurderFaktaForBeregningen" id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning" />]
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
}) => (
  <FormSection name={AVKLAR_AKTIVITETER_FORM_NAME}>
    {avklarAktiviteter.ventelonnVartpenger
      && (
      <VentelonnVartpengerPanel
        readOnly={readOnly}
        isAksjonspunktClosed={isAksjonspunktClosed}
      />
      )
    }
    <VerticalSpacer eightPx />
    <VerticalSpacer twentyPx />
    <FaktaBegrunnelseTextField
      isDirty={isDirty}
      isSubmittable={submittable}
      isReadOnly={readOnly}
      hasBegrunnelse={hasBegrunnelse}
    />
  </FormSection>
);


AvklareAktiviteterPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  avklarAktiviteter: PropTypes.shape().isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  isDirty: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
};

// /// TRANSFORM VALUES METHODS ///////

export const transformValuesAvklarAktiviteter = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter],
  (aksjonspunkter, avklarAktiviteter) => (values) => {
    if (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
      if (avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
        const avklarValues = values[AVKLAR_AKTIVITETER_FORM_NAME];
        const ventelonnVartpengerTransformed = VentelonnVartpengerPanel.transformValues(avklarValues, avklarAktiviteter);
        if (ventelonnVartpengerTransformed) {
          const beg = avklarValues.begrunnelse;
          return [{
            kode: AVKLAR_AKTIVITETER,
            begrunnelse: beg === undefined ? null : beg,
            ...ventelonnVartpengerTransformed,
          }];
        }
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
    if (avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
      initialValues = VentelonnVartpengerPanel.buildInitialValues(avklarAktiviteter);
    }
    return {
      [AVKLAR_AKTIVITETER_FORM_NAME]: {
        ...initialValues,
        ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter)),
      },
    };
  },
);

// / VALIDATION METHODS ///

export const getValidationAvklarAktiviteter = createSelector([getAksjonspunkter, getAvklarAktiviteter], (aksjonspunkter, avklarAktiviteter) => (values) => {
  if (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
    const errors = {};
    if (avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger) {
      errors[AVKLAR_AKTIVITETER_FORM_NAME] = VentelonnVartpengerPanel.validate(values[AVKLAR_AKTIVITETER_FORM_NAME]);
    }
    return errors;
  }
  return null;
});


// // MAP STATE TO PROPS METHODS //////

const mapStateToProps = (state, ownProps) => {
  const avklarAktiviteter = getAvklarAktiviteter(state);
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp.filter(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_AKTIVITETER);
  const isAksjonspunktClosed = relevantAp.length === 0 ? undefined : !isAksjonspunktOpen(relevantAp[0].status.kode);
  const initialValues = getBehandlingFormInitialValues(ownProps.formName)(state);
  const hasBegrunnelse = initialValues && initialValues[AVKLAR_AKTIVITETER_FORM_NAME]
  && !!initialValues[AVKLAR_AKTIVITETER_FORM_NAME].begrunnelse;
  return {
    isAksjonspunktClosed,
    avklarAktiviteter,
    hasBegrunnelse,
  };
};

export default connect(mapStateToProps)(AvklareAktiviteterPanelImpl);
