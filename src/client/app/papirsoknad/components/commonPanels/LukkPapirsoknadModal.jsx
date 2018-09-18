import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router-dom';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import Modal from 'sharedComponents/Modal';
import Image from 'sharedComponents/Image';

import advarselImageUrl from 'images/advarsel.svg';

import styles from './lukkPapirsoknadModal.less';

/**
 * LukkPapirSoknadModal
 *
 * Presentasjonskomponent. Denne modalen vises når saksbehandler velger 'Ikke mulig å fullføre registrering av søknad'
 * og trykker på 'Lagre og start behandling'.
 * Ved å trykke på OK blir saken sendt til behandling av avslag.
 */
export const LukkPapirSoknadModal = ({
  showModal,
  handleSubmit,
  cancelEvent,
  intl,
  form,
}) => (
  <Modal
    className={styles.modal}
    isOpen={showModal}
    closeButton={false}
    contentLabel={intl.formatMessage({ id: 'ModalLukkPapirSoknad.ModalDescription' })}
    onRequestClose={cancelEvent}

  >
    <Row>
      <Column xs="1">
        <Image className={styles.image} altCode="ModalLukkPapirSoknad.Avslutt" src={advarselImageUrl} />
        <div className={styles.divider} />
      </Column>
      <Column xs="11">
        <Element>
          {intl.formatMessage({ id: 'ModalLukkPapirSoknad.AvslutterRegistrering' })}
        </Element>
        <Normaltekst>
          {intl.formatMessage({ id: 'ModalLukkPapirSoknad.BekreftAvslag' })}
        </Normaltekst>
      </Column>
    </Row>
    <Row>
      <Column>
        <div className={styles.right}>
          <Link to="/">
            <Hovedknapp
              mini
              className={styles.button}
              onClick={() => handleSubmit(form)}
            >
              {intl.formatMessage({ id: 'ModalLukkPapirSoknad.Ok' })}
            </Hovedknapp>
          </Link>
          <Knapp
            htmlType="button"
            mini
            onClick={cancelEvent}
            className={styles.cancelButton}
          >
            {intl.formatMessage({ id: 'ModalLukkPapirSoknad.Avbryt' })}
          </Knapp>
        </div>
      </Column>
    </Row>
  </Modal>
);

LukkPapirSoknadModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cancelEvent: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  form: PropTypes.string.isRequired,
};

export default injectIntl(LukkPapirSoknadModal);
