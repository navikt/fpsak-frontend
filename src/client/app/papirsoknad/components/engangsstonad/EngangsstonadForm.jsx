import React, { Component } from 'react';
import { reduxForm, formPropTypes, formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { isEqual } from 'utils/objectUtils';
import { getRegisteredFields } from 'papirsoknad/duck';
import MottattDatoPanel from 'papirsoknad/components/commonPanels/MottattDatoPanel';
import SoknadData from 'papirsoknad/SoknadData';
import familieHendelseType from 'kodeverk/familieHendelseType';
import LagreSoknadPanel from 'papirsoknad/components/commonPanels/LagreSoknadPanel';
import { getFagsakPerson } from 'fagsak/fagsakSelectors';
import RegistreringAdopsjonOgOmsorgGrid from './RegistreringAdopsjonOgOmsorgGrid';
import RegistreringFodselGrid from './RegistreringFodselGrid';

export const ENGANGSSTONAD_FORM_NAME = 'EngangsstonadForm';

const buildInitialValues = (soknadData) => {
  if (soknadData.getFamilieHendelseType() === familieHendelseType.FODSEL) {
    return { ...RegistreringFodselGrid.initialValues };
  } if (soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON) {
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
          )
        }
        {(soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON)
          && (
          <RegistreringAdopsjonOgOmsorgGrid
            soknadData={soknadData}
            onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
            readOnly={readOnly}
            form={form}
          />
          )
        }
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
    return values => RegistreringFodselGrid.validate(values, sokerPersonnummer);
  } if (soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON) {
    return values => RegistreringAdopsjonOgOmsorgGrid.validate(values, sokerPersonnummer);
  }
  return null;
};

const mapStateToProps = (state, initialProps) => {
  const sokerPersonnummer = getFagsakPerson(state).personnummer;
  const registeredFields = getRegisteredFields(ENGANGSSTONAD_FORM_NAME)(state);
  const registeredFieldNames = Object.values(registeredFields).map(rf => rf.name);
  const valuesForRegisteredFieldsOnly = registeredFieldNames.length
    ? formValueSelector(ENGANGSSTONAD_FORM_NAME)(state, ...registeredFieldNames)
    : {};
  return {
    initialValues: buildInitialValues(initialProps.soknadData),
    validate: getValidation(initialProps.soknadData, sokerPersonnummer),
    valuesForRegisteredFieldsOnly,
  };
};

export default connect(mapStateToProps)(reduxForm({
  form: ENGANGSSTONAD_FORM_NAME,
})(EngangsstonadForm));
