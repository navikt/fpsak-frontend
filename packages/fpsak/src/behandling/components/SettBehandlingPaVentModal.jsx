import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Column, Container, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import requireProps from 'app/data/requireProps';
import Modal from 'sharedComponents/Modal';
import { DatepickerField, SelectField } from 'form/Fields';
import {
  ariaCheck, dateAfterOrEqualToToday, hasValidDate, required,
} from 'utils/validation/validators';
import Image from 'sharedComponents/Image';
import { getKodeverk, getKodeverkReceived } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import innvilgetImageUrl from 'images/innvilget_valgt.svg';

import styles from './settBehandlingPaVentModal.less';

const getFristValidationRules = isUpdateOnHold => (isUpdateOnHold ? [required, hasValidDate] : [required, hasValidDate, dateAfterOrEqualToToday]);

const isButtonDisabled = (frist, showAvbryt, venteArsakHasChanged, fristHasChanged, hasManualPaVent) => {
  const dateNotValid = hasValidDate(frist) !== null || dateAfterOrEqualToToday(frist) !== null;
  const defaultOptions = (!hasManualPaVent || showAvbryt) && (!venteArsakHasChanged && !fristHasChanged);
  return defaultOptions || dateNotValid;
};

const isAksjonPunktRevurdering = kode => kode === aksjonspunktCodes.VARSEL_REVURDERING_MANUELL;
const hovedKnappenType = (venteArsakHasChanged, fristHasChanged) => venteArsakHasChanged || fristHasChanged;

const getPaVentText = (isUpdateOnHold, hasManualPaVent, frist) => {
  if (!isUpdateOnHold) {
    return 'SettBehandlingPaVentModal.SettesPaVent';
  }
  return hasManualPaVent || frist ? 'SettBehandlingPaVentModal.ErPaVent' : 'SettBehandlingPaVentModal.ErPaVentUtenFrist';
};


/**
 * SettBehandlingPaVentModal
 *
 * Presentasjonskomponent. Denne modalen vises i kontekst av sette/endre ventefrist.
 * Ved å angi en frist og venteårsak og deretter trykke på Ok blir behandlingen satt på vent/får endret ventefrist.
 */
export const SettBehandlingPaVentModal = ({
  cancelEvent,
  handleSubmit,
  frist,
  showModal,
  isUpdateOnHold,
  ventearsaker,
  showAvbryt,
  comment,
  intl,
  venteArsakHasChanged,
  fristHasChanged,
  aksjonspunktKode,
  hasManualPaVent,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'SettBehandlingPaVentModal.ModalDescription' })}
    onRequestClose={cancelEvent}
  >
    <Container fluid>
      <form onSubmit={handleSubmit} name="ventModalForm">
        <Row>
          <Column xs="1">
            <Image className={styles.image} altCode="SettBehandlingPaVentModal.PaVent" src={innvilgetImageUrl} />
            <div className={styles.divider} />
          </Column>
          <Column xs="7">
            <div className={styles.label}>
              <Normaltekst className={styles.label}>
                <FormattedMessage id={getPaVentText(isUpdateOnHold, hasManualPaVent, frist)} />
              </Normaltekst>
            </div>
          </Column>
          {(hasManualPaVent || frist)
            && (
            <Column xs="2">
              <div className={styles.datePicker}>
                <DatepickerField
                  name="frist"
                  validate={getFristValidationRules(isUpdateOnHold)}
                />
              </div>
            </Column>
            )
          }
        </Row>
        <Row className={styles.marginTop}>
          <Column xs="1" />
          <Column xs="11">
            <SelectField
              name="ventearsak"
              label={intl.formatMessage({ id: 'SettBehandlingPaVentModal.Arsak' })}
              placeholder={intl.formatMessage({ id: 'SettBehandlingPaVentModal.SelectPlaceholder' })}
              validate={[required]}
              selectValues={ventearsaker.map(ventearsak => <option key={ventearsak.kode} value={ventearsak.kode}>{ventearsak.navn}</option>)}
              bredde="xxl"
              readOnly={!hasManualPaVent}
            />
          </Column>
        </Row>
        <Row>
          <Column xs="1" />
          <Column xs="11">
            {hasManualPaVent
              && comment
            }
          </Column>
        </Row>
        <VerticalSpacer eightPx />
        <Row>
          <Column xs="7" />
          <Column>
            <Hovedknapp
              mini
              htmlType={isAksjonPunktRevurdering(aksjonspunktKode) || hovedKnappenType(venteArsakHasChanged, fristHasChanged) ? 'submit' : 'button'}
              className={styles.button}
              onClick={showAvbryt ? ariaCheck : cancelEvent}
              disabled={isButtonDisabled(frist, showAvbryt, venteArsakHasChanged, fristHasChanged, hasManualPaVent)}
            >
              {intl.formatMessage({ id: 'SettBehandlingPaVentModal.Ok' })}
            </Hovedknapp>
            {(!hasManualPaVent || showAvbryt)
              && (
              <Knapp
                htmlType="button"
                mini
                onClick={cancelEvent}
                className={styles.cancelButton}
              >
                {intl.formatMessage({ id: hasManualPaVent ? 'SettBehandlingPaVentModal.Avbryt' : 'SettBehandlingPaVentModal.Lukk' })}
              </Knapp>
              )
                }
          </Column>
        </Row>
      </form>
    </Container>
  </Modal>
);

SettBehandlingPaVentModal.propTypes = {
  cancelEvent: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  isUpdateOnHold: PropTypes.bool,
  showAvbryt: PropTypes.bool,
  frist: PropTypes.string,
  aksjonspunktKode: PropTypes.string,
  comment: PropTypes.element,
  ventearsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
  intl: intlShape.isRequired,
  venteArsakHasChanged: PropTypes.bool.isRequired,
  fristHasChanged: PropTypes.bool.isRequired,
  hasManualPaVent: PropTypes.bool.isRequired,
};

SettBehandlingPaVentModal.defaultProps = {
  frist: null,
  isUpdateOnHold: false,
  showAvbryt: true,
  comment: null,
  ventearsaker: [],
  aksjonspunktKode: null,
};

const mapStateToProps = state => ({
  ventearsaker: getKodeverk(kodeverkTyper.VENTEARSAK)(state),
  kodeverkReceived: getKodeverkReceived(state),
});

export default connect(mapStateToProps)(injectIntl(requireProps(['kodeverkReceived'])(SettBehandlingPaVentModal)));
