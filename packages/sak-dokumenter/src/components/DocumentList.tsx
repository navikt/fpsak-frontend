import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import {
  DateTimeLabel, Image, Table, TableColumn, TableRow, Tooltip,
} from '@fpsak-frontend/shared-components';
import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import sendDokumentImageUrl from '@fpsak-frontend/assets/images/send_dokument.svg';
import mottaDokumentImageUrl from '@fpsak-frontend/assets/images/motta_dokument.svg';
import internDokumentImageUrl from '@fpsak-frontend/assets/images/intern_dokument.svg';
import erIBrukImageUrl from '@fpsak-frontend/assets/images/stjerne.svg';
import { Dokument } from '@fpsak-frontend/types';

import styles from './documentList.less';

const headerTextCodes = [
  'DocumentList.Direction',
  'DocumentList.DocumentType',
  'DocumentList.Gjelder',
  'DocumentList.DateTime',
];

const isTextMoreThan25char = (text) => text && text.length > 25;
const trimText = (text) => `${text.substring(0, 24)}...`;

const getDirectionImage = (document) => {
  if (document.kommunikasjonsretning === kommunikasjonsretning.INN) {
    return mottaDokumentImageUrl;
  }
  if (document.kommunikasjonsretning === kommunikasjonsretning.UT) {
    return sendDokumentImageUrl;
  }
  return internDokumentImageUrl;
};
const getDirectionText = (document) => {
  if (document.kommunikasjonsretning === kommunikasjonsretning.INN) {
    return 'DocumentList.Motta';
  }
  if (document.kommunikasjonsretning === kommunikasjonsretning.UT) {
    return 'DocumentList.Send';
  }
  return 'DocumentList.Intern';
};

interface OwnProps {
  documents: Dokument[];
  behandlingId?: number;
  selectDocumentCallback: (e: Event, id: number, dokument: Dokument) => void;
}

/**
 * DocumentList
 *
 * Presentasjonskomponent. Viser dokumenter i en liste. Tar også inn en callback-funksjon som blir
 * trigget når saksbehandler velger et dokument. Finnes ingen dokumenter blir det kun vist en label
 * som viser at ingen dokumenter finnes på fagsak.
 */
const DocumentList: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  documents,
  behandlingId,
  selectDocumentCallback,
}) => {
  if (documents.length === 0) {
    return <Normaltekst className={styles.noDocuments}><FormattedMessage id="DocumentList.NoDocuments" /></Normaltekst>;
  }
  return (
    <Table headerTextCodes={headerTextCodes}>
      {documents.map((document) => {
        const directionImage = getDirectionImage(document);
        const directionTextCode = getDirectionText(document);
        return (
          <TableRow
            key={document.dokumentId}
            id={document.dokumentId}
            model={document}
            onMouseDown={selectDocumentCallback}
            onKeyDown={selectDocumentCallback}
          >
            <TableColumn>
              <Image
                className={styles.image}
                src={directionImage}
                alt={intl.formatMessage({ id: directionTextCode })}
                tooltip={intl.formatMessage({ id: directionTextCode })}
              />
            </TableColumn>
            <TableColumn>
              {document.tittel}
              {document.behandlinger && document.behandlinger.includes(behandlingId)
              && (
              <Image
                className={styles.image}
                src={erIBrukImageUrl}
                tooltip={<FormattedMessage id="DocumentList.IBruk" />}
              />
              )}
            </TableColumn>
            <TableColumn>
              {isTextMoreThan25char(document.gjelderFor)
              && (
                <Tooltip content={<Normaltekst>{document.gjelderFor}</Normaltekst>} alignLeft>
                  {trimText(document.gjelderFor)}
                </Tooltip>
              )}
              {!isTextMoreThan25char(document.gjelderFor)
            && document.gjelderFor}
            </TableColumn>
            <TableColumn>
              {document.tidspunkt
                ? <DateTimeLabel dateTimeString={document.tidspunkt} />
                : <Normaltekst><FormattedMessage id="DocumentList.IProduksjon" /></Normaltekst>}
            </TableColumn>
          </TableRow>
        );
      })}
    </Table>
  );
};

export default injectIntl(DocumentList);
