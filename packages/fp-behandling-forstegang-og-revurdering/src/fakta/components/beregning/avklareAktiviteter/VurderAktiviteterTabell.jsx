import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { required, createVisningsnavnForAktivitet, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import opptjeningAktivitetTyper from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import {
 RadioGroupField, RadioOption,
} from '@fpsak-frontend/form';
import {
 Table, TableRow, TableColumn, PeriodLabel, EditedIcon,
} from '@fpsak-frontend/shared-components';
import beregningAktivitetPropType from './beregningAktivitetPropType';

import styles from './vurderAktiviteterTabell.less';

export const lagAktivitetFieldId = (aktivitet) => {
  if (aktivitet.arbeidsgiverId) {
    if (aktivitet.arbeidsforholdId) {
      return aktivitet.arbeidsgiverId + aktivitet.arbeidsforholdId + aktivitet.fom;
    }
    return aktivitet.arbeidsgiverId + aktivitet.fom;
  }
  if (aktivitet.aktørId) {
    if (aktivitet.arbeidsforholdId) {
      return aktivitet.aktørId.aktørId + aktivitet.arbeidsforholdId + aktivitet.fom;
    }
    return aktivitet.aktørId.aktørId + aktivitet.fom;
  }
  return aktivitet.arbeidsforholdType.kode + aktivitet.fom;
};

const skalIkkeVurdereAktivitet = (aktivitet) => {
  if (aktivitet.arbeidsforholdType && aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.AAP) {
    return true;
  }
  return false;
};

const lagTableRow = (readOnly, isAksjonspunktClosed, aktivitet) => (
  <TableRow key={lagAktivitetFieldId(aktivitet)}>
    <TableColumn>
      <Normaltekst>
        {createVisningsnavnForAktivitet(aktivitet)}
      </Normaltekst>
    </TableColumn>
    <TableColumn>
      <Normaltekst>
        <PeriodLabel dateStringFom={aktivitet.fom} dateStringTom={aktivitet.tom} />
      </Normaltekst>
    </TableColumn>
    <TableColumn className={styles.radioMiddle}>
      <RadioGroupField
        name={`${lagAktivitetFieldId(aktivitet)}.skalBrukes`}
        readOnly={readOnly || skalIkkeVurdereAktivitet(aktivitet)}
        validate={[required]}
      >
        {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.bruk`} value />]}
      </RadioGroupField>
    </TableColumn>
    <TableColumn className={styles.radioMiddle}>
      <RadioGroupField
        name={`${lagAktivitetFieldId(aktivitet)}.skalBrukes`}
        readOnly={readOnly || skalIkkeVurdereAktivitet(aktivitet)}
        validate={[required]}
      >
        {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.ikkeBruk`} value={false} />]}
      </RadioGroupField>
    </TableColumn>
    {isAksjonspunktClosed
      && (
      <TableColumn>
        {!skalIkkeVurdereAktivitet(aktivitet)
          && <EditedIcon />
        }
      </TableColumn>
)
    }
  </TableRow>
);

const getHeaderTextCodes = () => ([
  'VurderAktiviteterTabell.Header.Aktivitet',
  'VurderAktiviteterTabell.Header.Periode',
  'VurderAktiviteterTabell.Header.Benytt',
  'VurderAktiviteterTabell.Header.IkkeBenytt',
  ]
);

/**
 * VurderAktiviteterTabell
 *
 * Presentasjonskomponent.. Inneholder tabeller for avklaring av skjæringstidspunkt
 */
export const VurderAktiviteterTabell = ({
  readOnly,
  isAksjonspunktClosed,
  aktiviteter,
  skjaeringstidspunkt,
}) => (
  <React.Fragment>
    <Element>
      <FormattedMessage
        id="VurderAktiviteterTabell.FullAAPKombinert.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt).format(DDMMYYYY_DATE_FORMAT) }}
      />
    </Element>
    <Table headerTextCodes={getHeaderTextCodes()} noHover>
      {aktiviteter.map(aktivitet => (
        lagTableRow(readOnly, isAksjonspunktClosed, aktivitet)
      ))
      }
    </Table>
  </React.Fragment>
);

VurderAktiviteterTabell.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  aktiviteter: PropTypes.arrayOf(beregningAktivitetPropType).isRequired,
  skjaeringstidspunkt: PropTypes.string.isRequired,
};

VurderAktiviteterTabell.transformValues = (values, aktiviteter) => aktiviteter
    .filter(aktivitet => values[lagAktivitetFieldId(aktivitet)].skalBrukes === false)
    .map(aktivitet => ({
      oppdragsgiverOrg: aktivitet.aktørId ? null : aktivitet.arbeidsgiverId,
      arbeidsforholdRef: aktivitet.arbeidsforholdId,
      fom: aktivitet.fom,
      tom: aktivitet.tom,
      opptjeningAktivitetType: aktivitet.arbeidsforholdType ? aktivitet.arbeidsforholdType.kode : null,
      arbeidsgiverIdentifikator: aktivitet.aktørId ? aktivitet.aktørId.aktørId : null,
      skalBrukes: false,
    }));

VurderAktiviteterTabell.hasValueChangedFromInitial = (aktiviteter, values, initialValues) => (aktiviteter.map(lagAktivitetFieldId).find(fieldId => (
    values[fieldId] !== initialValues[fieldId]
    )) !== undefined);

const mapToInitialValues = aktivitet => ({
    beregningAktivitetNavn: createVisningsnavnForAktivitet(aktivitet),
    fom: aktivitet.fom,
    tom: aktivitet.tom,
    skalBrukes: skalIkkeVurdereAktivitet(aktivitet) ? true : aktivitet.skalBrukes,
  });

VurderAktiviteterTabell.buildInitialValues = (aktiviteter) => {
  if (!aktiviteter) {
    return {};
  }
  const initialValues = {};
  aktiviteter.forEach((aktivitet) => {
    initialValues[lagAktivitetFieldId(aktivitet)] = mapToInitialValues(aktivitet);
  });
  return initialValues;
};

export default VurderAktiviteterTabell;
