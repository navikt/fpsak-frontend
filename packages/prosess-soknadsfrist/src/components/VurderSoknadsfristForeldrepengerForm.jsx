import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import moment from 'moment';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';
import {
  Element, Normaltekst, Undertekst, Undertittel,
} from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';

import {
  AksjonspunktHelpTextTemp, ArrowBox, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import {
  dateBeforeOrEqualToToday, DDMMYYYY_DATE_FORMAT, hasValidDate, required,
} from '@fpsak-frontend/utils';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  behandlingForm, behandlingFormValueSelector, hasBehandlingFormErrorsOfType, isBehandlingFormDirty,
  isBehandlingFormSubmitting, BehandlingspunktBegrunnelseTextField, BehandlingspunktSubmitButton,
} from '@fpsak-frontend/fp-felles';

import styles from './vurderSoknadsfristForeldrepengerForm.less';

const isEdited = (hasAksjonspunkt, gyldigSenFremsetting) => hasAksjonspunkt && gyldigSenFremsetting !== undefined;

/**
 * VurderSoknadsfristForeldrepengerForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for vurdering av søknadsfristvilkåret.
 */
export const VurderSoknadsfristForeldrepengerFormImpl = ({
  readOnly,
  readOnlySubmitButton,
  mottattDato,
  antallDagerSoknadLevertForSent,
  gyldigSenFremsetting,
  hasAksjonspunkt,
  soknadsperiodeStart,
  soknadsperiodeSlutt,
  soknadsfristdato,
  behandlingId,
  behandlingVersjon,
  isApOpen,
  ...formProps
}) => (
  <>
    <Undertittel><FormattedMessage id="VurderSoknadsfristForeldrepengerForm.Soknadsfrist" /></Undertittel>
    <VerticalSpacer twentyPx />
    <AksjonspunktHelpTextTemp isAksjonspunktOpen={isApOpen}>
      {[<FormattedMessage
        key="VurderSoknadsfristForeldrepengerForm"
        id="VurderSoknadsfristForeldrepengerForm.AksjonspunktHelpText"
        values={{
          numberOfDays: antallDagerSoknadLevertForSent,
          soknadsfristdato: moment(soknadsfristdato).format(DDMMYYYY_DATE_FORMAT),
        }}
      />]}
    </AksjonspunktHelpTextTemp>
    <VerticalSpacer twentyPx />
    <Row>
      <Column xs="6">
        <Panel className={styles.panel}>
          <Element><FormattedMessage id="VurderSoknadsfristForeldrepengerForm.Vurder" /></Element>
          <ul className={styles.hyphen}>
            <li><FormattedMessage id="VurderSoknadsfristForeldrepengerForm.Punkt1" /></li>
            <li><FormattedMessage id="VurderSoknadsfristForeldrepengerForm.Punkt2" /></li>
            <li><FormattedMessage id="VurderSoknadsfristForeldrepengerForm.Punkt3" /></li>
          </ul>
        </Panel>
      </Column>
      <Column xs="6">
        <Row className={styles.marginBottom}>
          <Column xs="6">
            <Undertekst><FormattedMessage id="VurderSoknadsfristForeldrepengerForm.SoknadMottatt" /></Undertekst>
            {mottattDato
              && <Normaltekst>{moment(mottattDato).format(DDMMYYYY_DATE_FORMAT)}</Normaltekst>}
          </Column>
          <Column xs="6">
            <Undertekst><FormattedMessage id="VurderSoknadsfristForeldrepengerForm.SoknadPeriode" /></Undertekst>
            <Normaltekst>
              {`${moment(soknadsperiodeStart).format(DDMMYYYY_DATE_FORMAT)} - ${moment(soknadsperiodeSlutt).format(DDMMYYYY_DATE_FORMAT)}`}
            </Normaltekst>
          </Column>
        </Row>
      </Column>
    </Row>
    <form className={styles.marginTop} onSubmit={formProps.handleSubmit}>
      <div>
        <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
        <div>
          <RadioGroupField name="gyldigSenFremsetting" validate={[required]} readOnly={readOnly} isEdited={isEdited(hasAksjonspunkt, gyldigSenFremsetting)}>
            <RadioOption value label={<FormattedMessage id="VurderSoknadsfristForeldrepengerForm.GyldigGrunn" />} />
            <RadioOption value={false} label={<FormattedMessage id="VurderSoknadsfristForeldrepengerForm.IkkeGyldigGrunn" />} />
          </RadioGroupField>
        </div>
        {gyldigSenFremsetting
          && (
            <Row>
              <Column xs="4">
                <ArrowBox>
                  <DatepickerField
                    name="ansesMottatt"
                    readOnly={readOnly}
                    label={{ id: 'VurderSoknadsfristForeldrepengerForm.NyMottattDato' }}
                    validate={[required, hasValidDate, dateBeforeOrEqualToToday]}
                  />
                </ArrowBox>
              </Column>
            </Row>
          )}
        <VerticalSpacer twentyPx />
        <BehandlingspunktSubmitButton
          formName={formProps.form}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isReadOnly={readOnly}
          isSubmittable={!readOnlySubmitButton}
          isBehandlingFormSubmitting={isBehandlingFormSubmitting}
          isBehandlingFormDirty={isBehandlingFormDirty}
          hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
        />
      </div>
    </form>
  </>
);

