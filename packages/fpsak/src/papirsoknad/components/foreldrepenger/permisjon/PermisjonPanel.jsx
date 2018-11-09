import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray, FormSection } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Element, Undertittel } from 'nav-frontend-typografi';

import BorderBox from '@fpsak-frontend/shared-components/BorderBox';
import SoknadData from 'papirsoknad/SoknadData';
import foreldreType from '@fpsak-frontend/kodeverk/foreldreType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/fagsakYtelseType';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import PermisjonRettigheterPanel from './PermisjonRettigheterPanel';
import PermisjonUtsettelsePanel, { utsettelsePeriodeFieldArrayName } from './PermisjonUtsettelsePanel';
import PermisjonGraderingPanel, { graderingPeriodeFieldArrayName } from './PermisjonGraderingPanel';
import PermisjonOverforingAvKvoterPanel from './PermisjonOverforingAvKvoterPanel';
import RenderPermisjonPeriodeFieldArray from './RenderPermisjonPeriodeFieldArray';
import PermisjonOppholdPanel, { oppholdPeriodeFieldArrayName } from './PermisjonOppholdPanel';

import styles from './permisjonPanel.less';

export const TIDSROM_PERMISJON_FORM_NAME_PREFIX = 'tidsromPermisjon';

export const permisjonPeriodeFieldArrayName = 'permisjonsPerioder';

/**
 * PermisjonPanel
 *
 * Presentasjonskomponent: Viser permisjonspanel for mor eller far/medmor
 */
export const PermisjonPanel = ({
  soknadData,
  form,
  readOnly,
}) => (
  <FormSection name={TIDSROM_PERMISJON_FORM_NAME_PREFIX}>
    <BorderBox>
      <div className={styles.flexContainer}>
        <Undertittel><FormattedMessage id="Registrering.Permisjon.Title" /></Undertittel>
        <VerticalSpacer sixteenPx />
        {soknadData.getFagsakYtelseType() !== fagsakYtelseType.ENDRING_FORELDREPENGER
          && <PermisjonRettigheterPanel readOnly={readOnly} />
        }
        <Element><FormattedMessage id="Registrering.Permisjon.FulltUttak" /></Element>
        <VerticalSpacer eightPx />
        <FieldArray
          name={permisjonPeriodeFieldArrayName}
          component={RenderPermisjonPeriodeFieldArray}
          periodePrefix={permisjonPeriodeFieldArrayName}
          namePrefix={TIDSROM_PERMISJON_FORM_NAME_PREFIX}
          sokerErMor={soknadData.getForeldreType() === foreldreType.MOR}
          readOnly={readOnly}
        />
        <VerticalSpacer twentyPx />
        <PermisjonOverforingAvKvoterPanel form={form} readOnly={readOnly} soknadData={soknadData} namePrefix={TIDSROM_PERMISJON_FORM_NAME_PREFIX} />
        <VerticalSpacer twentyPx />
        <PermisjonUtsettelsePanel form={form} readOnly={readOnly} namePrefix={TIDSROM_PERMISJON_FORM_NAME_PREFIX} />
        <VerticalSpacer twentyPx />
        <PermisjonGraderingPanel form={form} readOnly={readOnly} namePrefix={TIDSROM_PERMISJON_FORM_NAME_PREFIX} />
        <VerticalSpacer twentyPx />
        <PermisjonOppholdPanel form={form} readOnly={readOnly} namePrefix={TIDSROM_PERMISJON_FORM_NAME_PREFIX} />
      </div>
    </BorderBox>
  </FormSection>
);

PermisjonPanel.propTypes = {
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
  form: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
};


const permisjonErrors = (values, soknadData) => {
  const errors = PermisjonOverforingAvKvoterPanel.validate(values);

  const utsettelseGraderingOrOppholdSelected = values.skalUtsette || values.skalGradere || values.skalHaOpphold;
  const isEndringForeldrepenger = soknadData.getFagsakYtelseType() === fagsakYtelseType.ENDRING_FORELDREPENGER;
  if (!isEndringForeldrepenger) {
    const permisjonPeriodeValues = values ? values[permisjonPeriodeFieldArrayName] : null;
    errors[permisjonPeriodeFieldArrayName] = RenderPermisjonPeriodeFieldArray.validate(permisjonPeriodeValues, utsettelseGraderingOrOppholdSelected);
  }

  if (values.skalUtsette) {
    const utsettelseperiodeValues = values ? values[utsettelsePeriodeFieldArrayName] : null;
    errors[utsettelsePeriodeFieldArrayName] = PermisjonUtsettelsePanel.validate(utsettelseperiodeValues, isEndringForeldrepenger);
  }

  if (values.skalGradere) {
    const graderingperiodeValues = values ? values[graderingPeriodeFieldArrayName] : null;
    errors[graderingPeriodeFieldArrayName] = PermisjonGraderingPanel.validate(graderingperiodeValues, isEndringForeldrepenger);
  }
  if (values.skalHaOpphold) {
    const oppholdPerioderValues = values ? values[oppholdPeriodeFieldArrayName] : null;
    errors[oppholdPeriodeFieldArrayName] = PermisjonOppholdPanel.validate(oppholdPerioderValues, isEndringForeldrepenger);
  }

  return errors;
};


PermisjonPanel.validate = (values, soknadData) => {
  const errors = {};
  errors[TIDSROM_PERMISJON_FORM_NAME_PREFIX] = {};
  const permisjonValues = values[TIDSROM_PERMISJON_FORM_NAME_PREFIX] || null;
  errors[TIDSROM_PERMISJON_FORM_NAME_PREFIX] = permisjonErrors(permisjonValues, soknadData);
  return errors;
};

PermisjonPanel.transformValues = (values) => {
  const permisjonValues = values[TIDSROM_PERMISJON_FORM_NAME_PREFIX];
  const newValues = permisjonValues;
  newValues[permisjonPeriodeFieldArrayName] = RenderPermisjonPeriodeFieldArray.transformValues(permisjonValues[permisjonPeriodeFieldArrayName]);
  return newValues;
};

PermisjonPanel.initialValues = {
  [TIDSROM_PERMISJON_FORM_NAME_PREFIX]: {
    ...PermisjonUtsettelsePanel.initialValues,
    ...PermisjonGraderingPanel.initialValues,
    ...PermisjonOverforingAvKvoterPanel.initialValues,
    ...PermisjonOppholdPanel.initialValues,
    [permisjonPeriodeFieldArrayName]: [{}],
  },
};


export default PermisjonPanel;
