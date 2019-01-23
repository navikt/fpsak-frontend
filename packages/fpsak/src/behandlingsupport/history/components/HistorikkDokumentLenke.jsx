import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import styles from './historikkMalType.less';

const DOCUMENT_SERVER_URL = '/fpsak/api/dokument/hent-dokument';

const HistorikkDokumentLenke = ({ dokumentLenke, saksNr }) => {
  const {
    tag, journalpostId, dokumentId, utgått,
  } = dokumentLenke;

  if (utgått) {
    return (
      <span className={styles.dokumentLenke}>
        <i className={styles.dokumentIkon} title={tag} alt={tag} />
        <FormattedMessage id="Historikk.Utgått" values={{ tag }} />
      </span>
    );
  }
  return (
    <a
      className={styles.dokumentLenke}
      href={`${DOCUMENT_SERVER_URL}?saksnummer=${saksNr}&journalpostId=${journalpostId}&dokumentId=${dokumentId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className={styles.dokumentIkon} title={tag} alt={tag} />
      {tag}
    </a>
  );
};

HistorikkDokumentLenke.propTypes = {
  dokumentLenke: PropTypes.shape().isRequired,
  saksNr: PropTypes.number.isRequired,
};

export default injectIntl(HistorikkDokumentLenke);
