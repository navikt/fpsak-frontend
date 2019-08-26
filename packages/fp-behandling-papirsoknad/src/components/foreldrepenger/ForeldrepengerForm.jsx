import React from 'react';
import {
  reduxForm, formPropTypes, FormSection, formValueSelector,
} from 'redux-form';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import { omit } from '@fpsak-frontend/utils';
import familieHendelseType from '@fpsak-frontend/kodeverk/src/familieHendelseType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import { getRegisteredFields, getKodeverk, getFagsakPerson } from 'papirsoknad/src/duckPapirsoknad';
import MottattDatoPanel from 'papirsoknad/src/components/commonPanels/MottattDatoPanel';
import AnnenForelderPanel from 'papirsoknad/src/components/commonPanels/AnnenForelderPanel';
import OppholdINorgePanel from 'papirsoknad/src/components/commonPanels/OppholdINorgePanel';
import TilleggsopplysningerPanel from 'papirsoknad/src/components/commonPanels/TilleggsopplysningerPanel';
import SoknadData from 'papirsoknad/src/SoknadData';
import LagreSoknadForm from 'papirsoknad/src/components/commonPanels/LagreSoknadPanel';
import OmsorgOgAdopsjonPanel from 'papirsoknad/src/components/commonPanels/omsorgOgAdopsjon/OmsorgOgAdopsjonPanel';
import TerminFodselDatoPanel from 'papirsoknad/src/components/commonPanels/fodsel/TerminFodselDatoPanel';
import RettigheterPanel, { rettighet } from '../commonPanels/rettigheter/RettigheterPanel';
import EgenVirksomhetPanel from './virksomhet/EgenVirksomhetPanel';
import DekningsgradPanel from './dekningsgrad/DekningsgradPanel';
import InntektsgivendeArbeidPanel from './inntektsgivendeArbeid/InntektsgivendeArbeidPanel';
import AndreYtelserPanel, { ANDRE_YTELSER_FORM_NAME_PREFIX } from './andreYtelser/AndreYtelserPanel';
import PermisjonPanel, { TIDSROM_PERMISJON_FORM_NAME_PREFIX } from './permisjon/PermisjonPanel';
import FrilansPanel from './frilans/FrilansPanel';
import BekreftelsePanel from './bekreftelse/BekreftelsePanel';

const FORELDREPENGER_FORM_NAME = 'ForeldrepengerForm';
const ANNEN_FORELDER_FORM_NAME_PREFIX = 'annenForelder';
const OMSORG_FORM_NAME_PREFIX = 'omsorg';

/**
 * ForeldrepengerForm
 *
 * Redux-form-komponent for registrering av papirsøknad for foreldrepenger.
 */
export class ForeldrepengerForm extends React.Component {
  shouldComponentUpdate(nextProps) {
    // Dette er gjort for å hindra rerender for testetrykk på alle underformene
    const notRerenderIfChangedProps = ['blur', 'change', 'dirty', 'error', 'pristine', 'valuesForRegisteredFieldsOnly'];
    const changedPropsList = Object.entries(this.props)
      .filter(([key, val]) => nextProps[key] !== val)
      .map(([key]) => key);
    return changedPropsList.some(changedProp => !notRerenderIfChangedProps.includes(changedProp));
  }

  render() {
    const {
      handleSubmit,
      submitting,
      form,
      readOnly,
      soknadData,
      onSubmitUfullstendigsoknad,
      error,
      submitFailed,
      annenForelderInformertRequired,
      sokerHarAleneomsorg,
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
        <FrilansPanel readOnly={readOnly} form={form} formName={FORELDREPENGER_FORM_NAME} />
        <AndreYtelserPanel readOnly={readOnly} form={form} />
        <DekningsgradPanel readOnly={readOnly} />
        {soknadData.getFamilieHendelseType() === familieHendelseType.FODSEL
          && <TerminFodselDatoPanel readOnly={readOnly} form={form} />
        }
        <RettigheterPanel readOnly={readOnly} soknadData={soknadData} />
        <FormSection name={OMSORG_FORM_NAME_PREFIX}>
          <OmsorgOgAdopsjonPanel
            form={form}
            namePrefix={OMSORG_FORM_NAME_PREFIX}
            readOnly={readOnly}
            familieHendelseType={soknadData.getFamilieHendelseType()}
          />
        </FormSection>
        <FormSection name={ANNEN_FORELDER_FORM_NAME_PREFIX}>
          <AnnenForelderPanel
            isForeldrepenger
            soknadData={soknadData}
            sokerHarAleneomsorg={sokerHarAleneomsorg}
            namePrefix={ANNEN_FORELDER_FORM_NAME_PREFIX}
            form={form}
            readOnly={readOnly}
          />
        </FormSection>
        <PermisjonPanel
          soknadData={soknadData}
          form={form}
          readOnly={readOnly}
          error={error}
          submitFailed={submitFailed}
          sokerHarAleneomsorg={sokerHarAleneomsorg}
        />
        <BekreftelsePanel annenForelderInformertRequired={annenForelderInformertRequired} readOnly={readOnly} />
        <TilleggsopplysningerPanel readOnly={readOnly} />
        <LagreSoknadForm readOnly={readOnly} onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad} form={form} submitting={submitting} />
      </form>
    );
  }
}

