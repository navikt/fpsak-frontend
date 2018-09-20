import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { FieldArray, formValueSelector } from 'redux-form';

import { CheckboxField } from '@fpsak-frontend/form';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import {
  hasValidInteger,
  hasValidPeriodIncludingOtherErrors,
  maxLength,
  required,
  validateProsentandel,
} from '@fpsak-frontend/utils/validation/validators';
import { isRequiredMessage } from '@fpsak-frontend/utils/validation/messages';
import RenderGraderingPeriodeFieldArray from './RenderGraderingPeriodeFieldArray';

export const graderingPeriodeFieldArrayName = 'graderingPeriode';

const maxLength9 = maxLength(9);

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
}) => (
  <div>
    <Element><FormattedMessage id="Registrering.Permisjon.Gradering.Title" /></Element>
    <VerticalSpacer sixteenPx />
    <CheckboxField
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
      readOnly={readOnly}
    />
    )
    }
  </div>
);

export const validateOtherErrors = (values, isEndringForeldrepenger) => values.map(({
  periodeForGradering, prosentandelArbeid, orgNr, erArbeidstaker,
}) => {
  const periodeForGraderingError = required(periodeForGradering);
  const prosentandelArbeidError = validateProsentandel(prosentandelArbeid);
  const orgNrShouldBeRequired = !isEndringForeldrepenger && erArbeidstaker === 'true';
  const orgNrError = (orgNrShouldBeRequired && required(orgNr)) || hasValidInteger(orgNr) || maxLength9(orgNr);
  if (prosentandelArbeidError || periodeForGraderingError || orgNrError) {
    return {
      periodeForGradering: periodeForGraderingError,
      orgNr: orgNrError,
      prosentandelArbeid: prosentandelArbeidError,
    };
  }
  return null;
});

PermisjonGraderingPanel.validate = (values, isEndringForeldrepenger) => {
  if (!values || !values.length) {
    return { _error: isRequiredMessage() };
  }
  const otherErrors = validateOtherErrors(values, isEndringForeldrepenger);

  return hasValidPeriodIncludingOtherErrors(values, otherErrors);
};

PermisjonGraderingPanel.propTypes = {
  graderingKvoter: kodeverkPropType.isRequired,
  form: PropTypes.string.isRequired,
  namePrefix: PropTypes.string.isRequired,
  skalGradere: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

PermisjonGraderingPanel.initialValues = {
  [graderingPeriodeFieldArrayName]: [{}],
  skalGradere: false,
};


const mapStateToProps = (state, ownProps) => ({
  graderingKvoter: getKodeverk(kodeverkTyper.UTSETTELSE_GRADERING_KVOTE)(state),
  skalGradere: formValueSelector(ownProps.form)(state, ownProps.namePrefix).skalGradere,
});

export default connect(mapStateToProps)(PermisjonGraderingPanel);
