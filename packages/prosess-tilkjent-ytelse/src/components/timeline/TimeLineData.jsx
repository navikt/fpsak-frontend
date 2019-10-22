import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn, createVisningsnavnForAktivitet } from '@fpsak-frontend/fp-felles';
import {
  Image, Table, TableColumn, TableRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { calcDaysAndWeeks, DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import arrowLeftImageUrl from '@fpsak-frontend/assets/images/arrow_left.svg';
import arrowLeftFilledImageUrl from '@fpsak-frontend/assets/images/arrow_left_filled.svg';
import arrowRightImageUrl from '@fpsak-frontend/assets/images/arrow_right.svg';
import arrowRightFilledImageUrl from '@fpsak-frontend/assets/images/arrow_right_filled.svg';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { uttakPeriodeNavn } from '@fpsak-frontend/kodeverk/src/uttakPeriodeType';

import tilkjentYtelseBeregningresultatPropType from '../../propTypes/tilkjentYtelseBeregningresultatPropType';

import styles from './timeLineData.less';

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
const TimeLineData = ({
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
    <Row>
      <Column xs="12">
        <div className={styles.showDataContainer}>
          <Row>
            <Column xs="10">
              <Element>
                <FormattedMessage id="TilkjentYtelse.PeriodeData.Detaljer" />
              </Element>
            </Column>
            <Column xs="2">
              <span className={styles.navigationPosition}>
                <Image
                  tabIndex="0"
                  className={styles.timeLineButton}
                  src={arrowLeftImageUrl}
                  srcHover={arrowLeftFilledImageUrl}
                  alt={intl.formatMessage({ id: 'Timeline.prevPeriod' })}
                  onMouseDown={callbackBackward}
                  onKeyDown={callbackBackward}
                />
                <Image
                  tabIndex="0"
                  className={styles.timeLineButton}
                  src={arrowRightImageUrl}
                  srcHover={arrowRightFilledImageUrl}
                  alt={intl.formatMessage({ id: 'Timeline.nextPeriod' })}
                  onMouseDown={callbackForward}
                  onKeyDown={callbackForward}
                />
              </span>
            </Column>
          </Row>
          <VerticalSpacer eightPx />
          <div className={styles.detialsPeriod}>
            <Row>
              <Column xs="7">
                <Element>
                  <FormattedMessage
                    id="TilkjentYtelse.PeriodeData.Periode"
                    values={{
                      fomVerdi: moment(selectedItemStartDate).format(DDMMYYYY_DATE_FORMAT).toString(),
                      tomVerdi: moment(selectedItemEndDate).format(DDMMYYYY_DATE_FORMAT).toString(),
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
                <FormattedHTMLMessage
                  id="TilkjentYtelse.PeriodeData.Dagsats"
                  values={{ dagsatsVerdi: selectedItemData.dagsats }}
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
                      {andel.sisteUtbetalingsdato ? moment(andel.sisteUtbetalingsdato).format(DDMMYYYY_DATE_FORMAT) : ''}
                    </Normaltekst>
                  </TableColumn>
                </TableRow>
              ))}
            </Table>
          )}
        </div>
      </Column>
    </Row>
  );
};

TimeLineData.propTypes = {
  selectedItemStartDate: PropTypes.string.isRequired,
  selectedItemEndDate: PropTypes.string.isRequired,
  selectedItemData: tilkjentYtelseBeregningresultatPropType,
  callbackForward: PropTypes.func.isRequired,
  callbackBackward: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  isSoknadSvangerskapspenger: PropTypes.bool.isRequired,
};

TimeLineData.defaultProps = {
  selectedItemData: undefined,
};

export default TimeLineData;
