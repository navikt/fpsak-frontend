import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import FadingPanel from '@fpsak-frontend/shared-components/FadingPanel';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/formats';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingsprosess/behandlingsprosessSelectors';
import { getBehandlingStatus, getPersonopplysning, getBehandlingRevurderingAvFortsattMedlemskapFom } from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import personstatusType from 'kodeverk/personstatusType';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import { required } from '@fpsak-frontend/utils/validation/validators';
import behandlingStatus from 'kodeverk/behandlingStatus';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import AksjonspunktHelpText from '@fpsak-frontend/shared-components/AksjonspunktHelpText';
import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';
import BehandlingspunktSubmitButton from 'behandlingsprosess/components/BehandlingspunktSubmitButton';

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
  initialValues,
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
        )
      }
      <VerticalSpacer twentyPx />
      <div className={styles.radioGroup}>
        <Row>
          <Column xs="5">
            <RadioGroupField name="fortsettBehandling" validate={[required]} readOnly={readOnly}>
              <RadioOption label={{ id: 'CheckPersonStatusForm.HaltBehandling' }} value={false} />
              <RadioOption label={{ id: 'CheckPersonStatusForm.ContinueBehandling' }} value />
            </RadioGroupField>
          </Column>
        </Row>
        {(fortsettBehandling === true)
          && (
          <div className={readOnly ? styles.arrowLineReadOnly : styles.arrowLine}>
            <Undertekst>{intl.formatMessage({ id: 'CheckPersonStatusForm.SetPersonStatus' })}</Undertekst>
            <VerticalSpacer eightPx />
            <RadioGroupField name="personstatus" validate={[required]} readOnly={readOnly}>
              {personStatuser.sort(p1 => (p1.kode === personstatusType.DOD ? 1 : -1)).map(d => (
                <RadioOption key={d.kode} value={d.kode} label={d.navn} />
              ))}
            </RadioGroupField>
          </div>
          )
        }
      </div>
      <VerticalSpacer sixteenPx />
      <BehandlingspunktBegrunnelseTextField readOnly={readOnly} />
      <BehandlingspunktSubmitButton formName={formProps.form} isReadOnly={readOnly} isSubmittable={!readOnlySubmitButton} />
    </form>
  </FadingPanel>
);

CheckPersonStatusFormImpl.propTypes = {
  intl: intlShape.isRequired,
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
  [getBehandlingStatus, getSelectedBehandlingspunktAksjonspunkter, getPersonopplysning],
  (status, aksjonspunkter, personopplysning) => {
    const shouldContinueBehandling = status.kode !== behandlingStatus.AVSLUTTET;
    const { avklartPersonstatus, personstatus } = personopplysning;
    const aksjonspunkt = aksjonspunkter[0];
    return {
      originalPersonstatusName: avklartPersonstatus && avklartPersonstatus.orginalPersonstatus
        ? avklartPersonstatus.orginalPersonstatus.navn : personstatus.navn,
      fortsettBehandling: isAksjonspunktOpen(aksjonspunkt.status.kode) ? undefined : shouldContinueBehandling,
      personstatus: getValgtOpplysning(avklartPersonstatus),
      ...BehandlingspunktBegrunnelseTextField.buildInitialValues(aksjonspunkter),
    };
  },
);

const getFilteredKodeverk = createSelector(
  [getKodeverk(kodeverkTyper.PERSONSTATUS_TYPE)], kodeverk => kodeverk
    .filter(ps => ps.kode === personstatusType.DOD || ps.kode === personstatusType.BOSATT || ps.kode === personstatusType.UTVANDRET),
);

const transformValues = (values, aksjonspunkter) => ({
  fortsettBehandling: values.fortsettBehandling,
  personstatus: values.personstatus,
  kode: aksjonspunkter[0].definisjon.kode,
  ...BehandlingspunktBegrunnelseTextField.transformValues(values),
});

const formName = 'CheckPersonStatusForm';

const mapStateToProps = (state, ownProps) => ({
  initialValues: buildInitialValues(state),
  ...behandlingFormValueSelector(formName)(state, 'fortsettBehandling', 'originalPersonstatusName'),
  onSubmit: values => ownProps.submitCallback([transformValues(values, getSelectedBehandlingspunktAksjonspunkter(state))]),
  personStatuser: getFilteredKodeverk(state),
  gjeldeneFom: getBehandlingRevurderingAvFortsattMedlemskapFom(state),
});

const CheckPersonStatusForm = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: formName,
})(CheckPersonStatusFormImpl)));

CheckPersonStatusForm.supports = apCodes => apCodes.includes(aksjonspunktCodes.AVKLAR_PERSONSTATUS);

export default CheckPersonStatusForm;
