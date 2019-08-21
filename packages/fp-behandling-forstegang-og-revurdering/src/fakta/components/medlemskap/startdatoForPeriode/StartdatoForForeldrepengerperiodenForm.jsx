import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import { FieldArray, formPropTypes } from 'redux-form';

import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { Hovedknapp } from 'nav-frontend-knapper';
import {
  getInntektsmeldinger,
  getBehandlingStartDatoForPermisjon,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
 hasValidDate, hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
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
  [behandlingSelectors.getAksjonspunkter, getBehandlingStartDatoForPermisjon, getInntektsmeldinger],
  (aksjonspunkter, startdatoForPermisjon, inntektsmeldinger) => {
  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);
  const overstyringAp = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO);
    return {
    opprinneligDato: startdatoForPermisjon,
    startdatoFraSoknad: startdatoForPermisjon,
    arbeidsgivere: inntektsmeldinger,
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

const mapStateToPropsFactory = (initialState, ownProps) => {
  const hasAksjonspunkt = ownProps.aksjonspunkt !== undefined;
  const hasOpenAksjonspunkt = hasAksjonspunkt && isAksjonspunktOpen(ownProps.aksjonspunkt.status.kode);
  const isOverstyring = !hasAksjonspunkt || ownProps.aksjonspunkt.definisjon.kode === aksjonspunktCodes.OVERSTYR_AVKLAR_STARTDATO;
  const onSubmit = values => ownProps.submitCallback([transformValues(values, isOverstyring)]);

  return state => ({
    hasAksjonspunkt,
    hasOpenAksjonspunkt,
    overstyringDisabled: behandlingSelectors.getBehandlingIsOnHold(state) || behandlingSelectors.hasReadOnlyBehandling(state),
    initialValues: buildInitialValues(state),
    onSubmit,
  });
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

export default connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
  form: 'StartdatoForForeldrepengerperiodenForm',
  validate: validateDates,
})(StartdatoForForeldrepengerperiodenForm));