ForeldrepengerForm.propTypes = {
  ...formPropTypes,
  /** Egen submit-handler som brukes dersom det indikeres at søknaden er ufullstendig */
  onSubmitUfullstendigsoknad: PropTypes.func.isRequired,
  /** Skjemaverdier hentet fra reduxForm */
  readOnly: PropTypes.bool,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
};

ForeldrepengerForm.defaultProps = {
  readOnly: true,
};

const getValidation = (soknadData, andreYtelser, sokerPersonnummer) => {
  if (soknadData.getFamilieHendelseType() === familieHendelseType.FODSEL) {
    return values => ({
      ...AndreYtelserPanel.validate(values, andreYtelser),
      ...InntektsgivendeArbeidPanel.validate(values),
      ...FrilansPanel.validate(values),
      ...OppholdINorgePanel.validate(values),
      ...TerminFodselDatoPanel.validate(values),
      [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.validate(values[OMSORG_FORM_NAME_PREFIX], values.rettigheter, values.foedselsDato),
      ...PermisjonPanel.validate(values, soknadData),
      [ANNEN_FORELDER_FORM_NAME_PREFIX]: AnnenForelderPanel.validate(sokerPersonnummer, values[ANNEN_FORELDER_FORM_NAME_PREFIX]),
    });
  }
  if (soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON) {
    return values => ({
      ...AndreYtelserPanel.validate(values, andreYtelser),
      ...InntektsgivendeArbeidPanel.validate(values),
      ...FrilansPanel.validate(values),
      ...OppholdINorgePanel.validate(values),
      [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.validate(values[OMSORG_FORM_NAME_PREFIX], values.rettigheter, values.foedselsDato),
      ...PermisjonPanel.validate(values, soknadData),
      [ANNEN_FORELDER_FORM_NAME_PREFIX]: AnnenForelderPanel.validate(sokerPersonnummer, values[ANNEN_FORELDER_FORM_NAME_PREFIX]),
    });
  }
  return null;
};

const transformRootValues = (state, registeredFieldNames) => {
  const values = formValueSelector(FORELDREPENGER_FORM_NAME)(state, ...registeredFieldNames);
  if (values.rettigheter === rettighet.IKKE_RELEVANT) {
    return omit(values, 'rettigheter');
  }
  return values;
};

const buildInitialValues = createSelector([(state, ownProps) => ownProps], ownProps => ({
  ...FrilansPanel.buildInitialValues(),
  ...AndreYtelserPanel.buildInitialValues(ownProps.andreYtelser),
  ...InntektsgivendeArbeidPanel.initialValues,
  [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.initialValues,
  ...OppholdINorgePanel.initialValues,
  ...PermisjonPanel.initialValues,
}));

const mapStateToPropsFactory = (initialState, ownProps) => {
  const sokerPersonnummer = getFagsakPerson(initialState).personnummer;
  const andreYtelserObject = { andreYtelser: getKodeverk(kodeverkTyper.ARBEID_TYPE)(initialState) };
  const validate = getValidation(ownProps.soknadData, andreYtelserObject.andreYtelser, sokerPersonnummer);
  return (state) => {
    const registeredFields = getRegisteredFields(FORELDREPENGER_FORM_NAME)(state);
    const registeredFieldNames = Object.values(registeredFields).map(rf => rf.name);

    const valuesForRegisteredFieldsOnly = registeredFieldNames.length
      ? {
        ...transformRootValues(state, registeredFieldNames),
        [ANDRE_YTELSER_FORM_NAME_PREFIX]: AndreYtelserPanel
          .transformValues(formValueSelector(FORELDREPENGER_FORM_NAME)(state, ...registeredFieldNames), andreYtelserObject.andreYtelser),
        [TIDSROM_PERMISJON_FORM_NAME_PREFIX]: PermisjonPanel
          .transformValues(formValueSelector(FORELDREPENGER_FORM_NAME)(state, ...registeredFieldNames)),
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
  form: FORELDREPENGER_FORM_NAME,
})(ForeldrepengerForm));
