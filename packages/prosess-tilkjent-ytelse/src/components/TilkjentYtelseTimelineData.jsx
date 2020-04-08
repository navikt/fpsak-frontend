import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  Table, TableColumn, TableRow, VerticalSpacer, FloatRight,
} from '@fpsak-frontend/shared-components';
import { calcDaysAndWeeks, DDMMYYYY_DATE_FORMAT, getKodeverknavnFn } from '@fpsak-frontend/utils';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { uttakPeriodeNavn } from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';

import { TimeLineButton, TimeLineDataContainer } from '@fpsak-frontend/tidslinje';

import tilkjentYtelseBeregningresultatPropType from '../propTypes/tilkjentYtelseBeregningresultatPropType';

import styles from './tilkjentYtelse.less';

const getEndCharFromId = (id) => (id ? `...${id.substring(id.length - 4, id.length)}` : '');

export const createVisningsnavnForAktivitet = (aktivitet, getKodeverknavn) => {
  if (!aktivitet.arbeidsgiverNavn) {
    return aktivitet.arbeidsforholdType ? getKodeverknavn(aktivitet.arbeidsforholdType) : '';
  }
  return aktivitet.arbeidsgiverId
    ? `${aktivitet.arbeidsgiverNavn} (${aktivitet.arbeidsgiverId})${getEndCharFromId(aktivitet.eksternArbeidsforholdId)}`
    : aktivitet.arbeidsgiverNavn;
};

const createVisningNavnForUttakArbeidstaker = (andel, getKodeverknavn) => {
  if (!andel.arbeidsgiverOrgnr) {
    return <FormattedMessage id="TilkjentYtelse.PeriodeData.Arbeidstaker" />;
  }
  // Strukturerer objektet på en måte som gjør det mulig å bruke samme
  // visningsformat som resten av løsningen
  const andelsObjekt = {
    arbeidsgiverNavn: andel.arbeidsgiverNavn,
    arbeidsgiverId: andel.arbeidsgiverOrgnr,
    arbeidsforholType: andel.arbeidsforholdType,
    eksternArbeidsforholdId: andel.eksternArbeidsforholdId,
  };
  return createVisningsnavnForAktivitet(andelsObjekt, getKodeverknavn);
};

const tableHeaderTextCodes = (isFagsakSVP = 'false') => {
  if (isFagsakSVP) {
    return ([
      'TilkjentYtelse.PeriodeData.Andel',
      'TilkjentYtelse.PeriodeData.Utbetalingsgrad',
      'TilkjentYtelse.PeriodeData.Refusjon',
      'TilkjentYtelse.PeriodeData.TilSoker',
      'TilkjentYtelse.PeriodeData.SisteUtbDato',
    ]);
  }
  return ([
    'TilkjentYtelse.PeriodeData.Andel',
    'TilkjentYtelse.PeriodeData.KontoType',
    'TilkjentYtelse.PeriodeData.Gradering',
    'TilkjentYtelse.PeriodeData.Utbetalingsgrad',
    'TilkjentYtelse.PeriodeData.Refusjon',
    'TilkjentYtelse.PeriodeData.TilSoker',
    'TilkjentYtelse.PeriodeData.SisteUtbDato',
  ]);
};

const findAndelsnavn = (andel, getKodeverknavn) => {
  switch (andel.aktivitetStatus.kode) {
    case aktivitetStatus.ARBEIDSTAKER:
      return createVisningNavnForUttakArbeidstaker(andel, getKodeverknavn);
    case aktivitetStatus.FRILANSER:
      return <FormattedMessage id="TilkjentYtelse.PeriodeData.Frilans" />;
    case aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE:
      return <FormattedMessage id="TilkjentYtelse.PeriodeData.SelvstendigNaeringsdrivende" />;
    case aktivitetStatus.DAGPENGER:
      return <FormattedMessage id="TilkjentYtelse.PeriodeData.Dagpenger" />;
    case aktivitetStatus.ARBEIDSAVKLARINGSPENGER:
      return <FormattedMessage id="TilkjentYtelse.PeriodeData.AAP" />;
    case aktivitetStatus.MILITAER_ELLER_SIVIL:
      return <FormattedMessage id="TilkjentYtelse.PeriodeData.Militaer" />;
    case aktivitetStatus.BRUKERS_ANDEL:
      return <FormattedMessage id="TilkjentYtelse.PeriodeData.BrukersAndel" />;

    default:
      return '';
  }
};

const getGradering = (andel) => {
  if (andel === undefined) {
    return null;
  }
  const stringId = andel.uttak && andel.uttak.gradering === true
    ? 'TilkjentYtelse.PeriodeData.Ja'
    : 'TilkjentYtelse.PeriodeData.Nei';
  return (
    <FormattedMessage
      id={stringId}
    />
  );
};