VurderSoknadsfristForeldrepengerFormImpl.propTypes = {
  readOnlySubmitButton: PropTypes.bool.isRequired,
  antallDagerSoknadLevertForSent: PropTypes.number,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  isApOpen: PropTypes.bool.isRequired,
  hasAksjonspunkt: PropTypes.bool,
  ...formPropTypes,
};

VurderSoknadsfristForeldrepengerFormImpl.defaultProps = {
  antallDagerSoknadLevertForSent: undefined,
  hasAksjonspunkt: false,
};

export const buildInitialValues = createSelector(
  [(state, ownProps) => ownProps.aksjonspunkter,
    (state, ownProps) => ownProps.uttakPeriodeGrense,
    (state, ownProps) => ownProps.mottattDato],
  (aksjonspunkter, uttaksperiodegrense, mottattDato) => ({
    gyldigSenFremsetting: isAksjonspunktOpen(aksjonspunkter[0].status.kode) ? undefined : uttaksperiodegrense.mottattDato !== mottattDato,
    ansesMottatt: uttaksperiodegrense.mottattDato,
    ...BehandlingspunktBegrunnelseTextField.buildInitialValues(aksjonspunkter),
  }),
);

const transformValues = (values, aksjonspunkter) => ({
  harGyldigGrunn: values.gyldigSenFremsetting,
  ansesMottattDato: values.ansesMottatt,
  kode: aksjonspunkter[0].definisjon.kode,
  ...BehandlingspunktBegrunnelseTextField.transformValues(values),
});

const formName = 'VurderSoknadsfristForeldrepengerForm';

const mapStateToPropsFactory = (initialState, staticOwnProps) => {
  const uttaksperiodegrense = staticOwnProps.uttakPeriodeGrense;
  const { aksjonspunkter } = staticOwnProps;
  const onSubmit = (values) => staticOwnProps.submitCallback([transformValues(values, aksjonspunkter)]);

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon } = ownProps;
    return {
      onSubmit,
      initialValues: buildInitialValues(state, ownProps),
      gyldigSenFremsetting: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'gyldigSenFremsetting'),
      antallDagerSoknadLevertForSent: uttaksperiodegrense ? uttaksperiodegrense.antallDagerLevertForSent : {},
      soknadsperiodeStart: uttaksperiodegrense ? uttaksperiodegrense.soknadsperiodeStart : {},
      soknadsperiodeSlutt: uttaksperiodegrense ? uttaksperiodegrense.soknadsperiodeSlutt : {},
      soknadsfristdato: uttaksperiodegrense ? uttaksperiodegrense.soknadsfristForForsteUttaksdato : {},
      hasAksjonspunkt: aksjonspunkter.length > 0,
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'gyldigSenFremsetting'),
    };
  };
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(VurderSoknadsfristForeldrepengerFormImpl));
