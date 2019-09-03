import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from 'nav-frontend-modal';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import Image from '@fpsak-frontend/shared-components/src/Image';
import infoImageUrl from '@fpsak-frontend/assets/images/behandle.svg';
import { getIsFagsakTypeSVP } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { isAvslag, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { createStructuredSelector } from 'reselect';
import styles from './vedtakFritekstbrevModal.less';

const isFritekstbrevRequired = (readOnly, behandlingsresultat, erSVP) => {
  if (readOnly || !erSVP) {
    return false;
  }
  const erAvslag = behandlingsresultat && isAvslag(behandlingsresultat.type.kode);
  const erOpphor = behandlingsresultat && isOpphor(behandlingsresultat.type.kode);
  return erAvslag || erOpphor;
};

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
export const VedtakFritekstbrevModal = ({
  readOnly,
  behandlingsresultat,
  erSVP,
}) => {
  const fritektsbrevRequired = isFritekstbrevRequired(readOnly, behandlingsresultat, erSVP);
  const [showModal, settShowModal] = useState(fritektsbrevRequired);
  return (
    <>
      { fritektsbrevRequired && (
        <Modal
          className={styles.modal}
          isOpen={showModal}
          closeButton={false}
          contentLabel="VedtakForm.SvpFritektsBrevModal.ModalDescription"
          onRequestClose={(event) => {
            if (event) event.preventDefault();
            settShowModal(false);
          }}
          shouldCloseOnOverlayClick={false}
          ariaHideApp={false}
        >
          <Row>
            <Column xs="1">
              <Image
                className={styles.image}
                src={infoImageUrl}
                altCode="VedtakForm.SvpFritektsBrevModal.IngenAutomatiskVedtaksbrevImageAltCode"
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

VedtakFritekstbrevModal.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  erSVP: PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  erSVP: getIsFagsakTypeSVP,
});

export default connect(mapStateToProps)(VedtakFritekstbrevModal);