/**
 * TimeLineData
 *
 * Viser opp data fra valgt periode i tilkjent ytelse-tidslinjen
 */
const TilkjentYtelseTimeLineData = ({
  selectedItemStartDate,
  selectedItemEndDate,
  selectedItemData,
  callbackForward,
  callbackBackward,
  alleKodeverk,
  isSoknadSvangerskapspenger,
}) => {
  const numberOfDaysAndWeeks = calcDaysAndWeeks(selectedItemStartDate, selectedItemEndDate);
  const intl = useIntl();
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);

  return (
    <TimeLineDataContainer>
      <Row>
        <Column xs="10">
          <Element>
            <FormattedMessage id="TilkjentYtelse.PeriodeData.Detaljer" />
          </Element>
        </Column>
        <Column xs="2">
          <FloatRight>
            <TimeLineButton text={intl.formatMessage({ id: 'Timeline.prevPeriod' })} type="prev" callback={callbackBackward} />
            <TimeLineButton text={intl.formatMessage({ id: 'Timeline.nextPeriod' })} type="next" callback={callbackForward} />
          </FloatRight>
        </Column>
      </Row>
      <VerticalSpacer eightPx />
      <div className={styles.detailsPeriode}>
        <Row>
          <Column xs="7">
            <Element>
              <FormattedMessage
                id="TilkjentYtelse.PeriodeData.Periode"
                values={{
                  fomVerdi: moment(selectedItemStartDate)
                    .format(DDMMYYYY_DATE_FORMAT)
                    .toString(),
                  tomVerdi: moment(selectedItemEndDate)
                    .format(DDMMYYYY_DATE_FORMAT)
                    .toString(),
                }}
              />
            </Element>
          </Column>
          <div>
            <Column xs="5">
              <Normaltekst>
                <FormattedMessage
                  id={numberOfDaysAndWeeks.id}
                  values={{
                    weeks: numberOfDaysAndWeeks.weeks.toString(),
                    days: numberOfDaysAndWeeks.days.toString(),
                  }}
                />
              </Normaltekst>
            </Column>
          </div>
        </Row>
        <VerticalSpacer fourPx />
        <Row>
          <Column xs="12">
            <FormattedMessage
              id="TilkjentYtelse.PeriodeData.Dagsats"
              values={{ dagsatsVerdi: selectedItemData.dagsats, b: (...chunks) => <b>{chunks}</b> }}
            />
          </Column>
        </Row>
      </div>
      <VerticalSpacer eightPx />
      {selectedItemData.andeler.length !== 0
          && (
            <Table headerTextCodes={tableHeaderTextCodes(isSoknadSvangerskapspenger)}>
              {selectedItemData.andeler.map((andel, index) => (
                <TableRow key={`index${index + 1}`}>
                  <TableColumn>{findAndelsnavn(andel, getKodeverknavn)}</TableColumn>
                  {!isSoknadSvangerskapspenger && (
                    <TableColumn><Normaltekst>{uttakPeriodeNavn[andel.uttak.stonadskontoType]}</Normaltekst></TableColumn>
                  )}
                  {!isSoknadSvangerskapspenger && (
                    <TableColumn><Normaltekst>{getGradering(andel)}</Normaltekst></TableColumn>
                  )}
                  <TableColumn><Normaltekst>{andel.utbetalingsgrad}</Normaltekst></TableColumn>
                  <TableColumn>
                    <Normaltekst>
                      {andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER ? andel.refusjon : ''}
                    </Normaltekst>
                  </TableColumn>
                  <TableColumn><Normaltekst>{andel.tilSoker}</Normaltekst></TableColumn>
                  <TableColumn>
                    <Normaltekst>
                      {andel.sisteUtbetalingsdato ? moment(andel.sisteUtbetalingsdato)
                        .format(DDMMYYYY_DATE_FORMAT) : ''}
                    </Normaltekst>
                  </TableColumn>
                </TableRow>
              ))}
            </Table>
          )}
    </TimeLineDataContainer>
  );
};

TilkjentYtelseTimeLineData.propTypes = {
  selectedItemStartDate: PropTypes.string.isRequired,
  selectedItemEndDate: PropTypes.string.isRequired,
  selectedItemData: tilkjentYtelseBeregningresultatPropType,
  callbackForward: PropTypes.func.isRequired,
  callbackBackward: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  isSoknadSvangerskapspenger: PropTypes.bool.isRequired,
};

TilkjentYtelseTimeLineData.defaultProps = {
  selectedItemData: undefined,
};

export default TilkjentYtelseTimeLineData;
