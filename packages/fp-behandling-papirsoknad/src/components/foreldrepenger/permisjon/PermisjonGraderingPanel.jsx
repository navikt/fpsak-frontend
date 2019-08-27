import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { FieldArray, formValueSelector } from 'redux-form';

import { CheckboxField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import {
  hasValidInteger,
  hasValidPeriodIncludingOtherErrors,
  required,
  validateProsentandel,
  maxLengthOrFodselsnr,
  hasValidFodselsnummer,
  isRequiredMessage,
} from '@fpsak-frontend/utils';
import arbeidskategori from '@fpsak-frontend/kodeverk/src/arbeidskategori';

import { getKodeverk } from 'papirsoknad/src/duckPapirsoknad';
import RenderGraderingPeriodeFieldArray from './RenderGraderingPeriodeFieldArray';
import styles from './permisjonPanel.less';

export const graderingPeriodeFieldArrayName = 'graderingPeriode';

const maxLength9OrFodselsnr = maxLengthOrFodselsnr(9);

/**
 *  PermisjonGraderingPanel
 *
 * Presentasjonskomponent: Viser panel for gradering
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */
export const PermisjonGraderingPanel = ({
  graderingKvoter,
  form,
  namePrefix,
  skalGradere,
  readOnly,
  visFeilMelding,
  arbeidskategoriTyper,
}) => (
  <div>
    <Element><FormattedMessage id="Registrering.Permisjon.Gradering.Title" /></Element>
    <VerticalSpacer sixteenPx />
    <CheckboxField
      className={visFeilMelding ? styles.showErrorBackground : ''}
      readOnly={readOnly}
      name="skalGradere"
      label={<FormattedMessage id="Registrering.Permisjon.Gradering.GraderUttaket" />}
    />
    { skalGradere
    && (
    <FieldArray
      name={graderingPeriodeFieldArrayName}
      component={RenderGraderingPeriodeFieldArray}
      graderingKvoter={graderingKvoter}
      form={form}
      namePrefix={namePrefix}
      graderingPrefix={graderingPeriodeFieldArrayName}
      arbeidskategoriTyper={arbeidskategoriTyper}
      readOnly={readOnly}
    />
    )}
  </div>
);

export const validateOtherErrors = (values) => values.map(({
  periodeForGradering, prosentandelArbeid, arbeidsgiverIdentifikator, erArbeidstaker, samtidigUttaksprosent, harSamtidigUttak,
}) => {
  const periodeForGraderingError = required(periodeForGradering);
  const prosentandelArbeidError = validateProsentandel(prosentandelArbeid);
  const arbeidsgiverShouldBeRequired = erArbeidstaker === 'true';
  const arbeidsgiverError = (arbeidsgiverShouldBeRequired && required(arbeidsgiverIdentifikator))
    || hasValidInteger(arbeidsgiverIdentifikator)
    || ((arbeidsgiverIdentifikator && arbeidsgiverIdentifikator.toString().length) === 11
      ? hasValidFodselsnummer(arbeidsgiverIdentifikator)
      : maxLength9OrFodselsnr(arbeidsgiverIdentifikator));
  const samtidigUttaksprosentError = harSamtidigUttak === true && required(samtidigUttaksprosent);
  if (prosentandelArbeidError || periodeForGraderingError || arbeidsgiverError || samtidigUttaksprosentError) {
    return {
      periodeForGradering: periodeForGraderingError,
      arbeidsgiverIdentifikator: arbeidsgiverError,
      prosentandelArbeid: prosentandelArbeidError,
      samtidigUttaksprosent: samtidigUttaksprosentError,
    };
  }
  return null;
});

PermisjonGraderingPanel.validate = (values) => {
  if (!values || !values.length) {
    return { _error: isRequiredMessage() };
  }
  const otherErrors = validateOtherErrors(values);

  return hasValidPeriodIncludingOtherErrors(values, otherErrors);
};

PermisjonGraderingPanel.transformValues = (perioder) => perioder.map((p) => {
  const { ...periode } = p;
  if (p.erArbeidstaker) {
    periode.erArbeidstaker = p.erArbeidstaker === arbeidskategori.ARBEIDSTAKER;
    periode.erFrilanser = p.erArbeidstaker === arbeidskategori.FRILANSER;
    periode.erSelvstNæringsdrivende = p.erArbeidstaker === arbeidskategori.SELVSTENDIG_NAERINGSDRIVENDE;
  }
  return periode;
});

PermisjonGraderingPanel.propTypes = {
  graderingKvoter: kodeverkPropType.isRequired,
  form: PropTypes.string.isRequired,
  namePrefix: PropTypes.string.isRequired,
  skalGradere: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  visFeilMelding: PropTypes.bool.isRequired,
  arbeidskategoriTyper: kodeverkPropType.isRequired,
};

PermisjonGraderingPanel.initialValues = {
  [graderingPeriodeFieldArrayName]: [{}],
  skalGradere: false,
};


const mapStateToProps = (state, ownProps) => ({
  graderingKvoter: getKodeverk(kodeverkTyper.UTSETTELSE_GRADERING_KVOTE)(state),
  skalGradere: formValueSelector(ownProps.form)(state, ownProps.namePrefix).skalGradere,
  arbeidskategoriTyper: getKodeverk(kodeverkTyper.ARBEIDSKATEGORI)(state),
});

export default connect(mapStateToProps)(PermisjonGraderingPanel);
