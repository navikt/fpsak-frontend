import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import { InputField, SelectField } from '@fpsak-frontend/form';
import {
  VerticalSpacer, Table, TableRow, TableColumn,
} from '@fpsak-frontend/shared-components';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  required, createVisningsnavnForAktivitet, formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber, DDMMYYYY_DATE_FORMAT,
} from '@fpsak-frontend/utils';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { LINK_TIL_REGNEARK } from '@fpsak-frontend/fp-felles';

import { getFaktaOmBeregning } from 'behandlingFpsak/src/behandlingSelectors';
import { getKodeverk } from 'behandlingFpsak/src/duck';
import { getFormValuesForBeregning } from '../../BeregningFormUtils';

import styles from './fastsettBBFodendeKvinneForm.less';

export const createInputFieldKeyForAndel = andel => `Inputfield_${andel.aktivitetStatus.kode}_${andel.andelsnr}`;

export const createSelectfieldKeyForAndel = andel => `Selectfield_${andel.aktivitetStatus.kode}_${andel.andelsnr}`;

const createVisningsnavnForAndel = (andel) => {
  if (andel.aktivitetStatus && andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER) {
    return createVisningsnavnForAktivitet(andel.arbeidsforhold);
  }
  return andel.aktivitetStatus ? andel.aktivitetStatus.navn : '';
};

const inntektskategoriSelectValues = kategorier => (kategorier.map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>));


const createTableRow = (andel, readOnly, isAksjonspunktClosed, inntektskategorier) => (
  <TableRow key={createInputFieldKeyForAndel(andel)}>
    <TableColumn>
      <Normaltekst>{createVisningsnavnForAndel(andel)}</Normaltekst>
    </TableColumn>
    <TableColumn>
      {andel.arbeidsperiodeFom
        && (
        <Normaltekst>
          <FormattedMessage
            id="BeregningInfoPanel.VurderOgFastsettATFL.Periode"
            values={{
              fom: andel.arbeidsperiodeFom ? moment(andel.arbeidsperiodeFom).format(DDMMYYYY_DATE_FORMAT) : '',
              tom: andel.arbeidsperiodeTom ? moment(andel.arbeidsperiodeTom).format(DDMMYYYY_DATE_FORMAT) : '',
            }}
          />
        </Normaltekst>
        )
        }
    </TableColumn>
    <TableColumn>
      <Normaltekst>
        {andel.refusjonskrav ? formatCurrencyNoKr(andel.refusjonskrav) : ''}
      </Normaltekst>
    </TableColumn>
    <TableColumn>
      <div className={readOnly ? styles.adjustedFieldInput : styles.rightAlignInput}>
        <InputField
          name={createInputFieldKeyForAndel(andel)}
          bredde="S"
          validate={[required]}
          parse={parseCurrencyInput}
          isEdited={isAksjonspunktClosed}
          readOnly={readOnly}
        />
      </div>
    </TableColumn>
    <TableColumn>
      <SelectField
        name={createSelectfieldKeyForAndel(andel)}
        validate={[required]}
        label=""
        selectValues={inntektskategoriSelectValues(inntektskategorier)}
        readOnly={readOnly && isAksjonspunktClosed}
      />
    </TableColumn>
  </TableRow>);

const createSummaryRow = totalSum => (
  <TableRow key="SummaryRowBB">
    <TableColumn>
      <Normaltekst><FormattedMessage id="BeregningInfoPanel.FastsettBBFodendeKvinne.Sum" /></Normaltekst>
    </TableColumn>
    <TableColumn />
    <TableColumn />
    <TableColumn>
      <Element>{totalSum}</Element>
    </TableColumn>
    <TableColumn />
  </TableRow>
);

const createTableRows = (besteberegningAndeler, readOnly, isAksjonspunktClosed, inntektskategorier, totalSum) => {
  const rows = besteberegningAndeler.map(andel => (
    createTableRow(andel, readOnly, isAksjonspunktClosed, inntektskategorier)
  ));
  rows.push(createSummaryRow(totalSum));
  return rows;
};

/**
 * FastsettBBFodendeKvinneForm
 *
 * Presentasjonskomponent.
 *
 */
const FastsettBBFodendeKvinneForm = ({
  readOnly,
  isAksjonspunktClosed,
  besteberegningAndeler,
  inntektskategorier,
  totalSum,
}) => {
  const headerTextCodes = [
    'BeregningInfoPanel.FastsettInntektTabell.Aktivitet',
    'BeregningInfoPanel.FastsettInntektTabell.Arbeidsperiode',
    'BeregningInfoPanel.FastsettInntektTabell.Refusjonskrav',
    'BeregningInfoPanel.FastsettInntektTabell.InntektPrMnd',
    'BeregningInfoPanel.FastsettInntektTabell.Inntektskategori',
  ];
  return (
    <div>
      <Row>
        <Column xs="9">
          <FormattedMessage id="BeregningInfoPanel.FastsettBBFodendeKvinne.FastsettBB" />
        </Column>
        <Column xs="3">
          <a
            className={styles.navetLink}
            href={LINK_TIL_REGNEARK}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FormattedMessage id="BeregningInfoPanel.FastsettBBFodendeKvinne.RegnarkNavet" />
          </a>
        </Column>
      </Row>
      <VerticalSpacer space={2} />
      <Row>
        <Column xs="12">
          <Table headerTextCodes={headerTextCodes} noHover classNameTable={styles.inntektTable}>
            {createTableRows(besteberegningAndeler, readOnly, isAksjonspunktClosed, inntektskategorier, totalSum)}
          </Table>
        </Column>
      </Row>
    </div>
  );
};

FastsettBBFodendeKvinneForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  besteberegningAndeler: PropTypes.arrayOf(PropTypes.shape()),
  inntektskategorier: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  totalSum: PropTypes.string,
};

FastsettBBFodendeKvinneForm.defaultProps = {
  besteberegningAndeler: PropTypes.arrayOf(PropTypes.shape()),
  totalSum: '',
};

const finnKorrektBGAndelFraFaktaOmBeregningAndel = (faktaOmBeregningAndel, beregningsgrunnlag) => {
  const forstePeriode = beregningsgrunnlag.beregningsgrunnlagPeriode
    ? beregningsgrunnlag.beregningsgrunnlagPeriode[0] : undefined;
  return forstePeriode
    ? forstePeriode.beregningsgrunnlagPrStatusOgAndel.find(andel => andel.andelsnr === faktaOmBeregningAndel.andelsnr) : undefined;
};

const finnKorrektFastsattInntekt = (andel) => {
  if (!andel || !andel.aktivitetStatus) {
    return undefined;
  }
  if (andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) {
    const besteberegning = andel.besteberegningPrAar;
    return besteberegning !== undefined && besteberegning !== null ? formatCurrencyNoKr(besteberegning / 12) : '';
  }
  const beregnet = andel.beregnetPrAar;
  return beregnet !== undefined && beregnet !== null ? formatCurrencyNoKr(beregnet / 12) : '';
};

FastsettBBFodendeKvinneForm.buildInitialValues = (beregningsgrunnlag) => {
  const initialValues = {};
  const faktaOmBeregning = beregningsgrunnlag ? beregningsgrunnlag.faktaOmBeregning : undefined;
  if (!beregningsgrunnlag || !faktaOmBeregning || !beregningsgrunnlag.beregningsgrunnlagPeriode
    || beregningsgrunnlag.beregningsgrunnlagPeriode.length < 1 || faktaOmBeregning.vurderBesteberegning) {
    return initialValues;
  }

  if (faktaOmBeregning.besteberegningAndeler !== null) {
    faktaOmBeregning.besteberegningAndeler.forEach((forhold) => {
      const korrektAndel = finnKorrektBGAndelFraFaktaOmBeregningAndel(forhold, beregningsgrunnlag);
      const inntekt = finnKorrektFastsattInntekt(korrektAndel);
      if (inntekt !== undefined) {
        const inputfieldKey = createInputFieldKeyForAndel(forhold);
        initialValues[inputfieldKey] = inntekt;
      }
      if (forhold.inntektskategori && forhold.inntektskategori.kode) {
        const selectfieldKey = createSelectfieldKeyForAndel(forhold);
        initialValues[selectfieldKey] = forhold.inntektskategori.kode;
      }
    });
  }
  return initialValues;
};

FastsettBBFodendeKvinneForm.transformValues = (values, faktaOmBeregning) => {
  if (!faktaOmBeregning || !faktaOmBeregning.besteberegningAndeler || faktaOmBeregning.vurderBesteberegning) {
    return {};
  }
  const transformedValues = [];
  faktaOmBeregning.besteberegningAndeler.forEach((andel) => {
    const inputKey = createInputFieldKeyForAndel(andel);
    const selectKey = createSelectfieldKeyForAndel(andel);
    transformedValues.push({
      inntektPrMnd: removeSpacesFromNumber(values[inputKey]),
      inntektskategori: values[selectKey],
      andelsnr: andel.andelsnr,
      nyAndel: false,
      lagtTilAvSaksbehandler: false,
      fastsatteVerdier: {
        fastsattBeløp: removeSpacesFromNumber(values[inputKey]),
        inntektskategori: values[selectKey],
      },
    });
  });
  return {
    besteberegningAndeler: { besteberegningAndelListe: transformedValues },
  };
};

const sorterKodeverkAlfabetisk = kodeverkListe => kodeverkListe.slice().sort((a, b) => a.navn.localeCompare(b.navn));

const mapStateToProps = (state) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  if (!faktaOmBeregning) {
    return {};
  }
  const inntekter = [];
  faktaOmBeregning.besteberegningAndeler.forEach((andel) => {
    const inputfieldKey = createInputFieldKeyForAndel(andel);
    const stringSum = getFormValuesForBeregning(state)[inputfieldKey];
    if (stringSum) {
      inntekter.push(removeSpacesFromNumber(stringSum));
    }
  });
  let totalSum = '';
  if (inntekter.length > 0) {
    totalSum = formatCurrencyNoKr(inntekter.reduce((a, b) => a + b));
  }
  return {
    totalSum,
    besteberegningAndeler: faktaOmBeregning.besteberegningAndeler,
    inntektskategorier: sorterKodeverkAlfabetisk(getKodeverk(kodeverkTyper.INNTEKTSKATEGORI)(state)),
  };
};

export default connect(mapStateToProps)(FastsettBBFodendeKvinneForm);
