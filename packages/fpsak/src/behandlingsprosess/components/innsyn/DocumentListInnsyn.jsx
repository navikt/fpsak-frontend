import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import CheckboxField from 'form/fields/CheckboxField';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import DateTimeLabel from 'sharedComponents/DateTimeLabel';
import Image from 'sharedComponents/Image';
import kommunikasjonsretning from 'kodeverk/kommunikasjonsretning';
import ElementWrapper from 'sharedComponents/ElementWrapper';

import sendDokumentImageUrl from 'images/send_dokument.svg';
import mottaDokumentImageUrl from 'images/motta_dokument.svg';
import internDokumentImageUrl from 'images/intern_dokument.svg';

import styles from './documentListInnsyn.less';

const DOCUMENT_SERVER_URL = '/fpsak/api/dokument/hent-dokument';
const getLink = (document, saksNr) => `${DOCUMENT_SERVER_URL}?saksnummer=${saksNr}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`;

const getDirectionImage = (document) => {
  if (document.kommunikasjonsretning === kommunikasjonsretning.INN) {
    return (<Image className={styles.image} src={mottaDokumentImageUrl} titleCode="DocumentListInnsyn.Motta" altCode="DocumentListInnsyn.Motta" />);
  } if (document.kommunikasjonsretning === kommunikasjonsretning.UT) {
    return (<Image className={styles.image} src={sendDokumentImageUrl} titleCode="DocumentListInnsyn.Send" altCode="DocumentListInnsyn.Send" />);
  }
  return (<Image className={styles.image} src={internDokumentImageUrl} titleCode="DocumentListInnsyn.Intern" altCode="DocumentListInnsyn.Intern" />);
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
    <ElementWrapper>
      <Undertekst className={styles.noDocuments}><FormattedMessage id="DocumentListInnsyn.VelgInnsynsDok" /></Undertekst>
      <Row>
        <Column xs={readOnly ? '6' : '10'}>
          <Table headerTextCodes={headerTextCodes}>
            {documents.map((document) => {
              const img = getDirectionImage(document);
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
            })
            }
          </Table>
        </Column>
      </Row>
    </ElementWrapper>
  );
};


DocumentListInnsyn.propTypes = {
  saksNr: PropTypes.number.isRequired,
  documents: PropTypes.arrayOf(PropTypes.shape({
    journalpostId: PropTypes.string.isRequired,
    dokumentId: PropTypes.string.isRequired,
    tittel: PropTypes.string.isRequired,
    tidspunkt: PropTypes.string,
    kommunikasjonsretning: PropTypes.string.isRequired,
  }).isRequired).isRequired,
  readOnly: PropTypes.bool,
};

DocumentListInnsyn.defaultProps = {
  readOnly: false,
};

export default DocumentListInnsyn;
