import React from 'react';
import {
  formPropTypes, formValueSelector, reduxForm, FormSection,
} from 'redux-form';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import { getKodeverk, getRegisteredFields } from 'papirsoknad/src/duckPapirsoknad';
import MottattDatoPanel from 'papirsoknad/src/components/commonPanels/MottattDatoPanel';
import OppholdINorgePanel from 'papirsoknad/src/components/commonPanels/OppholdINorgePanel';
import TilleggsopplysningerPanel from 'papirsoknad/src/components/commonPanels/TilleggsopplysningerPanel';
import SoknadData from 'papirsoknad/src/SoknadData';
import LagreSoknadForm from 'papirsoknad/src/components/commonPanels/LagreSoknadPanel';
import EgenVirksomhetPanel from '../commonPanels/virksomhet/EgenVirksomhetPanel';
import InntektsgivendeArbeidPanel from '../commonPanels/inntektsgivendeArbeid/InntektsgivendeArbeidPanel';
import AndreYtelserPanel, { ANDRE_YTELSER_FORM_NAME_PREFIX } from '../commonPanels/andreYtelser/AndreYtelserPanel';
import FrilansPanel from '../commonPanels/frilans/FrilansPanel';
import TerminFodselSvpPanel from './terminOgFodsel/TerminFodselSvpPanel';
import MigreringFraInfotrygdPanel from './migreringFraInfotrygd/MigreringFraInfotrygdPanel';
import BehovForTilretteleggingPanel from './tilrettelegging/BehovForTilretteleggingPanel';

const SVANGERSKAPSPENGER_FORM_NAME = 'SvangerskapspengerForm';
const TILRETTELEGGING_NAME_PREFIX = 'tilretteleggingArbeidsforhold';

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
        <EgenVirksomhetPanel readOnly={readOnly} form={form} />
        <FrilansPanel readOnly={readOnly} form={form} formName={SVANGERSKAPSPENGER_FORM_NAME} />
        <AndreYtelserPanel readOnly={readOnly} form={form} kunMiliterEllerSiviltjeneste />
        <TerminFodselSvpPanel readOnly={readOnly} form={form} />
        <FormSection name={TILRETTELEGGING_NAME_PREFIX}>
          <BehovForTilretteleggingPanel readOnly={readOnly} formName={SVANGERSKAPSPENGER_FORM_NAME} namePrefix={TILRETTELEGGING_NAME_PREFIX} />
        </FormSection>
        <TilleggsopplysningerPanel readOnly={readOnly} />
        <MigreringFraInfotrygdPanel readOnly={readOnly} />
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

const getValidation = (soknadData, andreYtelser) => (values) => ({
  ...AndreYtelserPanel.validate(values, andreYtelser),
  ...InntektsgivendeArbeidPanel.validate(values),
  ...FrilansPanel.validate(values),
  ...OppholdINorgePanel.validate(values),
});

const transformRootValues = (state, registeredFieldNames) => {
  const values = formValueSelector(SVANGERSKAPSPENGER_FORM_NAME)(state, ...registeredFieldNames);
  return values;
};

const buildInitialValues = createSelector([(state, ownProps) => ownProps], (ownProps) => ({
  ...FrilansPanel.buildInitialValues(),
  ...AndreYtelserPanel.buildInitialValues(ownProps.andreYtelser),
  ...InntektsgivendeArbeidPanel.initialValues,
  ...OppholdINorgePanel.initialValues,
  [TILRETTELEGGING_NAME_PREFIX]: BehovForTilretteleggingPanel.initialValues,
}));

const transformTilretteleggingsArbeidsforhold = (tilretteleggingArbeidsforhold) => {
  let transformerteVerdier = [];
  if (tilretteleggingArbeidsforhold.sokForArbeidsgiver) {
    transformerteVerdier = transformerteVerdier.concat(tilretteleggingArbeidsforhold.tilretteleggingForArbeidsgiver.map((ta) => ({
      '@type': 'VI',
      behovsdato: ta.behovsdato,
      organisasjonsnummer: ta.organisasjonsnummer,
      tilrettelegginger: ta.tilretteleggingArbeidsgiver,
    })));
  }
  if (tilretteleggingArbeidsforhold.sokForFrilans) {
    transformerteVerdier.push({
      '@type': 'FR',
      behovsdato: tilretteleggingArbeidsforhold.behovsdatoFrilans,
      tilrettelegginger: tilretteleggingArbeidsforhold.tilretteleggingFrilans,
    });
  }
  if (tilretteleggingArbeidsforhold.sokForSelvstendigNaringsdrivende) {
    transformerteVerdier.push({
      '@type': 'SN',
      behovsdato: tilretteleggingArbeidsforhold.behovsdatoSN,
      tilrettelegginger: tilretteleggingArbeidsforhold.tilretteleggingSelvstendigNaringsdrivende,
    });
  }

  return transformerteVerdier;
};

export const transformValues = (values) => ({
  ...values,
  foedselsDato: [values.foedselsDato],
  tilretteleggingArbeidsforhold: transformTilretteleggingsArbeidsforhold(values.tilretteleggingArbeidsforhold),
});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const andreYtelserObject = { andreYtelser: getKodeverk(kodeverkTyper.ARBEID_TYPE)(initialState) };
  const validate = getValidation(ownProps.soknadData, andreYtelserObject.andreYtelser);
  const onSubmit = (values, dispatch, props) => ownProps.submitCallback(values, dispatch, {
    valuesForRegisteredFieldsOnly: transformValues(props.valuesForRegisteredFieldsOnly),
  });
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

    return {
      initialValues: buildInitialValues(state, andreYtelserObject),
      valuesForRegisteredFieldsOnly,
      validate,
      onSubmit,
    };
  };
};

export default connect(mapStateToPropsFactory)(reduxForm({
  form: SVANGERSKAPSPENGER_FORM_NAME,
})(SvangerskapspengerForm));
