import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import {
  DateTimeLabel, Image, Table, TableColumn, TableRow, Tooltip,
} from '@fpsak-frontend/shared-components';
import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import sendDokumentImageUrl from '@fpsak-frontend/assets/images/send_dokument.svg';
import mottaDokumentImageUrl from '@fpsak-frontend/assets/images/motta_dokument.svg';
import internDokumentImageUrl from '@fpsak-frontend/assets/images/intern_dokument.svg';
import erIBrukImageUrl from '@fpsak-frontend/assets/images/stjerne.svg';

import dokumentPropType from '../propTypes/dokumentPropType';

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


/**
 * DocumentList
 *
 * Presentasjonskomponent. Viser dokumenter i en liste. Tar også inn en callback-funksjon som blir
 * trigget når saksbehandler velger et dokument. Finnes ingen dokumenter blir det kun vist en label
 * som viser at ingen dokumenter finnes på fagsak.
 */
const DocumentList = ({
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
                title={intl.formatMessage({ id: directionTextCode })}
                tabIndex="0"
              />
            </TableColumn>
            <TableColumn>
              {document.tittel}
              {document.behandlinger && document.behandlinger.includes(behandlingId)
              && (
              <Image
                className={styles.image}
                src={erIBrukImageUrl}
                tooltip={{ header: <Normaltekst><FormattedMessage id="DocumentList.IBruk" /></Normaltekst> }}
                tabIndex="0"
              />
              )}
            </TableColumn>
            <TableColumn>
              {isTextMoreThan25char(document.gjelderFor)
              && (
                <Tooltip header={<Normaltekst>{document.gjelderFor}</Normaltekst>}>
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

DocumentList.propTypes = {
  intl: PropTypes.shape().isRequired,
  documents: PropTypes.arrayOf(dokumentPropType.isRequired).isRequired,
  selectDocumentCallback: PropTypes.func.isRequired,
  behandlingId: PropTypes.number,
};

DocumentList.defaultProps = {
  behandlingId: undefined,
};

export default injectIntl(DocumentList);
