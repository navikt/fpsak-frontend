import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import { formPropTypes, FieldArray } from 'redux-form';

import FaktaSubmitButton from 'fakta/components/FaktaSubmitButton';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getSoknad, getInntektsmeldinger, getAksjonspunkter } from 'behandling/behandlingSelectors';
import { behandlingForm } from 'behandling/behandlingForm';
import {
  required, hasValidDate, minLength, maxLength, hasValidText,
} from 'utils/validation/validators';
import { TextAreaField, DatepickerField } from 'form/Fields';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import ArbeidsgiverInfo from './ArbeidsgiverInfo';


import styles from './startdatoForForeldrepengerperiodenForm.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

/**
 * StartdatoForForeldrepengerperiodenForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for vurdering av om startdato for foreldrepengerperioden er korrekt.
 */
export const StartdatoForForeldrepengerperiodenForm = ({
  hasOpenAksjonspunkt,
  hasOpenMedlemskapAksjonspunkter,
  submittable,
  readOnly,
  ...formProps
}) => (
  <div className={hasOpenAksjonspunkt || !hasOpenMedlemskapAksjonspunkter ? undefined : styles.inactiveAksjonspunkt}>
    <form className={hasOpenAksjonspunkt || !hasOpenMedlemskapAksjonspunkter ? undefined : styles.container} onSubmit={formProps.handleSubmit}>
      <AksjonspunktHelpText isAksjonspunktOpen={submittable && hasOpenAksjonspunkt}>
        {[<FormattedMessage key="PeriodenAvviker" id="StartdatoForForeldrepengerperiodenForm.PeriodenAvviker" />]}
      </AksjonspunktHelpText>
      <FaktaGruppe
        aksjonspunktCode={aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN}
        titleCode="StartdatoForForeldrepengerperiodenForm.StartdatoForPerioden"
      >
        <div className={styles.explanationTextarea}>
          <TextAreaField
            name="begrunnelse"
            label={<FormattedMessage id="StartdatoForForeldrepengerperiodenForm.Vurdering" />}
            validate={[required, minLength3, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </div>
        <Row>
          <Column xs="4">
            <DatepickerField
              name="startdatoFraSoknad"
              label={{ id: 'StartdatoForForeldrepengerperiodenForm.Startdato' }}
              validate={[required, hasValidDate]}
              readOnly={readOnly}
            />
          </Column>
          {/* do not touch this xs-value. react-collapse in chrome 90% update error */}
          <Column xs="6">
            <FieldArray
              component={ArbeidsgiverInfo}
              name="arbeidsgivere"
            />
          </Column>
        </Row>
      </FaktaGruppe>
      <VerticalSpacer twentyPx />
      <FaktaSubmitButton formName={formProps.form} isSubmittable={submittable} isReadOnly={readOnly} hasOpenAksjonspunkter={hasOpenAksjonspunkt} />
    </form>
  </div>
);

StartdatoForForeldrepengerperiodenForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkt: PropTypes.bool.isRequired,
  hasOpenMedlemskapAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  ...formPropTypes,
};

const buildInitialValues = createSelector(
  [getAksjonspunkter, getSoknad, getInntektsmeldinger],
  (aksjonspunkter, soknad, inntektsmeldinger) => ({
    startdatoFraSoknad: soknad.oppgittFordeling.startDatoForPermisjon,
    arbeidsgivere: inntektsmeldinger,
    begrunnelse: aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN).begrunnelse,
  }),
);

const transformValues = values => ({
  kode: aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
  startdatoFraSoknad: values.startdatoFraSoknad,
  begrunnelse: values.begrunnelse,
});

const mapStateToProps = (state, initialProps) => ({
  hasOpenAksjonspunkt: isAksjonspunktOpen(initialProps.aksjonspunkt.status.kode),
  initialValues: buildInitialValues(state),
  onSubmit: values => initialProps.submitCallback([transformValues(values)]),
});

export default connect(mapStateToProps)(behandlingForm({
  form: 'StartdatoForForeldrepengerperiodenForm',
})(StartdatoForForeldrepengerperiodenForm));
