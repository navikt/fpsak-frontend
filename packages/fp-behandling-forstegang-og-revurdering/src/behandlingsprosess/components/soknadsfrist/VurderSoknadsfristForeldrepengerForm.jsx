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
  behandlingFormForstegangOgRevurdering, behandlingFormValueSelector, isBehandlingFormDirty, hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import { getBehandlingUttaksperiodegrense } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { BehandlingspunktBegrunnelseTextField, BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
  AksjonspunktHelpText, FadingPanel, VerticalSpacer, ArrowBox,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import {
  DDMMYYYY_DATE_FORMAT, dateBeforeOrEqualToToday, hasValidDate, required,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

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
  soknad,
  antallDagerSoknadLevertForSent,
  gyldigSenFremsetting,
  hasAksjonspunkt,
  soknadsperiodeStart,
  soknadsperiodeSlutt,
  soknadsfristdato,
  isApOpen,
  ...formProps
}) => (
  <FadingPanel>
    <Undertittel><FormattedMessage id="ErSoknadsfristVilkaretOppfyltForm.Soknadsfrist" /></Undertittel>
    <VerticalSpacer twentyPx />
    <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
      {[<FormattedMessage
        key="VurderSoknadsfristForeldrepengerForm"
        id="VurderSoknadsfristForeldrepengerForm.AksjonspunktHelpText"
        values={{
          numberOfDays: antallDagerSoknadLevertForSent,
          soknadsfristdato: moment(soknadsfristdato).format(DDMMYYYY_DATE_FORMAT),
        }}
      />]}
    </AksjonspunktHelpText>
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
            {soknad.mottattDato
              && <Normaltekst>{moment(soknad.mottattDato).format(DDMMYYYY_DATE_FORMAT)}</Normaltekst>}
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
          isReadOnly={readOnly}
          isSubmittable={!readOnlySubmitButton}
          isBehandlingFormSubmitting={isBehandlingFormSubmitting}
          isBehandlingFormDirty={isBehandlingFormDirty}
          hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
        />
      </div>
    </form>
  </FadingPanel>
);

VurderSoknadsfristForeldrepengerFormImpl.propTypes = {
  readOnlySubmitButton: PropTypes.bool.isRequired,
  antallDagerSoknadLevertForSent: PropTypes.number,
  isApOpen: PropTypes.bool.isRequired,
  hasAksjonspunkt: PropTypes.bool,
  ...formPropTypes,
};

VurderSoknadsfristForeldrepengerFormImpl.defaultProps = {
  antallDagerSoknadLevertForSent: undefined,
  hasAksjonspunkt: false,
};

export const buildInitialValues = createSelector(
  [behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter, getBehandlingUttaksperiodegrense, behandlingSelectors.getSoknad],
  (aksjonspunkter, uttaksperiodegrense, soknad) => ({
    gyldigSenFremsetting: isAksjonspunktOpen(aksjonspunkter[0].status.kode) ? undefined : uttaksperiodegrense.mottattDato !== soknad.mottattDato,
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

const mapStateToPropsFactory = (initialState, ownProps) => {
  const uttaksperiodegrense = getBehandlingUttaksperiodegrense(initialState);
  const aksjonspunkter = behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(initialState);
  const onSubmit = (values) => ownProps.submitCallback([transformValues(values, aksjonspunkter)]);

  return (state) => ({
    onSubmit,
    initialValues: buildInitialValues(state),
    soknad: behandlingSelectors.getSoknad(state),
    gyldigSenFremsetting: behandlingFormValueSelector('VurderSoknadsfristForeldrepengerForm')(state, 'gyldigSenFremsetting'),
    antallDagerSoknadLevertForSent: uttaksperiodegrense ? uttaksperiodegrense.antallDagerLevertForSent : {},
    soknadsperiodeStart: uttaksperiodegrense ? uttaksperiodegrense.soknadsperiodeStart : {},
    soknadsperiodeSlutt: uttaksperiodegrense ? uttaksperiodegrense.soknadsperiodeSlutt : {},
    soknadsfristdato: uttaksperiodegrense ? uttaksperiodegrense.soknadsfristForForsteUttaksdato : {},
    hasAksjonspunkt: aksjonspunkter.length > 0,
    ...behandlingFormValueSelector(formName)(state, 'gyldigSenFremsetting'),
  });
};

const VurderSoknadsfristForeldrepengerForm = connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
  form: formName,
})(VurderSoknadsfristForeldrepengerFormImpl));

VurderSoknadsfristForeldrepengerForm.supports = (apCodes) => apCodes.includes(aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER);

export default VurderSoknadsfristForeldrepengerForm;
