import React, { FunctionComponent, useState } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import Modal from 'nav-frontend-modal';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';

import { Behandlingsresultat } from '@fpsak-frontend/types';
import Image from '@fpsak-frontend/shared-components/src/Image';
import infoImageUrl from '@fpsak-frontend/assets/images/behandle.svg';
import { isAvslag, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';

import styles from './vedtakFritekstbrevModal.less';

const isFritekstbrevRequired = (readOnly, behandlingsresultat) => {
  if (readOnly) {
    return false;
  }
  const erAvslag = behandlingsresultat && isAvslag(behandlingsresultat.type.kode);
  const erOpphor = behandlingsresultat && isOpphor(behandlingsresultat.type.kode);
  return erAvslag || erOpphor;
};

interface OwnProps {
  readOnly: boolean;
  behandlingsresultat?: Behandlingsresultat;
}

/**
 * VedtakFritekstbrevModal
 *
 * Presentasjonskomponent. Denne modalen vises i vedtaksbildet når det er en åpen SVP behandling hvor
 * behandlingsresultatet er avslag eller opphør, samt hvis det er en revurdering med behandlingsresultat
 * som er ulikt opphør.
 *
 * Modalen skal endres/slettes etter hvert som støtte for brev blir implementert. Modalen blir kun brukt
 * som veiledning for å redusere ekstraarbeidet som oppstår i sammenheng med brev som ikke er implementert.
 *
 * Se https://jira.adeo.no/browse/TFP-738 for mer informasjon.
 *
 */
export const VedtakFritekstbrevModal: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  readOnly,
  behandlingsresultat,
}) => {
  const fritektsbrevRequired = isFritekstbrevRequired(readOnly, behandlingsresultat);
  const [showModal, settShowModal] = useState(fritektsbrevRequired);
  return (
    <>
      { fritektsbrevRequired && (
        <Modal
          className={styles.modal}
          isOpen={showModal}
          closeButton={false}
          contentLabel="VedtakForm.SvpFritektsBrevModal.ModalDescription"
          onRequestClose={() => {
            settShowModal(false);
          }}
          shouldCloseOnOverlayClick={false}
        >
          <Row>
            <Column xs="1">
              <Image
                className={styles.image}
                src={infoImageUrl}
                alt={intl.formatMessage({ id: 'VedtakForm.SvpFritektsBrevModal.IngenAutomatiskVedtaksbrevImage' })}
              />
              <div className={styles.divider} />
            </Column>
            <Column xs="9">
              <Normaltekst>
                <FormattedMessage id="VedtakForm.SvpFritektsBrevModal.IngenAutomatiskVedtaksbrev" />
              </Normaltekst>
            </Column>
            <Column xs="2">
              <Hovedknapp
                mini
                className={styles.button}
                onClick={(event) => { event.preventDefault(); settShowModal(false); }}
                autoFocus
              >
                <FormattedMessage id="VedtakForm.SvpFritektsBrevModal.Ok" />
              </Hovedknapp>
            </Column>
          </Row>
        </Modal>
      )}
    </>
  );
};

export default injectIntl(VedtakFritekstbrevModal);
