import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Normaltekst } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { Image } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';

import styles from './iverksetterVedtakStatusModal.less';

type OwnProps = Readonly<{
  intl: {};
  lukkModal: () => void;
  visModal: boolean;
  behandlingsresultat?: {};
}>;

/**
 * IverksetterVedtakStatusModal
 *
 * Presentasjonskomponent. Denne modalen vises etter en vilkarsvurdering der behandlingsstatusen
 * er satt til Iverksetter vedtak. Ved å trykke på knapp blir den NAV-ansatte tatt tilbake til sokesiden.
 */
const IverksetterVedtakStatusModal: FunctionComponent<OwnProps> = ({
  intl,
  lukkModal,
  visModal,
  behandlingsresultat,
}) => {
  const erVedtakAvslatt = behandlingsresultat && behandlingsresultat.type.kode === behandlingResultatType.AVSLATT;
  const imageAltText = intl.formatMessage({ id: erVedtakAvslatt ? 'IverksetterVedtakStatusModal.Avslatt' : 'IverksetterVedtakStatusModal.Innvilget' });

  return (
    <Modal
      className={styles.modal}
      isOpen={visModal}
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'IverksetterVedtakStatusModal.Beskrivelse' })}
      onRequestClose={lukkModal}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      style={{ overlay: { zIndex: 3000 } }}
    >
      <Row>
        <Column xs="1">
          <Image
            className={styles.image}
            alt={imageAltText}
            src={innvilgetImageUrl}
          />
          <div className={styles.divider} />
        </Column>
        <Column xs="9">
          <Normaltekst>
            <FormattedMessage id={erVedtakAvslatt ? 'IverksetterVedtakStatusModal.VedtakAvslatt' : 'IverksetterVedtakStatusModal.VedtakInnvilet'} />
          </Normaltekst>
          <Normaltekst>
            <FormattedMessage id="IverksetterVedtakStatusModal.GoToSearchPage" />
          </Normaltekst>
        </Column>
        <Column xs="2">
          <Hovedknapp
            mini
            className={styles.button}
            onClick={lukkModal}
            autoFocus
          >
            {intl.formatMessage({ id: 'IverksetterVedtakStatusModal.Ok' })}
          </Hovedknapp>
        </Column>

      </Row>
    </Modal>
  );
};

IverksetterVedtakStatusModal.propTypes = {
  intl: PropTypes.shape().isRequired,
  lukkModal: PropTypes.func.isRequired,
  visModal: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape(),
};

IverksetterVedtakStatusModal.defaultProps = {
  behandlingsresultat: undefined,
};

export default injectIntl(IverksetterVedtakStatusModal);
