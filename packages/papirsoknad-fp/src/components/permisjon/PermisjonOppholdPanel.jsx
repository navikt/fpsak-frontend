import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { FieldArray, formValueSelector } from 'redux-form';
import { Element } from 'nav-frontend-typografi';

import { CheckboxField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import { hasValidPeriodIncludingOtherErrors, isRequiredMessage, required } from '@fpsak-frontend/utils';

import RenderOppholdPeriodeFieldArray from './RenderOppholdPeriodeFieldArray';

export const oppholdPeriodeFieldArrayName = 'oppholdPerioder';

/**
 *  PermisjonOppholdPanel
 *
 * Presentasjonskomponent: Viser panel for utsettelse
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */
export const PermisjonOppholdPanel = ({
  oppholdsReasons,
  skalHaOpphold,
  readOnly,
}) => (
  <div>
    <Element><FormattedMessage id="Registrering.Permisjon.Opphold.Title" /></Element>
    <VerticalSpacer sixteenPx />
    <CheckboxField
      readOnly={readOnly}
      name="skalHaOpphold"
      label={<FormattedMessage id="Registrering.Permisjon.Opphold.OppholdUttaket" />}
    />
    { skalHaOpphold
    && (
      <FieldArray
        name={oppholdPeriodeFieldArrayName}
        component={RenderOppholdPeriodeFieldArray}
        oppholdsReasons={oppholdsReasons}
        readOnly={readOnly}
      />
    )}
  </div>
);


PermisjonOppholdPanel.validate = (values) => {
  if (!values || !values.length) {
    return { _error: isRequiredMessage() };
  }
  const otherErrors = values.map(({
    årsak,
  }) => {
    const aarsakError = required(årsak);
    if (aarsakError) {
      return {
        årsak: aarsakError,
      };
    }
    return null;
  });

  return hasValidPeriodIncludingOtherErrors(values, otherErrors);
};

PermisjonOppholdPanel.propTypes = {
  oppholdsReasons: kodeverkPropType.isRequired,
  skalHaOpphold: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

PermisjonOppholdPanel.initialValues = {
  [oppholdPeriodeFieldArrayName]: [{}],
  skalHaOpphold: false,
};

const mapStateToProps = (state, ownProps) => ({
  oppholdsReasons: ownProps.alleKodeverk[kodeverkTyper.OPPHOLD_ARSAK],
  skalHaOpphold: formValueSelector(ownProps.form)(state, ownProps.namePrefix).skalHaOpphold,
});

export default connect(mapStateToProps)(PermisjonOppholdPanel);
