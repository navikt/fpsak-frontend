import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { FieldArray, formPropTypes } from 'redux-form';

import { AksjonspunktHelpTextTemp, VerticalSpacer, FaktaGruppe } from '@fpsak-frontend/shared-components';
import { FaktaSubmitButton } from '@fpsak-frontend/fakta-felles';
import {
  hasValidDate, hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import { DatepickerField, TextAreaField, behandlingForm } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

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
  intl,
  hasAksjonspunkt,
  hasOpenAksjonspunkt,
  hasOpenMedlemskapAksjonspunkter,
  submittable,
  overstyringDisabled,
  readOnly,
  alleMerknaderFraBeslutter,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => (
  <div className={hasOpenAksjonspunkt || !hasOpenMedlemskapAksjonspunkter ? undefined : styles.inactiveAksjonspunkt}>
    <form className={hasOpenAksjonspunkt || !hasOpenMedlemskapAksjonspunkter ? undefined : styles.container} onSubmit={formProps.handleSubmit}>
      {hasAksjonspunkt && (
        <AksjonspunktHelpTextTemp isAksjonspunktOpen={submittable && hasOpenAksjonspunkt}>
          {[<FormattedMessage key="PeriodenAvviker" id="StartdatoForForeldrepengerperiodenForm.PeriodenAvviker" />]}
        </AksjonspunktHelpTextTemp>
      )}
      <FaktaGruppe
        aksjonspunktCode={aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN}
        titleCode="StartdatoForForeldrepengerperiodenForm.StartdatoForPerioden"
        merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN]}
      >
        <div className={styles.explanationTextarea}>
          <TextAreaField
            name="begrunnelse"
            label={<FormattedMessage id="StartdatoForForeldrepengerperiodenForm.Vurdering" />}
            validate={[required, minLength3, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly && overstyringDisabled}
          />
        </div>
        <VerticalSpacer sixteenPx />
        <Row>
          <Column xs="4">
            <DatepickerField
              name="startdatoFraSoknad"
              isEdited={hasAksjonspunkt && !hasOpenAksjonspunkt}
              label={{ id: 'StartdatoForForeldrepengerperiodenForm.Startdato' }}
              validate={[required, hasValidDate]}
              readOnly={readOnly && overstyringDisabled}
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
      <FaktaSubmitButton
        buttonText={!hasOpenAksjonspunkt ? intl.formatMessage({ id: 'StartdatoForForeldrepengerperiodenForm.Oppdater' }) : undefined}
        formName={formProps.form}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        isSubmittable={submittable}
        isReadOnly={readOnly && overstyringDisabled}
        hasOpenAksjonspunkter={hasOpenAksjonspunkt}
      />
    </form>
  </div>
);

StartdatoForForeldrepengerperiodenForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  hasAksjonspunkt: PropTypes.bool.isRequired,
  hasOpenAksjonspunkt: PropTypes.bool.isRequired,
  hasOpenMedlemskapAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  overstyringDisabled: PropTypes.bool,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  ...formPropTypes,
};

const buildInitialValues = createSelector(
  [(ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.soknad.oppgittFordeling,
    (ownProps) => ownProps.inntektArbeidYtelse],
  (aksjonspunkter, oppgittFordeling = {}, inntektArbeidYtelse = {}) => {
    const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
    const overstyringAp = aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO);
    return {
      opprinneligDato: oppgittFordeling.startDatoForPermisjon,
      startdatoFraSoknad: oppgittFordeling.startDatoForPermisjon,
      arbeidsgivere: inntektArbeidYtelse.inntektsmeldinger,
      begrunnelse: (overstyringAp && overstyringAp.begrunnelse) || (aksjonspunkt && aksjonspunkt.begrunnelse),
    };
  },
);

const transformValues = (values, isOverstyring) => ({
  kode: isOverstyring ? aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO : aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
  opprinneligDato: values.opprinneligDato,
  startdatoFraSoknad: values.startdatoFraSoknad,
  begrunnelse: values.begrunnelse,
});

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const { aksjonspunkt, submitCallback } = initialOwnProps;
  const hasAksjonspunkt = aksjonspunkt !== undefined;
  const isOverstyring = !hasAksjonspunkt || aksjonspunkt.definisjon.kode === aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO;
  const hasOpenAksjonspunkt = hasAksjonspunkt && isAksjonspunktOpen(aksjonspunkt.status.kode);
  const onSubmit = (values) => submitCallback([transformValues(values, isOverstyring)]);
  return (state, ownProps) => ({
    hasAksjonspunkt,
    hasOpenAksjonspunkt,
    onSubmit,
    overstyringDisabled: ownProps.readOnlyBehandling || ownProps.behandlingStatus.kode !== behandlingStatus.BEHANDLING_UTREDES,
    initialValues: buildInitialValues(ownProps),
  });
};

const isBefore2019 = (startdato) => (
  moment(startdato).isBefore(moment('2019-01-01'))
);

const validateDates = (values) => {
  const errors = {};
  if (!values) {
    return errors;
  }
  const { arbeidsgivere, startdatoFraSoknad } = values;

  const isStartdatoEtterArbeidsgiverdato = arbeidsgivere && arbeidsgivere
    .map((a) => a.arbeidsgiverStartdato)
    .some((datoFraInntektsmelding) => moment(datoFraInntektsmelding).isBefore(moment(startdatoFraSoknad)));

  if (isStartdatoEtterArbeidsgiverdato) {
    errors.startdatoFraSoknad = [{ id: 'StartdatoForForeldrepengerperiodenForm.StartdatoEtterArbeidsgiverdato' }];
  } else if (isBefore2019(startdatoFraSoknad)) {
    errors.startdatoFraSoknad = [{ id: 'StartdatoForForeldrepengerperiodenForm.StartdatoFør2019' }];
  }

  return errors;
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: 'StartdatoForForeldrepengerperiodenForm',
  validate: validateDates,
})(injectIntl(StartdatoForForeldrepengerperiodenForm)));
