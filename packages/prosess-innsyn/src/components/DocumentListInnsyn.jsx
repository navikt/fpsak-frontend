import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { CheckboxField } from '@fpsak-frontend/form';
import {
  DateTimeLabel, Image, Table, TableColumn, TableRow,
} from '@fpsak-frontend/shared-components';
import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';

import sendDokumentImageUrl from '@fpsak-frontend/assets/images/send_dokument.svg';
import mottaDokumentImageUrl from '@fpsak-frontend/assets/images/motta_dokument.svg';
import internDokumentImageUrl from '@fpsak-frontend/assets/images/intern_dokument.svg';

import styles from './documentListInnsyn.less';

// TODO (TOR) Flytt url ut av komponent
const DOCUMENT_SERVER_URL = '/fpsak/api/dokument/hent-dokument';
const getLink = (document, saksNr) => `${DOCUMENT_SERVER_URL}?saksnummer=${saksNr}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`;

const getDirectionImage = (document, intl) => {
  if (document.kommunikasjonsretning === kommunikasjonsretning.INN) {
    return (
      <Image
        className={styles.image}
        src={mottaDokumentImageUrl}
        alt={intl.formatMessage({ id: 'DocumentListInnsyn.Motta' })}
        tooltip={intl.formatMessage({ id: 'DocumentListInnsyn.Motta' })}
      />
    );
  }
  if (document.kommunikasjonsretning === kommunikasjonsretning.UT) {
    return (
      <Image
        className={styles.image}
        src={sendDokumentImageUrl}
        alt={intl.formatMessage({ id: 'DocumentListInnsyn.Send' })}
        tooltip={intl.formatMessage({ id: 'DocumentListInnsyn.Send' })}
      />
    );
  }
  return (
    <Image
      className={styles.image}
      src={internDokumentImageUrl}
      alt={intl.formatMessage({ id: 'DocumentListInnsyn.Intern' })}
      tooltip={intl.formatMessage({ id: 'DocumentListInnsyn.Intern' })}
    />
  );
};

const noLabelHack = () => <span className={styles.hidden}>-</span>;

/**
 * DocumentListInnsyn
 *
 * Presentasjonskomponent. Viser dokumenter i en liste med Checkbox for å velge til innsyn. Tar også inn en callback-funksjon som blir
 * trigget når saksbehandler velger et dokument. Finnes ingen dokumenter blir det kun vist en label
 * som viser at ingen dokumenter finnes på fagsak.
 */
const DocumentListInnsyn = ({
  intl,
  documents,
  saksNr,
  readOnly,
}) => {
  if (documents.length === 0) {
    return <Normaltekst className={styles.noDocuments}><FormattedMessage id="DocumentListInnsyn.NoDocuments" /></Normaltekst>;
  }
  const headerTextCodes = readOnly
    ? ['DocumentListInnsyn.DocumentType']
    : [
      'DocumentListInnsyn.CheckBox',
      'DocumentListInnsyn.Direction',
      'DocumentListInnsyn.DocumentType',
      'DocumentListInnsyn.DateTime',
    ];

  return (
    <>
      <Undertekst className={styles.noDocuments}><FormattedMessage id="DocumentListInnsyn.VelgInnsynsDok" /></Undertekst>
      <Row>
        <Column xs={readOnly ? '6' : '10'}>
          <Table headerTextCodes={headerTextCodes}>
            {documents.map((document) => {
              const img = getDirectionImage(document, intl);
              const dokId = parseInt(document.dokumentId, 10);
              return (
                <TableRow key={dokId} id={dokId}>
                  <TableColumn className={styles.checkboxCol}>
                    <CheckboxField label={noLabelHack()} name={`dokument_${dokId}`} disabled={readOnly} />
                  </TableColumn>
                  <TableColumn hidden={readOnly}>
                    {img}
                  </TableColumn>
                  <TableColumn className={styles.linkCol}>
                    <a href={getLink(document, saksNr)} className="lenke lenke--frittstaende" target="_blank" rel="noopener noreferrer">{document.tittel}</a>
                  </TableColumn>
                  <TableColumn hidden={readOnly}>
                    {document.tidspunkt
                      ? <DateTimeLabel dateTimeString={document.tidspunkt} />
                      : <Normaltekst><FormattedMessage id="DocumentListInnsyn.IProduksjon" /></Normaltekst>}
                  </TableColumn>
                </TableRow>
              );
            })}
          </Table>
        </Column>
      </Row>
    </>
  );
};

DocumentListInnsyn.propTypes = {
  intl: PropTypes.shape().isRequired,
  saksNr: PropTypes.number.isRequired,
  documents: PropTypes.arrayOf(PropTypes.shape({
    journalpostId: PropTypes.string.isRequired,
    dokumentId: PropTypes.string.isRequired,
    tittel: PropTypes.string,
    tidspunkt: PropTypes.string,
    kommunikasjonsretning: PropTypes.string,
  }).isRequired).isRequired,
  readOnly: PropTypes.bool,
};

DocumentListInnsyn.defaultProps = {
  readOnly: false,
};

export default injectIntl(DocumentListInnsyn);
