import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import { DDMMYYYY_DATE_FORMAT, required } from '@fpsak-frontend/utils';
import { getBehandlingRevurderingAvFortsattMedlemskapFom, getPersonopplysning } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import {
  behandlingFormForstegangOgRevurdering,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { BehandlingspunktBegrunnelseTextField, BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import { getAlleKodeverk, getKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import {
  AksjonspunktHelpText, ArrowBox, FadingPanel, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';

import styles from './checkPersonStatusForm.less';

/**
 * CheckPersonStatusForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for kontroll av personstatus.
 */
export const CheckPersonStatusFormImpl = ({
  intl,
  readOnly,
  readOnlySubmitButton,
  fortsettBehandling,
  originalPersonstatusName,
  personStatuser,
  gjeldeneFom,
  ...formProps
}) => (
  <FadingPanel>
    <form onSubmit={formProps.handleSubmit}>
      <Undertittel>{intl.formatMessage({ id: 'CheckPersonStatusForm.CheckInformation' })}</Undertittel>
      <VerticalSpacer twentyPx />
      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton && !readOnly}>
        {[intl.formatMessage({ id: 'CheckPersonStatusForm.PersonStatus' }, { status: originalPersonstatusName })]}
      </AksjonspunktHelpText>
      <VerticalSpacer twentyPx />
      { gjeldeneFom
        && (
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
        {(fortsettBehandling === true)
          && (
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
      <BehandlingspunktSubmitButton
        formName={formProps.form}
        isReadOnly={readOnly}
        isSubmittable={!readOnlySubmitButton}
        isBehandlingFormSubmitting={isBehandlingFormSubmitting}
        isBehandlingFormDirty={isBehandlingFormDirty}
        hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
      />
    </form>
  </FadingPanel>
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
  gjeldeneFom: PropTypes.string.isRequired,
  ...formPropTypes,
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
  [behandlingSelectors.getBehandlingHenlagt, behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter, getPersonopplysning, getAlleKodeverk],
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
  [getKodeverk(kodeverkTyper.PERSONSTATUS_TYPE)], (kodeverk) => kodeverk
    .filter((ps) => ps.kode === personstatusType.DOD || ps.kode === personstatusType.BOSATT || ps.kode === personstatusType.UTVANDRET),
);

const transformValues = (values, aksjonspunkter) => ({
  fortsettBehandling: values.fortsettBehandling,
  personstatus: values.personstatus,
  kode: aksjonspunkter[0].definisjon.kode,
  ...BehandlingspunktBegrunnelseTextField.transformValues(values),
});

const formName = 'CheckPersonStatusForm';

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = (values) => ownProps.submitCallback([transformValues(values,
    behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(initialState))]);
  const personStatuser = getFilteredKodeverk(initialState);
  return (state) => ({
    initialValues: buildInitialValues(state),
    ...behandlingFormValueSelector(formName)(state, 'fortsettBehandling', 'originalPersonstatusName'),
    gjeldeneFom: getBehandlingRevurderingAvFortsattMedlemskapFom(state),
    personStatuser,
    onSubmit,
  });
};

const CheckPersonStatusForm = connect(mapStateToPropsFactory)(injectIntl(behandlingFormForstegangOgRevurdering({
  form: formName,
})(CheckPersonStatusFormImpl)));

CheckPersonStatusForm.supports = (apCodes) => apCodes.includes(aksjonspunktCodes.AVKLAR_PERSONSTATUS);

export default CheckPersonStatusForm;
