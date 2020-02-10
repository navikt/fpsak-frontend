import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import { DDMMYYYY_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import {
  AksjonspunktHelpTextTemp, ArrowBox, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  behandlingForm, behandlingFormValueSelector, hasBehandlingFormErrorsOfType, isBehandlingFormDirty,
  isBehandlingFormSubmitting, getKodeverknavnFn, BehandlingspunktBegrunnelseTextField, BehandlingspunktSubmitButton,
} from '@fpsak-frontend/fp-felles';

import styles from './checkPersonStatusForm.less';

/**
 * CheckPersonStatusForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for kontroll av personstatus.
 */
export const CheckPersonStatusFormImpl = ({
  intl,
  behandlingId,
  behandlingVersjon,
  readOnly,
  readOnlySubmitButton,
  fortsettBehandling,
  originalPersonstatusName,
  personStatuser,
  gjeldeneFom,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <Undertittel>{intl.formatMessage({ id: 'CheckPersonStatusForm.CheckInformation' })}</Undertittel>
    <VerticalSpacer twentyPx />
    <AksjonspunktHelpTextTemp isAksjonspunktOpen={!readOnlySubmitButton && !readOnly}>
      {[intl.formatMessage({ id: 'CheckPersonStatusForm.PersonStatus' }, { status: originalPersonstatusName })]}
    </AksjonspunktHelpTextTemp>
    <VerticalSpacer twentyPx />
    { gjeldeneFom && (
      <Normaltekst>
        <FormattedMessage
          id="CheckPersonStatusForm.GjeldendeFom"
          values={{ dato: moment(gjeldeneFom).format(DDMMYYYY_DATE_FORMAT) }}
        />
      </Normaltekst>
    )}
    <VerticalSpacer twentyPx />
    <div className={styles.radioGroup}>
      <Row>
        <Column xs="12">
          <RadioGroupField name="fortsettBehandling" validate={[required]} readOnly={readOnly}>
            <RadioOption label={{ id: 'CheckPersonStatusForm.HaltBehandling' }} value={false} />
            <RadioOption label={{ id: 'CheckPersonStatusForm.ContinueBehandling' }} value />
          </RadioGroupField>
        </Column>
      </Row>
      {(fortsettBehandling === true) && (
        <ArrowBox alignOffset={readOnly ? 0 : 198}>
          <Undertekst>{intl.formatMessage({ id: 'CheckPersonStatusForm.SetPersonStatus' })}</Undertekst>
          <VerticalSpacer eightPx />
          <RadioGroupField name="personstatus" validate={[required]} readOnly={readOnly}>
            {personStatuser.map((d) => (
              <RadioOption key={d.kode} value={d.kode} label={d.navn} />
            ))}
          </RadioGroupField>
        </ArrowBox>
      )}
    </div>
    <VerticalSpacer sixteenPx />
    <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
    <VerticalSpacer sixteenPx />
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
  </form>
);

CheckPersonStatusFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  /**
   * Skal input-felter vises eller ikke
   */
  readOnly: PropTypes.bool.isRequired,
  /**
   * Skal knapp for å bekrefte data være trykkbar
   */
  readOnlySubmitButton: PropTypes.bool.isRequired,
  gjeldeneFom: PropTypes.string,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  ...formPropTypes,
};

CheckPersonStatusFormImpl.defaultProps = {
  gjeldeneFom: undefined,
};

const getValgtOpplysning = (avklartPersonstatus) => {
  if (avklartPersonstatus && avklartPersonstatus.overstyrtPersonstatus) {
    const statusKode = avklartPersonstatus.overstyrtPersonstatus.kode;
    if (statusKode === personstatusType.DOD || statusKode === personstatusType.BOSATT || statusKode === personstatusType.UTVANDRET) {
      return statusKode;
    }
  }
  return undefined;
};

export const buildInitialValues = createSelector(
  [(state, ownProps) => ownProps.behandlingHenlagt,
    (state, ownProps) => ownProps.aksjonspunkter,
    (state, ownProps) => ownProps.personopplysninger,
    (state, ownProps) => ownProps.alleKodeverk],
  (behandlingHenlagt, aksjonspunkter, personopplysning, alleKodeverk) => {
    const shouldContinueBehandling = !behandlingHenlagt;
    const { avklartPersonstatus, personstatus } = personopplysning;
    const aksjonspunkt = aksjonspunkter[0];
    const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
    return {
      originalPersonstatusName: avklartPersonstatus && avklartPersonstatus.orginalPersonstatus
        ? getKodeverknavn(avklartPersonstatus.orginalPersonstatus) : getKodeverknavn(personstatus),
      fortsettBehandling: isAksjonspunktOpen(aksjonspunkt.status.kode) ? undefined : shouldContinueBehandling,
      personstatus: getValgtOpplysning(avklartPersonstatus),
      ...BehandlingspunktBegrunnelseTextField.buildInitialValues(aksjonspunkter),
    };
  },
);

const getFilteredKodeverk = createSelector(
  [(state, ownProps) => ownProps.alleKodeverk[kodeverkTyper.PERSONSTATUS_TYPE]], (kodeverk) => kodeverk
    .filter((ps) => ps.kode === personstatusType.DOD || ps.kode === personstatusType.BOSATT || ps.kode === personstatusType.UTVANDRET),
);

const transformValues = (values, aksjonspunkter) => ({
  fortsettBehandling: values.fortsettBehandling,
  personstatus: values.personstatus,
  kode: aksjonspunkter[0].definisjon.kode,
  ...BehandlingspunktBegrunnelseTextField.transformValues(values),
});

const formName = 'CheckPersonStatusForm';

const mapStateToPropsFactory = (initialState, staticOwnProps) => {
  const onSubmit = (values) => staticOwnProps.submitCallback([transformValues(values, staticOwnProps.aksjonspunkter)]);
  const personStatuser = getFilteredKodeverk(initialState, staticOwnProps);
  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon } = ownProps;
    return {
      initialValues: buildInitialValues(state, ownProps),
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'fortsettBehandling', 'originalPersonstatusName'),
      personStatuser,
      onSubmit,
    };
  };
};

const CheckPersonStatusForm = connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: formName,
})(CheckPersonStatusFormImpl)));

export default CheckPersonStatusForm;
