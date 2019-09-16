import React from 'react';
import {
  formPropTypes, formValueSelector, reduxForm,
} from 'redux-form';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { omit } from '@fpsak-frontend/utils';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import { getFagsakPerson, getKodeverk, getRegisteredFields } from 'papirsoknad/src/duckPapirsoknad';
import MottattDatoPanel from 'papirsoknad/src/components/commonPanels/MottattDatoPanel';
import OppholdINorgePanel from 'papirsoknad/src/components/commonPanels/OppholdINorgePanel';
import TilleggsopplysningerPanel from 'papirsoknad/src/components/commonPanels/TilleggsopplysningerPanel';
import SoknadData from 'papirsoknad/src/SoknadData';
import LagreSoknadForm from 'papirsoknad/src/components/commonPanels/LagreSoknadPanel';
import EgenVirksomhetPanel from '../commonPanels/virksomhet/EgenVirksomhetPanel';
import InntektsgivendeArbeidPanel from '../commonPanels/inntektsgivendeArbeid/InntektsgivendeArbeidPanel';
import AndreYtelserPanel, { ANDRE_YTELSER_FORM_NAME_PREFIX } from '../commonPanels/andreYtelser/AndreYtelserPanel';
import FrilansPanel from '../commonPanels/frilans/FrilansPanel';

const SVANGERSKAPSPENGER_FORM_NAME = 'SvangerskapspengerForm';

/**
 * SvangerskapspengerForm
 *
 * Redux-form-komponent for registrering av papirsøknad for svangerskapspenger.
 */
export class SvangerskapspengerForm extends React.Component {
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
      handleSubmit,
      submitting,
      form,
      readOnly,
      soknadData,
      onSubmitUfullstendigsoknad,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <MottattDatoPanel readOnly={readOnly} />
        <OppholdINorgePanel form={form} readOnly={readOnly} soknadData={soknadData} />
        <InntektsgivendeArbeidPanel readOnly={readOnly} />
        <EgenVirksomhetPanel
          readOnly={readOnly}
          form={form}
        />
        <FrilansPanel readOnly={readOnly} form={form} formName={SVANGERSKAPSPENGER_FORM_NAME} />
        <AndreYtelserPanel readOnly={readOnly} form={form} kunMiliterEllerSiviltjeneste />
        <TilleggsopplysningerPanel readOnly={readOnly} />
        <LagreSoknadForm readOnly={readOnly} onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad} form={form} submitting={submitting} />
      </form>
    );
  }
}

SvangerskapspengerForm.propTypes = {
  ...formPropTypes,
  /** Egen submit-handler som brukes dersom det indikeres at søknaden er ufullstendig */
  onSubmitUfullstendigsoknad: PropTypes.func.isRequired,
  /** Skjemaverdier hentet fra reduxForm */
  readOnly: PropTypes.bool,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
};

SvangerskapspengerForm.defaultProps = {
  readOnly: true,
};

const getValidation = (soknadData, andreYtelser) => {
  if (soknadData.getFamilieHendelseType() === familieHendelseType.FODSEL) {
    return (values) => ({
      ...AndreYtelserPanel.validate(values, andreYtelser),
      ...InntektsgivendeArbeidPanel.validate(values),
      ...FrilansPanel.validate(values),
      ...OppholdINorgePanel.validate(values),
    });
  }
  if (soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON) {
    return (values) => ({
      ...AndreYtelserPanel.validate(values, andreYtelser),
      ...InntektsgivendeArbeidPanel.validate(values),
      ...FrilansPanel.validate(values),
      ...OppholdINorgePanel.validate(values),
    });
  }
  return null;
};

const transformRootValues = (state, registeredFieldNames) => {
  const values = formValueSelector(SVANGERSKAPSPENGER_FORM_NAME)(state, ...registeredFieldNames);
  if (values.rettigheter === rettighet.IKKE_RELEVANT) {
    return omit(values, 'rettigheter');
  }
  return values;
};

const buildInitialValues = createSelector([(state, ownProps) => ownProps], (ownProps) => ({
  ...FrilansPanel.buildInitialValues(),
  ...AndreYtelserPanel.buildInitialValues(ownProps.andreYtelser),
  ...InntektsgivendeArbeidPanel.initialValues,
  ...OppholdINorgePanel.initialValues,
}));

const mapStateToPropsFactory = (initialState, ownProps) => {
  const sokerPersonnummer = getFagsakPerson(initialState).personnummer;
  const andreYtelserObject = { andreYtelser: getKodeverk(kodeverkTyper.ARBEID_TYPE)(initialState) };
  const validate = getValidation(ownProps.soknadData, andreYtelserObject.andreYtelser, sokerPersonnummer);
  return (state) => {
    const registeredFields = getRegisteredFields(SVANGERSKAPSPENGER_FORM_NAME)(state);
    const registeredFieldNames = Object.values(registeredFields).map((rf) => rf.name);

    const valuesForRegisteredFieldsOnly = registeredFieldNames.length
      ? {
        ...transformRootValues(state, registeredFieldNames),
        [ANDRE_YTELSER_FORM_NAME_PREFIX]: AndreYtelserPanel
          .transformValues(formValueSelector(SVANGERSKAPSPENGER_FORM_NAME)(state, ...registeredFieldNames), andreYtelserObject.andreYtelser),
      }
      : {};
    const sokerValue = valuesForRegisteredFieldsOnly.annenForelder;
    const sokerHarAleneomsorg = sokerValue ? sokerValue.sokerHarAleneomsorg : undefined;

    let annenForelderInformertRequired = true;
    if (sokerValue && (sokerHarAleneomsorg || sokerValue.denAndreForelderenHarRettPaForeldrepenger === false)) {
      annenForelderInformertRequired = false;
    }
    return {
      initialValues: buildInitialValues(state, andreYtelserObject),
      valuesForRegisteredFieldsOnly,
      annenForelderInformertRequired,
      sokerHarAleneomsorg,
      validate,
    };
  };
};

export default connect(mapStateToPropsFactory)(reduxForm({
  form: SVANGERSKAPSPENGER_FORM_NAME,
})(SvangerskapspengerForm));
