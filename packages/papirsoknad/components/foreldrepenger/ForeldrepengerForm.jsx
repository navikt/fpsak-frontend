import React from 'react';
import {
  reduxForm, formPropTypes, FormSection, formValueSelector,
} from 'redux-form';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RettigheterPanel from 'papirsoknad/components/commonPanels/rettigheter/RettigheterPanel';
import { getRegisteredFields } from 'papirsoknad/duck';
import { getFagsakPerson } from 'fagsak/fagsakSelectors';
import MottattDatoPanel from 'papirsoknad/components/commonPanels/MottattDatoPanel';
import AnnenForelderPanel from 'papirsoknad/components/commonPanels/AnnenForelderPanel';
import OppholdINorgePanel from 'papirsoknad/components/commonPanels/OppholdINorgePanel';
import TilleggsopplysningerPanel from 'papirsoknad/components/commonPanels/TilleggsopplysningerPanel';
import SoknadData from 'papirsoknad/SoknadData';
import familieHendelseType from 'kodeverk/familieHendelseType';
import LagreSoknadForm from 'papirsoknad/components/commonPanels/LagreSoknadPanel';
import OmsorgOgAdopsjonPanel from 'papirsoknad/components/commonPanels/omsorgOgAdopsjon/OmsorgOgAdopsjonPanel';
import TerminFodselDatoPanel from 'papirsoknad/components/commonPanels/fodsel/TerminFodselDatoPanel';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import EgenVirksomhetPanel from './virksomhet/EgenVirksomhetPanel';
import DekningsgradPanel from './dekningsgrad/DekningsgradPanel';
import InntektsgivendeArbeidPanel from './inntektsgivendeArbeid/InntektsgivendeArbeidPanel';
import AndreYtelserPanel, { ANDRE_YTELSER_FORM_NAME_PREFIX } from './andreYtelser/AndreYtelserPanel';
import PermisjonPanel, { TIDSROM_PERMISJON_FORM_NAME_PREFIX } from './permisjon/PermisjonPanel';
import FrilansPanel from './frilans/FrilansPanel';

const FORELDREPENGER_FORM_NAME = 'ForeldrepengerForm';
const ANNEN_FORELDER_FORM_NAME_PREFIX = 'annenForelder';
const OMSORG_FORM_NAME_PREFIX = 'omsorg';

const buildInitialValues = (soknadData, andreYtelser) => ({
  ...FrilansPanel.buildInitialValues(),
  ...AndreYtelserPanel.buildInitialValues(andreYtelser),
  ...InntektsgivendeArbeidPanel.initialValues,
  [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.initialValues,
  ...OppholdINorgePanel.initialValues,
  ...PermisjonPanel.initialValues,
});

/**
 * ForeldrepengerForm
 *
 * Redux-form-komponent for registrering av papirsøknad for foreldrepenger.
 *
 */
export const ForeldrepengerForm = ({
  handleSubmit,
  submitting,
  form,
  readOnly,
  soknadData,
  onSubmitUfullstendigsoknad,
}) => (
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
    <PermisjonPanel
      soknadData={soknadData}
      form={form}
      readOnly={readOnly}
    />

    <FormSection name={ANNEN_FORELDER_FORM_NAME_PREFIX}>
      <AnnenForelderPanel isForeldrepenger namePrefix={ANNEN_FORELDER_FORM_NAME_PREFIX} form={form} readOnly={readOnly} />
    </FormSection>
    <TilleggsopplysningerPanel readOnly={readOnly} />
    <LagreSoknadForm readOnly={readOnly} onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad} form={form} submitting={submitting} />
  </form>
);

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
      ...FrilansPanel.validate(values),
      ...OppholdINorgePanel.validate(values),
      ...TerminFodselDatoPanel.validate(values),
      [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.validate(values[OMSORG_FORM_NAME_PREFIX], values.rettigheter, values.foedselsDato),
      ...PermisjonPanel.validate(values, soknadData),
      [ANNEN_FORELDER_FORM_NAME_PREFIX]: AnnenForelderPanel.validate(sokerPersonnummer, values[ANNEN_FORELDER_FORM_NAME_PREFIX]),
    });
  } if (soknadData.getFamilieHendelseType() === familieHendelseType.ADOPSJON) {
    return values => ({
      ...AndreYtelserPanel.validate(values, andreYtelser),
      ...FrilansPanel.validate(values),
      ...OppholdINorgePanel.validate(values),
      [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.validate(values[OMSORG_FORM_NAME_PREFIX], values.rettigheter, values.foedselsDato),
      ...PermisjonPanel.validate(values, soknadData),
      [ANNEN_FORELDER_FORM_NAME_PREFIX]: AnnenForelderPanel.validate(sokerPersonnummer, values[ANNEN_FORELDER_FORM_NAME_PREFIX]),
    });
  }
  return null;
};


const mapStateToProps = (state, initialProps) => {
  const sokerPersonnummer = getFagsakPerson(state).personnummer;
  const registeredFields = getRegisteredFields(FORELDREPENGER_FORM_NAME)(state);
  const registeredFieldNames = Object.values(registeredFields).map(rf => rf.name);
  const andreYtelser = getKodeverk(kodeverkTyper.ARBEID_TYPE)(state);
  const valuesForRegisteredFieldsOnly = registeredFieldNames.length
    ? {
      ...formValueSelector(FORELDREPENGER_FORM_NAME)(state, ...registeredFieldNames),
      [ANDRE_YTELSER_FORM_NAME_PREFIX]: AndreYtelserPanel
        .transformValues(formValueSelector(FORELDREPENGER_FORM_NAME)(state, ...registeredFieldNames), andreYtelser),
      [TIDSROM_PERMISJON_FORM_NAME_PREFIX]: PermisjonPanel
        .transformValues(formValueSelector(FORELDREPENGER_FORM_NAME)(state, ...registeredFieldNames)),

    }
    : {};
  return {
    initialValues: buildInitialValues(initialProps.soknadData, andreYtelser),
    validate: getValidation(initialProps.soknadData, andreYtelser, sokerPersonnummer),
    valuesForRegisteredFieldsOnly,
  };
};

export default connect(mapStateToProps)(reduxForm({
  form: FORELDREPENGER_FORM_NAME,
})(ForeldrepengerForm));
