import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { FieldArray, formValueSelector } from 'redux-form';

import { CheckboxField } from 'form/Fields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import {
  hasValidInteger, hasValidPeriodIncludingOtherErrors, maxLength, required,
} from 'utils/validation/validators';
import { isRequiredMessage } from 'utils/validation/messages';
import RenderUtsettelsePeriodeFieldArray from './RenderUtsettelsePeriodeFieldArray';


export const utsettelsePeriodeFieldArrayName = 'utsettelsePeriode';

const maxLength9 = maxLength(9);

/**
 *  PermisjonUtsettelsePanel
 *
 * Presentasjonskomponent: Viser panel for utsettelse
 * Komponenten har inputfelter og må derfor rendres som etterkommer av komponent dekorert med reduxForm.
 */
export const PermisjonUtsettelsePanel = ({
  utsettelseReasons,
  utsettelseKvoter,
  skalUtsette,
  readOnly,
}) => (
  <div>
    <Element><FormattedMessage id="Registrering.Permisjon.Utsettelse.Title" /></Element>
    <VerticalSpacer sixteenPx />
    <CheckboxField
      readOnly={readOnly}
      name="skalUtsette"
      label={<FormattedMessage id="Registrering.Permisjon.Utsettelse.UtsettUttaket" />}
    />
    { skalUtsette
      && (
      <FieldArray
        name={utsettelsePeriodeFieldArrayName}
        component={RenderUtsettelsePeriodeFieldArray}
        utsettelseReasons={utsettelseReasons}
        utsettelseKvoter={utsettelseKvoter}
        readOnly={readOnly}
      />
      )
    }
  </div>
);


PermisjonUtsettelsePanel.validate = (values) => {
  if (!values || !values.length) {
    return { _error: isRequiredMessage() };
  }
  const otherErrors = values.map(({
    periodeForUtsettelse, arsakForUtsettelse, orgNr, erArbeidstaker,
  }) => {
    const periodeForUtsettelseError = required(periodeForUtsettelse);
    const arsakForUtsettelseError = required(arsakForUtsettelse);
    const typeArbeidRequired = arsakForUtsettelse === 'ARBEID';
    const typeArbeidError = typeArbeidRequired && required(erArbeidstaker);
    const orgNrShouldBeRequired = erArbeidstaker === 'true' && typeArbeidRequired;
    const orgNrError = (orgNrShouldBeRequired && required(orgNr)) || hasValidInteger(orgNr) || maxLength9(orgNr);
    if (arsakForUtsettelseError || periodeForUtsettelseError || orgNrError) {
      return {
        erArbeidstaker: typeArbeidError,
        orgNr: orgNrError,
        periodeForUtsettelse: periodeForUtsettelseError,
        arsakForUtsettelse: arsakForUtsettelseError,
      };
    }
    return null;
  });

  return hasValidPeriodIncludingOtherErrors(values, otherErrors);
};

PermisjonUtsettelsePanel.propTypes = {
  utsettelseReasons: kodeverkPropType.isRequired,
  utsettelseKvoter: kodeverkPropType.isRequired,
  skalUtsette: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

PermisjonUtsettelsePanel.initialValues = {
  [utsettelsePeriodeFieldArrayName]: [{}],
  skalUtsette: false,
};

const mapStateToProps = (state, ownProps) => ({
  utsettelseReasons: getKodeverk(kodeverkTyper.UTSETTELSE_ARSAK)(state),
  utsettelseKvoter: getKodeverk(kodeverkTyper.UTSETTELSE_GRADERING_KVOTE)(state),
  skalUtsette: formValueSelector(ownProps.form)(state, ownProps.namePrefix).skalUtsette,
});

export default connect(mapStateToProps)(PermisjonUtsettelsePanel);
