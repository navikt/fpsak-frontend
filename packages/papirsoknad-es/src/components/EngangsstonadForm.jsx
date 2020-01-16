import React, { Component } from 'react';
import { formPropTypes, formValueSelector, reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { isEqual, omit } from '@fpsak-frontend/utils';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';
import {
  SoknadData, MottattDatoPanel, LagreSoknadPanel, rettighet, getRegisteredFields,
} from '@fpsak-frontend/papirsoknad-felles';

import RegistreringAdopsjonOgOmsorgGrid from './RegistreringAdopsjonOgOmsorgGrid';
import RegistreringFodselGrid from './RegistreringFodselGrid';

export const ENGANGSSTONAD_FORM_NAME = 'EngangsstonadForm';

const buildInitialValues = (soknadData) => {
  if (soknadData.getFamilieHendelseType() === familieHendelseType.FODSEL) {
    return { ...RegistreringFodselGrid.initialValues };
  }
  if (soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON) {
    return { ...RegistreringAdopsjonOgOmsorgGrid.initialValues };
  }
  return {};
};

/**
 * EngangsstonadForm
 *
 * Redux-form-komponent for registrering av papirsøknad for engangsstønad.
 */
export class EngangsstonadForm extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { soknadData } = this.props;
    if (!isEqual(soknadData, nextProps.soknadData)) {
      nextProps.initialize(buildInitialValues(nextProps.soknadData));
    }
  }

  shouldComponentUpdate(nextProps) {
    // Dette er gjort for å hindra rerender for testetrykk på alle underformene
    const notRerenderIfChangedProps = ['array', 'blur', 'change', 'clearSubmit', 'destroy', 'dirty', 'initialize', 'error', 'pristine', 'reset',
      'resetSection', 'touch', 'untouch', 'valuesForRegisteredFieldsOnly', 'autofill', 'clearFields', 'clearSubmitErrors', 'clearAsyncError', 'submit'];
    const changedPropsList = Object.entries(this.props)
      .filter(([key, val]) => nextProps[key] !== val)
      .map(([key]) => key);
    return changedPropsList.some((changedProp) => !notRerenderIfChangedProps.includes(changedProp));
  }

  render() {
    const {
      handleSubmit, form, readOnly, soknadData, onSubmitUfullstendigsoknad, submitting, alleKodeverk,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <MottattDatoPanel readOnly={readOnly} />
        {soknadData.getFamilieHendelseType() === familieHendelseType.FODSEL
          && (
          <RegistreringFodselGrid
            soknadData={soknadData}
            onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
            readOnly={readOnly}
            form={form}
            alleKodeverk={alleKodeverk}
          />
          )}
        {(soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON)
          && (
            <RegistreringAdopsjonOgOmsorgGrid
              soknadData={soknadData}
              onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
              readOnly={readOnly}
              form={form}
              alleKodeverk={alleKodeverk}
            />
          )}
        <LagreSoknadPanel readOnly={readOnly} submitting={submitting} form={form} onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad} />
      </form>
    );
  }
}

EngangsstonadForm.propTypes = {
  ...formPropTypes,
  /** Egen submit-handler som brukes dersom det indikeres at søknaden er ufullstendig */
  onSubmitUfullstendigsoknad: PropTypes.func.isRequired,
  /** Skjemaverdier hentet fra reduxForm */
  readOnly: PropTypes.bool,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

EngangsstonadForm.defaultProps = {
  readOnly: true,
};

const getValidation = (soknadData, sokerPersonnummer) => {
  if (soknadData.getFamilieHendelseType() === familieHendelseType.FODSEL) {
    return (values) => RegistreringFodselGrid.validate(values, sokerPersonnummer);
  }
  if (soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON) {
    return (values) => RegistreringAdopsjonOgOmsorgGrid.validate(values, sokerPersonnummer);
  }
  return null;
};

const transformRootValues = (state, registeredFieldNames) => {
  const values = formValueSelector(ENGANGSSTONAD_FORM_NAME)(state, ...registeredFieldNames);
  if (values.rettigheter === rettighet.IKKE_RELEVANT) {
    return omit(values, 'rettigheter');
  }
  return values;
};

const buildInitialValuesSelector = createSelector([(state, ownProps) => ownProps], (ownProps) => {
  const { soknadData } = ownProps;
  return buildInitialValues(soknadData);
});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const sokerPersonnummer = ownProps.fagsakPerson.personnummer;
  const validate = getValidation(ownProps.soknadData, sokerPersonnummer);
  return (state) => {
    const registeredFields = getRegisteredFields(ENGANGSSTONAD_FORM_NAME)(state);
    const registeredFieldNames = Object.values(registeredFields).map((rf) => rf.name);
    const valuesForRegisteredFieldsOnly = registeredFieldNames.length
      ? transformRootValues(state, registeredFieldNames)
      : {};
    return {
      initialValues: buildInitialValuesSelector(state, ownProps),
      validate,
      valuesForRegisteredFieldsOnly,
    };
  };
};

export default connect(mapStateToPropsFactory)(reduxForm({
  form: ENGANGSSTONAD_FORM_NAME,
})(EngangsstonadForm));
