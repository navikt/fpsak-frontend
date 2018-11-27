import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';
import { Row, Column } from 'nav-frontend-grid';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import Modal from 'sharedComponents/Modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';

import { SelectField, TextAreaField } from 'form/Fields';
import { maxLength, required, hasValidText } from 'utils/validation/validators';

import Image from 'sharedComponents/Image';

import innvilgetImageUrl from 'images/innvilget_valgt.svg';

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
    .filter(enhet => enhet.enhetId !== gjeldendeBehandlendeEnhetId)
    .map((enhet, index) => (
      <option value={`${index}`} key={enhet.enhetId}>
        {enhet.enhetId}
        {' '}
        {enhet.enhetNavn}
      </option>
    ));
  return (
    <Modal
      className={styles.modal}
      isOpen={showModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'ChangeBehandlendeEnhetModal.ModalDescription' })}
      onRequestClose={cancelEvent}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <Row className={styles.infotekst}>
            <Column xs="1">
              <Image className={styles.image} altCode="ChangeBehandlendeEnhetModal.Endre" src={innvilgetImageUrl} />
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
  intl: intlShape.isRequired,
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

const mapStateToProps = state => ({
  nyEnhet: formValueSelector('ChangeBehandlendeEnhetModal')(state, 'nyEnhet'),
  begrunnelse: formValueSelector('ChangeBehandlendeEnhetModal')(state, 'begrunnelse'),
});

export default connect(mapStateToProps)(injectIntl(ChangeBehandlendeEnhetModal));
