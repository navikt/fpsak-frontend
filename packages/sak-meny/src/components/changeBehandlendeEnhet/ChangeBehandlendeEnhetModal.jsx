import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector, reduxForm } from 'redux-form';
import { Column, Row } from 'nav-frontend-grid';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import { SelectField, TextAreaField } from '@fpsak-frontend/form';
import { hasValidText, maxLength, required } from '@fpsak-frontend/utils';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import styles from './changeBehandlendeEnhetModal.less';

/**
 * ChangeBehandlendeEnhetModal
 *
 * Presentasjonskomponent. Denne modalen vises når saksbehandler valger 'Bytt behandlende enhet'.
 * Ved å angi ny enhet og begrunnelse og trykke på 'OK' blir behandlende enhet endret.
 */
const maxLength400 = maxLength(400);

export const ChangeBehandlendeEnhetModalImpl = ({
  showModal,
  handleSubmit,
  cancelEvent,
  behandlendeEnheter,
  gjeldendeBehandlendeEnhetId,
  gjeldendeBehandlendeEnhetNavn,
  handleEnhetChange,
  intl,
  nyEnhet,
  begrunnelse,
}) => {
  const selectOptions = () => behandlendeEnheter
    .filter((enhet) => enhet.enhetId !== gjeldendeBehandlendeEnhetId)
    .map((enhet, index) => (
      <option value={`${index}`} key={enhet.enhetId}>
        {`${enhet.enhetId} ${enhet.enhetNavn}`}
      </option>
    ));
  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'ChangeBehandlendeEnhetModal.ModalDescription' })}
      onRequestClose={cancelEvent}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <Row className={styles.infotekst}>
            <Column xs="1">
              <Image className={styles.image} alt={intl.formatMessage({ id: 'ChangeBehandlendeEnhetModal.Endre' })} src={innvilgetImageUrl} />
              <div className={styles.divider} />
            </Column>
            <Column xs="11">
              <Normaltekst className={styles.infotekstBeskrivelse}><FormattedMessage id="ChangeBehandlendeEnhetModal.EndreEnhet" /></Normaltekst>
            </Column>
          </Row>
          <Row>
            <Column xs="1" />
            <Column xs="5">
              <SelectField
                name="nyEnhet"
                onChange={handleEnhetChange}
                label={intl.formatMessage({ id: 'ChangeBehandlendeEnhetModal.NyEnhetField' })}
                validate={[required]}
                placeholder={`${gjeldendeBehandlendeEnhetId} ${gjeldendeBehandlendeEnhetNavn}`}
                selectValues={selectOptions()}
                bredde="xl"
              />
            </Column>
          </Row>
          <Row>
            <Column xs="1" />
            <Column xs="8">
              <VerticalSpacer eightPx />
              <TextAreaField
                name="begrunnelse"
                label={intl.formatMessage({ id: 'ChangeBehandlendeEnhetModal.BegrunnelseField' })}
                validate={[required, maxLength400, hasValidText]}
                maxLength={400}
              />
            </Column>
          </Row>
          <Row>
            <Column xs="1" />
            <Column xs="8">
              <VerticalSpacer sixteenPx />
              <div className={styles.floatButtons}>
                <Hovedknapp
                  mini
                  className={styles.button}
                  disabled={!(nyEnhet && begrunnelse)}
                >
                  {intl.formatMessage({ id: 'ChangeBehandlendeEnhetModal.Ok' })}
                </Hovedknapp>
                <Knapp
                  htmlType="button"
                  mini
                  onClick={cancelEvent}
                >
                  {intl.formatMessage({ id: 'ChangeBehandlendeEnhetModal.Avbryt' })}
                </Knapp>
              </div>
            </Column>
          </Row>
        </div>
      </form>
    </Modal>
  );
};

ChangeBehandlendeEnhetModalImpl.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cancelEvent: PropTypes.func.isRequired,
  behandlendeEnheter: PropTypes.arrayOf(PropTypes.shape({
    enhetId: PropTypes.string.isRequired,
    enhetNavn: PropTypes.string.isRequired,
  })).isRequired,
  gjeldendeBehandlendeEnhetId: PropTypes.string,
  gjeldendeBehandlendeEnhetNavn: PropTypes.string,
  handleEnhetChange: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  nyEnhet: PropTypes.string,
  begrunnelse: PropTypes.string,
};

ChangeBehandlendeEnhetModalImpl.defaultProps = {
  gjeldendeBehandlendeEnhetId: null,
  gjeldendeBehandlendeEnhetNavn: null,
  nyEnhet: null,
  begrunnelse: null,
};

const ChangeBehandlendeEnhetModal = reduxForm({
  form: 'ChangeBehandlendeEnhetModal',
})(ChangeBehandlendeEnhetModalImpl);

const mapStateToProps = (state) => ({
  nyEnhet: formValueSelector('ChangeBehandlendeEnhetModal')(state, 'nyEnhet'),
  begrunnelse: formValueSelector('ChangeBehandlendeEnhetModal')(state, 'begrunnelse'),
});

export default connect(mapStateToProps)(injectIntl(ChangeBehandlendeEnhetModal));
