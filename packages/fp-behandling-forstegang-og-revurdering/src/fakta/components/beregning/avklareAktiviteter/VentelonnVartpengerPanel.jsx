import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { required } from '@fpsak-frontend/utils';
import { Normaltekst } from 'nav-frontend-typografi';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';

export const AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME = 'avklarAktivitetVentelonnVartpenger';

/**
 * VentelonnVartpengerPanel
 *
 * Container komponent.. Inneholder panel for å avklare om aktivitet fra opptjening skal tas med i beregning
 */
export const VentelonnVartpengerPanel = ({
  readOnly,
  isAksjonspunktClosed,
}) => (
  <ElementWrapper>
    <Normaltekst>
      <FormattedMessage id="AvklareAktiviteter.AvklarVentelonnVartpenger" />
    </Normaltekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      name={AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME}
      readOnly={readOnly}
      isEdited={isAksjonspunktClosed}
    >
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
      <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
    </RadioGroupField>
  </ElementWrapper>
);


VentelonnVartpengerPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

// /// TRANSFORM VALUES METHODS ///////

export const erVerdiForVentelonnVartpengerEndret = (values, avklarAktiviteter) => {
  const forrigeVerdi = avklarAktiviteter.ventelonnVartpenger.inkludert;
  return forrigeVerdi !== values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME];
};

export const harVerdiBlittSattTidligere = avklarAktiviteter => (avklarAktiviteter && avklarAktiviteter.ventelonnVartpenger
  && avklarAktiviteter.ventelonnVartpenger.inkludert !== null && avklarAktiviteter.ventelonnVartpenger.inkludert !== undefined);

export const erInkludertverdiForVentelonnVartpengerSatt = values => values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] !== null
&& values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] !== undefined;

const getTransformedValuesVentelonnVartpenger = (values, avklarAktiviteter) => {
  if (erVerdiForVentelonnVartpengerEndret(values, avklarAktiviteter)) {
    return {
      ventelonnVartpenger: {
        inkludert: values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME],
      },
    };
  }
  return null;
};

VentelonnVartpengerPanel.transformValues = (values, avklarAktiviteter) => getTransformedValuesVentelonnVartpenger(values, avklarAktiviteter);

// /// BUILD INITIAL VALUES METHODS ///////

VentelonnVartpengerPanel.buildInitialValues = (avklarAktiviteter) => {
  const initial = {};
  initial[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = avklarAktiviteter.ventelonnVartpenger.inkludert;
  return initial;
};


// DIFF SJEKKER ///
VentelonnVartpengerPanel.hasValueChangedFromInitial = (values, initialValues) => (
  values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] !== initialValues[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME]
);

// /// VALIDATION METHODS ///////

const isNotImplementedMessage = () => ([{ id: 'AvklareAktiviteter.IkkeImplementert' }]);
const shouldNotBeTrue = value => (value ? isNotImplementedMessage() : undefined);
const validateVentelonnVartpenger = (values) => {
  const inkludert = values[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME];
  return required(inkludert) || shouldNotBeTrue(inkludert);
};

VentelonnVartpengerPanel.validate = (values) => {
  const errors = {};
  errors[AVKLAR_AKTIVITETER_VENTELONN_VARTPENGER_FIELDNAME] = validateVentelonnVartpenger(values);
  return errors;
};

export default VentelonnVartpengerPanel;
