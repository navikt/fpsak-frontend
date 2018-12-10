import React from 'react';
import PropTypes from 'prop-types';

import { FormattedMessage } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import ElementWrapper from 'sharedComponents/ElementWrapper';

import styles from './documentListVedtakInnsyn.less';

const DOCUMENT_SERVER_URL = '/fpsak/api/dokument/hent-dokument';
const getLink = (document, saksNr) => `${DOCUMENT_SERVER_URL}?saksnummer=${saksNr}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`;

const headerTextCodes = [
  'DocumentListVedtakInnsyn.Dokument',

];

/**
 * DocumentListVedtakInnsyn
 *
 * Presentasjonskomponent. Viser dokumenter  som er valgt til innsyn i en liste . Finnes ingen dokumenter blir det kun vist en label
 * som viser at ingen dokumenter finnes på fagsak.
 */
const DocumentListVedtakInnsyn = ({
  documents, saksNr,
}) => {
  if (documents.length === 0) {
    return <Normaltekst className={styles.noDocuments}><FormattedMessage id="DocumentListVedtakInnsyn.NoDocuments" /></Normaltekst>;
  }

  return (
    <ElementWrapper>
      <Undertekst className={styles.noDocuments}><FormattedMessage id="DocumentListVedtakInnsyn.InnsynsDok" /></Undertekst>
      <Row>
        <Column xs="6">
          <Table noHover headerTextCodes={headerTextCodes}>
            {documents.map((document) => {
              const dokId = parseInt(document.dokumentId, 10);
              return (
                <TableRow key={dokId} id={dokId}>
                  <TableColumn className={styles.linkCol}>
                    <a href={getLink(document, saksNr)} className="lenke lenke--frittstaende" target="_blank" rel="noopener noreferrer">{document.tittel}</a>
                  </TableColumn>
                </TableRow>
              );
            })
        }
          </Table>
        </Column>
      </Row>
    </ElementWrapper>
  );
};

DocumentListVedtakInnsyn.propTypes = {
  saksNr: PropTypes.number.isRequired,
  documents: PropTypes.arrayOf(PropTypes.shape({
    journalpostId: PropTypes.string.isRequired,
    dokumentId: PropTypes.string.isRequired,
    tittel: PropTypes.string.isRequired,
    tidspunkt: PropTypes.string,
    kommunikasjonsretning: PropTypes.string.isRequired,
  }).isRequired).isRequired,
};

export default DocumentListVedtakInnsyn;
