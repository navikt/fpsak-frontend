import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';
import { formPropTypes, FieldArray } from 'redux-form';

import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { Hovedknapp } from 'nav-frontend-knapper';
import {
  getSoknad, getInntektsmeldinger, getAksjonspunkter, getBehandlingIsOnHold, hasReadOnlyBehandling,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { VerticalSpacer, AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import {
  required, hasValidDate, minLength, maxLength, hasValidText,
} from '@fpsak-frontend/utils';
import { TextAreaField, DatepickerField } from '@fpsak-frontend/form';
import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
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
  hasAksjonspunkt,
  hasOpenAksjonspunkt,
  hasOpenMedlemskapAksjonspunkter,
  submittable,
  overstyringDisabled,
  readOnly,
  ...formProps
}) => (
  <div className={hasOpenAksjonspunkt || !hasOpenMedlemskapAksjonspunkter ? undefined : styles.inactiveAksjonspunkt}>
    <form className={hasOpenAksjonspunkt || !hasOpenMedlemskapAksjonspunkter ? undefined : styles.container} onSubmit={formProps.handleSubmit}>
      {hasAksjonspunkt
        && (
        <AksjonspunktHelpText isAksjonspunktOpen={submittable && hasOpenAksjonspunkt}>
          {[<FormattedMessage key="PeriodenAvviker" id="StartdatoForForeldrepengerperiodenForm.PeriodenAvviker" />]}
        </AksjonspunktHelpText>
        )
      }
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
            readOnly={readOnly && overstyringDisabled}
          />
        </div>
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
        {!hasOpenAksjonspunkt
        && (
          <div>
            <VerticalSpacer twentyPx />
            <Hovedknapp
              mini
              htmlType="submit"
              spinner={formProps.submitting}
              onClick={formProps.handleSubmit}
              disabled={formProps.submitting || formProps.pristine}
              readOnly={overstyringDisabled}
            >
              <FormattedMessage id="StartdatoForForeldrepengerperiodenForm.Oppdater" />
            </Hovedknapp>
          </div>
        )
        }
      </FaktaGruppe>
      <VerticalSpacer twentyPx />
      {hasOpenAksjonspunkt
        && (
        <FaktaSubmitButton formName={formProps.form} isSubmittable={submittable} isReadOnly={readOnly} hasOpenAksjonspunkter={hasOpenAksjonspunkt} />
        )
      }
    </form>
  </div>
);

StartdatoForForeldrepengerperiodenForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasAksjonspunkt: PropTypes.bool.isRequired,
  hasOpenAksjonspunkt: PropTypes.bool.isRequired,
  hasOpenMedlemskapAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  overstyringDisabled: PropTypes.bool,
  ...formPropTypes,
};

const buildInitialValues = createSelector(
  [getAksjonspunkter, getSoknad, getInntektsmeldinger],
  (aksjonspunkter, soknad, inntektsmeldinger) => {
  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
  const overstyringAp = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO);
  const initialValues = {
    opprinneligDato: soknad.oppgittFordeling.startDatoForPermisjon,
    startdatoFraSoknad: soknad.oppgittFordeling.startDatoForPermisjon,
    arbeidsgivere: inntektsmeldinger,
    begrunnelse: (overstyringAp && overstyringAp.begrunnelse) || (aksjonspunkt && aksjonspunkt.begrunnelse),
  };
  return initialValues;
  },
);

const transformValues = (values, isOverstyring) => ({
  kode: isOverstyring ? aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO : aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN,
  opprinneligDato: values.opprinneligDato,
  startdatoFraSoknad: values.startdatoFraSoknad,
  begrunnelse: values.begrunnelse,
});

const mapStateToProps = (state, initialProps) => {
  const hasAksjonspunkt = initialProps.aksjonspunkt !== undefined;
  const hasOpenAksjonspunkt = hasAksjonspunkt && isAksjonspunktOpen(initialProps.aksjonspunkt.status.kode);
  return {
    hasAksjonspunkt,
    hasOpenAksjonspunkt,
    overstyringDisabled: getBehandlingIsOnHold(state) || hasReadOnlyBehandling(state),
    initialValues: buildInitialValues(state),
    onSubmit: values => initialProps.submitCallback([transformValues(values, !hasOpenAksjonspunkt)]),
  };
};

const isBefore2019 = startdato => (
  moment(startdato).isBefore(moment('2019-01-01'))
);

const validateDates = (values) => {
  const errors = {};
  const { arbeidsgivere, startdatoFraSoknad } = values;

  const isStartdatoEtterArbeidsgiverdato = arbeidsgivere && arbeidsgivere
    .map(a => a.arbeidsgiverStartdato)
    .some(datoFraInntektsmelding => moment(datoFraInntektsmelding).isBefore(moment(startdatoFraSoknad)));

  if (isStartdatoEtterArbeidsgiverdato) {
    errors.startdatoFraSoknad = [{ id: 'StartdatoForForeldrepengerperiodenForm.StartdatoEtterArbeidsgiverdato' }];
  } else if (isBefore2019(startdatoFraSoknad)) {
    errors.startdatoFraSoknad = [{ id: 'StartdatoForForeldrepengerperiodenForm.StartdatoFør2019' }];
  }

  return errors;
};

export default connect(mapStateToProps)(behandlingForm({
  form: 'StartdatoForForeldrepengerperiodenForm',
  validate: validateDates,
})(StartdatoForForeldrepengerperiodenForm));
