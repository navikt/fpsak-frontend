import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { DatepickerField, SelectField } from '@fpsak-frontend/form';
import {
  ariaCheck, dateAfterOrEqualToToday, hasValidDate, required,
} from '@fpsak-frontend/utils';

import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import styles from './varselOmRevurderingPaVentModal.less';

const isButtonDisabled = (frist) => hasValidDate(frist) !== null || dateAfterOrEqualToToday(frist) !== null;

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

/**
 * VarselOmRevurderingPaVentModal
 *
 * Presentasjonskomponent. Denne modalen vises i kontekst av sette/endre ventefrist.
 * Ved å angi en frist og venteårsak og deretter trykke på Ok blir behandlingen satt på vent/får endret ventefrist.
 */
const VarselOmRevurderingPaVentModal = ({
  cancelEvent,
  handleSubmit,
  frist,
  showModal,
  ventearsaker,
  intl,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'SettBehandlingPaVentModal.ModalDescription' })}
    onRequestClose={cancelEvent}
    shouldCloseOnOverlayClick={false}
    ariaHideApp={false}
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
                .map((ventearsak) => <option key={ventearsak.kode} value={ventearsak.kode}>{ventearsak.navn}</option>)}
              bredde="xxl"
            />
          </Column>
        </Row>
        <Row>
          <Column xs="1" />
          <Column xs="11">
            <Normaltekst>
              <FormattedMessage id="VarselOmRevurderingForm.BrevBlirBestilt" />
            </Normaltekst>
          </Column>
        </Row>
        <VerticalSpacer eightPx />
        <Row>
          <Column xs="6" />
          <Column>
            <Hovedknapp
              mini
              htmlType="submit"
              className={styles.button}
              onClick={ariaCheck}
              disabled={isButtonDisabled(frist)}
            >
              <FormattedMessage id="SettBehandlingPaVentModal.Ok" />
            </Hovedknapp>
          </Column>
        </Row>
      </form>
    </Container>
  </Modal>
);

VarselOmRevurderingPaVentModal.propTypes = {
  cancelEvent: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  frist: PropTypes.string,
  ventearsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })).isRequired,
  intl: PropTypes.shape().isRequired,
};

VarselOmRevurderingPaVentModal.defaultProps = {
  frist: null,
};

export default injectIntl(VarselOmRevurderingPaVentModal);
