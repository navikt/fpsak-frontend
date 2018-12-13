import React from 'react';
import { PropTypes } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import arbeidsforholdPropType from 'behandlingFelles/proptypes/arbeidsforholdPropType';
import {
  Image, Table, TableColumn, TableRow, PeriodLabel, DateLabel,
} from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import erIBrukImageUrl from '@fpsak-frontend/assets/images/stjerne.svg';

const headerTextCodes = [
  'PersonArbeidsforholdTable.Arbeidsforhold',
  'PersonArbeidsforholdTable.Periode',
  'PersonArbeidsforholdTable.Kilde',
  'PersonArbeidsforholdTable.Stillingsprosent',
  'PersonArbeidsforholdTable.MottattDato',
];

const getEndCharFromId = id => id.substring(id.length - 4, id.length);

const PersonArbeidsforholdTable = ({
  alleArbeidsforhold,
  selectedId,
  selectArbeidsforholdCallback,
}) => {
  if (alleArbeidsforhold.length === 0) {
    return <Normaltekst><FormattedMessage id="PersonArbeidsforholdTable.IngenArbeidsforhold" /></Normaltekst>;
  }
  return (
    <Table headerTextCodes={headerTextCodes}>
      {alleArbeidsforhold && alleArbeidsforhold.map((a) => {
        const navn = a.arbeidsforholdId ? `${a.navn}(${a.arbeidsgiverIdentifiktorGUI})...${getEndCharFromId(a.arbeidsforholdId)}`
          : `${a.navn}(${a.arbeidsgiverIdentifiktorGUI})`;
        const stillingsprosent = a.stillingsprosent ? `${parseFloat(a.stillingsprosent).toFixed(2)} %` : '';
        return (
          <TableRow
            key={navn}
            model={a}
            onMouseDown={selectArbeidsforholdCallback}
            onKeyDown={selectArbeidsforholdCallback}
            isSelected={a.id === selectedId}
          >
            <TableColumn><Normaltekst>{decodeHtmlEntity(navn)}</Normaltekst></TableColumn>
            <TableColumn><Normaltekst><PeriodLabel dateStringFom={a.fomDato} dateStringTom={a.tomDato} /></Normaltekst></TableColumn>
            <TableColumn><Normaltekst>{a.kilde.navn}</Normaltekst></TableColumn>
            <TableColumn><Normaltekst>{stillingsprosent}</Normaltekst></TableColumn>
            <TableColumn>
              {a.mottattDatoInntektsmelding
              && <Normaltekst><DateLabel dateString={a.mottattDatoInntektsmelding} /></Normaltekst>
            }
            </TableColumn>
            <TableColumn>
              { a.brukArbeidsforholdet
            && (
            <Image
              src={erIBrukImageUrl}
              altCode="PersonArbeidsforholdTable.ErIBruk"
              tooltip={{ header: <Element><FormattedMessage id="PersonArbeidsforholdTable.ErIBruk" /></Element> }}
            />
            )
            }
            </TableColumn>
          </TableRow>
        );
      })}
    </Table>
  );
};

PersonArbeidsforholdTable.propTypes = {
  alleArbeidsforhold: PropTypes.arrayOf(arbeidsforholdPropType).isRequired,
  selectedId: PropTypes.string,
  selectArbeidsforholdCallback: PropTypes.func.isRequired,
};

PersonArbeidsforholdTable.defaultProps = {
  selectedId: undefined,
};

export default PersonArbeidsforholdTable;