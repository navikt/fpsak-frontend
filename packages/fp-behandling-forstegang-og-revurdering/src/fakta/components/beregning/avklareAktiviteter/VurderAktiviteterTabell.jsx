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

export const skalVurdereAktivitet = (aktivitet, skalOverstyre) => {
  if (skalOverstyre) {
    return true;
  }
  if (aktivitet.arbeidsforholdType && aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.AAP) {
    return false;
  }
  return true;
};

const lagTableRow = (readOnly, isAksjonspunktClosed, aktivitet, getKodeverknavn, erOverstyrt) => (
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
        readOnly={readOnly || !skalVurdereAktivitet(aktivitet, erOverstyrt)}
        validate={[required]}
      >
        {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.bruk`} value />]}
      </RadioGroupField>
    </TableColumn>
    <TableColumn className={styles.radioMiddle}>
      <RadioGroupField
        name={`${lagAktivitetFieldId(aktivitet)}.skalBrukes`}
        readOnly={readOnly || !skalVurdereAktivitet(aktivitet, erOverstyrt)}
        validate={[required]}
      >
        {[<RadioOption key={`${lagAktivitetFieldId(aktivitet)}.ikkeBruk`} value={false} />]}
      </RadioGroupField>
    </TableColumn>
    {isAksjonspunktClosed && readOnly
      && (
      <TableColumn>
        {skalVurdereAktivitet(aktivitet, erOverstyrt)
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

const finnHeading = (aktiviteter, erOverstyrt) => {
  if (erOverstyrt) {
    return 'VurderAktiviteterTabell.Overstyrt.Overskrift';
  }
  const harAAP = aktiviteter.some(aktivitet => aktivitet.arbeidsforholdType && aktivitet.arbeidsforholdType.kode === opptjeningAktivitetTyper.AAP);
  return harAAP ? 'VurderAktiviteterTabell.FullAAPKombinert.Overskrift' : 'VurderAktiviteterTabell.VentelonnVartpenger.Overskrift';
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
}) => (
  <React.Fragment>
    <Element>
      <FormattedMessage
        id={finnHeading(aktiviteter, erOverstyrt)}
        values={{ skjaeringstidspunkt: moment(skjaeringstidspunkt).format(DDMMYYYY_DATE_FORMAT) }}
      />
    </Element>
    <Table headerTextCodes={getHeaderTextCodes()} noHover>
      {aktiviteter.map(aktivitet => (
        lagTableRow(readOnly, isAksjonspunktClosed, aktivitet, getKodeverknavn, erOverstyrt)
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

const mapToInitialValues = (aktivitet, getKodeverknavn, erOverstyrt) => ({
    beregningAktivitetNavn: createVisningsnavnForAktivitet(aktivitet, getKodeverknavn),
    fom: aktivitet.fom,
    tom: aktivitet.tom,
    skalBrukes: skalVurdereAktivitet(aktivitet, erOverstyrt) ? aktivitet.skalBrukes : true,
  });

VurderAktiviteterTabell.buildInitialValues = (aktiviteter, getKodeverknavn, erOverstyrt) => {
  if (!aktiviteter) {
    return {};
  }
  const initialValues = {};
  aktiviteter.forEach((aktivitet) => {
    initialValues[lagAktivitetFieldId(aktivitet)] = mapToInitialValues(aktivitet, getKodeverknavn, erOverstyrt);
  });
  return initialValues;
};

export default VurderAktiviteterTabell;
