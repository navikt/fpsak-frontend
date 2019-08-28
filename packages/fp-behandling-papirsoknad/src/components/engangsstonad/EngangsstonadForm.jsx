import React, { Component } from 'react';
import { reduxForm, formPropTypes, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { isEqual, omit } from '@fpsak-frontend/utils';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';

import { getRegisteredFields, getFagsakPerson } from 'papirsoknad/src/duckPapirsoknad';
import MottattDatoPanel from 'papirsoknad/src/components/commonPanels/MottattDatoPanel';
import SoknadData from 'papirsoknad/src/SoknadData';
import LagreSoknadPanel from 'papirsoknad/src/components/commonPanels/LagreSoknadPanel';
import { rettighet } from '../commonPanels/rettigheter/RettigheterPanel';
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
  componentWillReceiveProps(nextProps) {
    const { soknadData } = this.props;
    if (!isEqual(soknadData, nextProps.soknadData)) {
      nextProps.initialize(buildInitialValues(nextProps.soknadData));
    }
  }

  shouldComponentUpdate(nextProps) {
    // Dette er gjort for å hindra rerender for testetrykk på alle underformene
    const notRerenderIfChangedProps = ['blur', 'change', 'dirty', 'error', 'pristine', 'valuesForRegisteredFieldsOnly'];
    const changedPropsList = Object.entries(this.props)
      .filter(([key, val]) => nextProps[key] !== val)
      .map(([key]) => key);
    return changedPropsList.some((changedProp) => !notRerenderIfChangedProps.includes(changedProp));
  }

  render() {
    const {
      handleSubmit, form, readOnly, soknadData, onSubmitUfullstendigsoknad, submitting,
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
          />
          )}
        {(soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON)
          && (
          <RegistreringAdopsjonOgOmsorgGrid
            soknadData={soknadData}
            onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
            readOnly={readOnly}
            form={form}
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
  const sokerPersonnummer = getFagsakPerson(initialState).personnummer;
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
