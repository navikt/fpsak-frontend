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

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import FadingPanel from 'sharedComponents/FadingPanel';
import { DDMMYYYY_DATE_FORMAT } from 'utils/formats';
import { DatepickerField, RadioGroupField, RadioOption } from 'form/Fields';
import { dateBeforeOrEqualToToday, hasValidDate, required } from 'utils/validation/validators';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingsprosess/behandlingsprosessSelectors';
import { getSoknad, getBehandlingUttaksperiodegrense } from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';
import BehandlingspunktSubmitButton from 'behandlingsprosess/components/BehandlingspunktSubmitButton';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';

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
              && <Normaltekst>{moment(soknad.mottattDato).format(DDMMYYYY_DATE_FORMAT)}</Normaltekst>
            }
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
          <div className={styles.arrowBoxWrapper}>
            <div className={styles.arrowBox}>
              <DatepickerField
                name="ansesMottatt"
                readOnly={readOnly}
                label={{ id: 'VurderSoknadsfristForeldrepengerForm.NyMottattDato' }}
                validate={[required, hasValidDate, dateBeforeOrEqualToToday]}
              />
            </div>
          </div>
          )
        }
        <BehandlingspunktSubmitButton formName={formProps.form} isReadOnly={readOnly} isSubmittable={!readOnlySubmitButton} />
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
  [getSelectedBehandlingspunktAksjonspunkter, getBehandlingUttaksperiodegrense, getSoknad],
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

const mapStateToProps = (state, ownProps) => {
  const uttaksperiodegrense = getBehandlingUttaksperiodegrense(state);
  const aksjonspunkter = getSelectedBehandlingspunktAksjonspunkter(state);
  return {
    initialValues: buildInitialValues(state),
    onSubmit: values => ownProps.submitCallback([transformValues(values, aksjonspunkter)]),
    soknad: getSoknad(state),
    gyldigSenFremsetting: behandlingFormValueSelector('VurderSoknadsfristForeldrepengerForm')(state, 'gyldigSenFremsetting'),
    antallDagerSoknadLevertForSent: uttaksperiodegrense ? uttaksperiodegrense.antallDagerLevertForSent : {},
    soknadsperiodeStart: uttaksperiodegrense ? uttaksperiodegrense.soknadsperiodeStart : {},
    soknadsperiodeSlutt: uttaksperiodegrense ? uttaksperiodegrense.soknadsperiodeSlutt : {},
    soknadsfristdato: uttaksperiodegrense ? uttaksperiodegrense.soknadsfristForForsteUttaksdato : {},
    hasAksjonspunkt: aksjonspunkter.length > 0,
    ...behandlingFormValueSelector(formName)(state, 'gyldigSenFremsetting'),
  };
};

const VurderSoknadsfristForeldrepengerForm = connect(mapStateToProps)(behandlingForm({
  form: formName,
})(VurderSoknadsfristForeldrepengerFormImpl));

VurderSoknadsfristForeldrepengerForm.supports = apCodes => apCodes.includes(aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER);

export default VurderSoknadsfristForeldrepengerForm;
