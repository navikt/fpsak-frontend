import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector, reduxForm, InjectedFormProps } from 'redux-form';
import moment from 'moment';
import Modal from 'nav-frontend-modal';
import { Normaltekst } from 'nav-frontend-typografi';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import {
  ariaCheck, dateAfterOrEqualToToday, hasValidDate, required,
} from '@fpsak-frontend/utils';
import { KodeverkMedNavn } from '@fpsak-frontend/types';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { DatepickerField, SelectField } from '@fpsak-frontend/form';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';

import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import styles from './settBehandlingPaVentModal.less';

const initFrist = () => {
  const date = moment().toDate();
  date.setDate(date.getDate() + 28);
  return date.toISOString().substr(0, 10);
};

const isButtonDisabled = (frist, venteArsakHasChanged, fristHasChanged) => {
  const dateNotValid = hasValidDate(frist) !== null || dateAfterOrEqualToToday(frist) !== null;
  const defaultOptions = !venteArsakHasChanged && !fristHasChanged;
  return defaultOptions || dateNotValid;
};

const hovedKnappenType = (venteArsakHasChanged, fristHasChanged) => venteArsakHasChanged || fristHasChanged;

const manuelleVenteArsaker = [
  venteArsakType.AVV_DOK,
  venteArsakType.AVV_FODSEL,
  venteArsakType.UTV_FRIST,
  venteArsakType.AVV_RESPONS_REVURDERING,
  venteArsakType.FOR_TIDLIG_SOKNAD,
  venteArsakType.VENT_PÅ_SISTE_AAP_ELLER_DP_MELDEKORT,
  venteArsakType.ANKE_VENTER_PAA_MERKNADER_FRA_BRUKER,
  venteArsakType.ANKE_OVERSENDT_TIL_TRYGDERETTEN,
  venteArsakType.VENT_OPDT_INNTEKTSMELDING,
  venteArsakType.VENT_OPPTJENING_OPPLYSNINGER,
];

interface OwnProps {
  cancelEvent: () => void;
  showModal: boolean;
  frist?: string;
  originalFrist?: string;
  ventearsak?: string;
  originalVentearsak?: string;
  ventearsaker: KodeverkMedNavn[];
}

/**
 * SettBehandlingPaVentModal
 *
 * Presentasjonskomponent. Denne formen gjenbruker settBehandlingPaVentModal. Bruk denne komponenten som en wrapper for
 * settBehandlingPaVentModal hvis du ikke har noen ytre form.
 */
export const SettBehandlingPaVentModal: FunctionComponent<OwnProps & WrappedComponentProps & InjectedFormProps> = ({
  intl,
  handleSubmit,
  cancelEvent,
  showModal,
  frist,
  originalFrist,
  ventearsak,
  originalVentearsak,
  ventearsaker,
}) => {
  const venteArsakHasChanged = !(originalVentearsak === ventearsak || (!ventearsak && !originalVentearsak));
  const fristHasChanged = !(originalFrist === frist || (!frist && !originalFrist));
  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'SettBehandlingPaVentModal.ModalDescription' })}
      onRequestClose={cancelEvent}
      shouldCloseOnOverlayClick={false}
    >
      <Container fluid>
        <form onSubmit={handleSubmit} name="ventModalForm">
          <Row>
            <Column xs="1">
              <Image className={styles.image} alt={intl.formatMessage({ id: 'SettBehandlingPaVentModal.PaVent' })} src={innvilgetImageUrl} />
              <div className={styles.divider} />
            </Column>
            <Column xs="7">
              <div className={styles.label}>
                <Normaltekst className={styles.label}>
                  <FormattedMessage id="SettBehandlingPaVentModal.SettesPaVent" />
                </Normaltekst>
              </div>
            </Column>
            <Column xs="2">
              <div className={styles.datePicker}>
                <DatepickerField
                  name="frist"
                  validate={[required, hasValidDate, dateAfterOrEqualToToday]}
                />
              </div>
            </Column>
          </Row>
          <Row className={styles.marginTop}>
            <Column xs="1" />
            <Column xs="11">
              <SelectField
                name="ventearsak"
                label={intl.formatMessage({ id: 'SettBehandlingPaVentModal.Arsak' })}
                placeholder={intl.formatMessage({ id: 'SettBehandlingPaVentModal.SelectPlaceholder' })}
                validate={[required]}
                selectValues={ventearsaker.filter((va) => manuelleVenteArsaker.indexOf(va.kode) > -1)
                  .sort((v1, v2) => v1.navn.localeCompare(v2.navn))
                  .map((va) => <option key={va.kode} value={va.kode}>{va.navn}</option>)}
                bredde="xxl"
              />
            </Column>
          </Row>
          <VerticalSpacer eightPx />
          <Row>
            <Column xs="6" />
            <Column>
              <Hovedknapp
                mini
                htmlType={hovedKnappenType(venteArsakHasChanged, fristHasChanged) ? 'submit' : 'button'}
                className={styles.button}
                onClick={ariaCheck}
                disabled={isButtonDisabled(frist, venteArsakHasChanged, fristHasChanged)}
              >
                {intl.formatMessage({ id: 'SettBehandlingPaVentModal.Ok' })}
              </Hovedknapp>
              <Knapp
                htmlType="button"
                mini
                onClick={cancelEvent}
                className={styles.cancelButton}
              >
                {intl.formatMessage({ id: 'SettBehandlingPaVentModal.Avbryt' })}
              </Knapp>
            </Column>
          </Row>
        </form>
      </Container>
    </Modal>
  );
};

const buildInitialValues = (initialProps) => ({
  ventearsak: initialProps.ventearsak,
  frist: initFrist(),
});

const mapStateToProps = (state, initialProps) => ({
  frist: formValueSelector('settBehandlingModalForm')(state, 'frist'),
  originalFrist: initialProps.frist,
  originalVentearsak: initialProps.ventearsak,
  ventearsak: formValueSelector('settBehandlingModalForm')(state, 'ventearsak'),
  initialValues: buildInitialValues(initialProps),
});

export default connect(mapStateToProps)(reduxForm({
  form: 'settBehandlingModalForm',
  enableReinitialize: true,
})(injectIntl(SettBehandlingPaVentModal)));
