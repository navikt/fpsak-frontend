import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { required, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import opptjeningAktivitetTyper from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import {
 RadioGroupField, RadioOption,
} from '@fpsak-frontend/form';
import {
 Table, TableRow, TableColumn, PeriodLabel, EditedIcon,
} from '@fpsak-frontend/shared-components';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { createVisningsnavnForAktivitet } from 'behandlingForstegangOgRevurdering/src/visningsnavnHelper';
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

export const skalVurdereAktivitet = (aktivitet, skalOverstyre, harAksjonspunkt) => {
  if (!skalOverstyre && !harAksjonspunkt) {
    return false;
  }
  if (aktivitet.arbeidsforholdType && aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.AAP) {
    return false;
  }
  return true;
};

const lagTableRow = (readOnly, isAksjonspunktClosed, aktivitet, getKodeverknavn, erOverstyrt, harAksjonspunkt) => (
  <TableRow key={lagAktivitetFieldId(aktivitet)}>
    <TableColumn>
      <Normaltekst>
        {createVisningsnavnForAktivitet(aktivitet, getKodeverknavn)}
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
        readOnly={readOnly || !skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt)}
        validate={[required]}
      >
        {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.bruk`} value />]}
      </RadioGroupField>
    </TableColumn>
    <TableColumn className={styles.radioMiddle}>
      <RadioGroupField
        name={`${lagAktivitetFieldId(aktivitet)}.skalBrukes`}
        readOnly={readOnly || !skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt)}
        validate={[required]}
      >
        {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.ikkeBruk`} value={false} />]}
      </RadioGroupField>
    </TableColumn>
    {isAksjonspunktClosed && readOnly
      && (
      <TableColumn>
        {skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt)
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

const finnHeading = (aktiviteter, erOverstyrt, skjaeringstidspunkt) => {
  if (erOverstyrt) {
    return (
      <FormattedMessage
        id="VurderAktiviteterTabell.Overstyrt.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt).format(DDMMYYYY_DATE_FORMAT) }}
      />
);
  }
  const harAAP = aktiviteter.some(aktivitet => aktivitet.arbeidsforholdType && aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.AAP);
  const harVentelonnVartpenger = aktiviteter.some(aktivitet => aktivitet.arbeidsforholdType
    && aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.VENTELØNN_VARTPENGER);
  if (harAAP) {
    return (
      <FormattedMessage
        id="VurderAktiviteterTabell.FullAAPKombinert.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt).format(DDMMYYYY_DATE_FORMAT) }}
      />
);
  }
  if (harVentelonnVartpenger) {
    return (
      <FormattedMessage
        id="VurderAktiviteterTabell.VentelonnVartpenger.Overskrift"
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt).format(DDMMYYYY_DATE_FORMAT) }}
      />
);
  }
  return null;
};

/**
 * VurderAktiviteterTabell
 *
 * Presentasjonskomponent.. Inneholder tabeller for avklaring av skjæringstidspunkt
 */
export const VurderAktiviteterTabellImpl = ({
  readOnly,
  isAksjonspunktClosed,
  aktiviteter,
  skjaeringstidspunkt,
  getKodeverknavn,
  erOverstyrt,
  harAksjonspunkt,
}) => (
  <React.Fragment>
    <Element>
      {finnHeading(aktiviteter, erOverstyrt, skjaeringstidspunkt)}
    </Element>
    <Table headerTextCodes={getHeaderTextCodes()} noHover>
      {aktiviteter.map(aktivitet => (
        lagTableRow(readOnly, isAksjonspunktClosed, aktivitet, getKodeverknavn, erOverstyrt, harAksjonspunkt)
      ))
      }
    </Table>
  </React.Fragment>
);

VurderAktiviteterTabellImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  aktiviteter: PropTypes.arrayOf(beregningAktivitetPropType).isRequired,
  skjaeringstidspunkt: PropTypes.string.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  erOverstyrt: PropTypes.bool.isRequired,
  harAksjonspunkt: PropTypes.bool.isRequired,
};

const VurderAktiviteterTabell = injectKodeverk(getAlleKodeverk)(VurderAktiviteterTabellImpl);

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

VurderAktiviteterTabell.hasValueChangedFromInitial = (aktiviteter, values, initialValues) => {
  const changedAktiviteter = aktiviteter.map(lagAktivitetFieldId).find((fieldId) => {
    if (values[fieldId] && initialValues[fieldId]) {
      if (values[fieldId].skalBrukes !== initialValues[fieldId].skalBrukes) {
        return true;
      }
    }
    return false;
  });
  return changedAktiviteter !== undefined;
};

const skalBrukesPretufylling = (aktivitet, erOverstyrt, harAksjonspunkt) => {
  if (skalVurdereAktivitet(aktivitet, erOverstyrt, harAksjonspunkt)) {
    return aktivitet.skalBrukes;
  }
  return aktivitet.skalBrukes === true || aktivitet.skalBrukes === null || aktivitet.skalBrukes === undefined;
};

const mapToInitialValues = (aktivitet, getKodeverknavn, erOverstyrt, harAksjonspunkt) => ({
    beregningAktivitetNavn: createVisningsnavnForAktivitet(aktivitet, getKodeverknavn),
    fom: aktivitet.fom,
    tom: aktivitet.tom,
    skalBrukes: skalBrukesPretufylling(aktivitet, erOverstyrt, harAksjonspunkt),
  });

VurderAktiviteterTabell.buildInitialValues = (aktiviteter, getKodeverknavn, erOverstyrt, harAksjonspunkt) => {
  if (!aktiviteter) {
    return {};
  }
  const initialValues = {};
  aktiviteter.forEach((aktivitet) => {
    initialValues[lagAktivitetFieldId(aktivitet)] = mapToInitialValues(aktivitet, getKodeverknavn, erOverstyrt, harAksjonspunkt);
  });
  return initialValues;
};

export default VurderAktiviteterTabell;
