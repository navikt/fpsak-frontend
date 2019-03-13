import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { getFaktaOmBeregningTilfellerKoder, getBeregningsgrunnlag } from 'behandlingFpsak/src/behandlingSelectors';
import { NavFieldGroup } from '@fpsak-frontend/form';
import {
  isArrayEmpty, removeSpacesFromNumber, required, formatCurrencyNoKr,
} from '@fpsak-frontend/utils';
import { getKodeverk } from 'behandlingFpsak/src/duck';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { Table, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { mapAndelToField, skalHaBesteberegningSelector } from './BgFordelingUtils';
import styles from './kunYtelse/brukersAndelFieldArray.less';
import { validateUlikeAndeler, validateUlikeAndelerWithGroupingFunction } from './ValidateAndelerUtils';
import { isBeregningFormDirty as isFormDirty } from '../BeregningFormUtils';
import { AndelRow, getHeaderTextCodes, SummaryRow } from './InntektFieldArrayRow';
import AddAndelButton from './AddAndelButton';

const dagpenger = (aktivitetStatuser, beregnetPrAar) => ({
  andel: aktivitetStatuser.filter(({ kode }) => kode === aktivitetStatus.DAGPENGER)[0].navn,
  aktivitetStatus: aktivitetStatus.DAGPENGER,
  fastsattBelop: beregnetPrAar || beregnetPrAar === 0 ? formatCurrencyNoKr(beregnetPrAar / 12) : '',
  inntektskategori: inntektskategorier.DAGPENGER,
  nyAndel: true,
  skalKunneEndreAktivitet: false,
  lagtTilAvSaksbehandler: true,
});


const isDirty = (meta, isBeregningFormDirty) => (meta.dirty || isBeregningFormDirty);

const getErrorMessage = (meta, intl, isBeregningFormDirty) => (meta.error && isDirty(meta, isBeregningFormDirty)
&& meta.submitFailed ? intl.formatMessage(...meta.error) : null);

const skalViseSletteknapp = (index, fields, readOnly) => (fields.get(index).skalKunneEndreAktivitet === true && !readOnly);


const skalViseRefusjon = (fields) => {
  let skalVise = false;
  fields.forEach((id, index) => {
    const field = fields.get(index);
    if (field.refusjonskrav !== '' && field.refusjonskrav !== null && field.refusjonskrav !== undefined) {
      skalVise = true;
    }
  });
  return skalVise;
};

const skalVisePeriode = (fields) => {
  let skalVise = false;
  fields.forEach((id, index) => {
    const field = fields.get(index);
    if (field.arbeidsgiverId !== '') {
      skalVise = true;
    }
  });
  return skalVise;
};

const removeAndel = (fields, index) => () => {
  fields.remove(index);
};

const createAndelerTableRows = (fields, readOnly) => fields.map((andelElementFieldId, index) => (
  <AndelRow
    key={andelElementFieldId}
    fields={fields}
    skalVisePeriode={skalVisePeriode(fields)}
    skalViseRefusjon={skalViseRefusjon(fields)}
    skalViseSletteknapp={skalViseSletteknapp(index, fields, readOnly)}
    andelElementFieldId={andelElementFieldId}
    readOnly={readOnly}
    removeAndel={removeAndel(fields, index)}
    index={index}
  />
));

const createBruttoBGSummaryRow = fields => (
  <SummaryRow
    key="summaryRow"
    skalVisePeriode={skalVisePeriode(fields)}
    skalViseRefusjon={skalViseRefusjon(fields)}
    fields={fields}
  />
);

const findDagpengerIndex = (fields) => {
  let dagpengerIndex = -1;
  fields.forEach((id, index) => {
    const field = fields.get(index);
    if (field.aktivitetStatus === aktivitetStatus.DAGPENGER) {
      dagpengerIndex = index;
    }
  });
  return dagpengerIndex;
};

export const leggTilDagpengerOmBesteberegning = (fields, skalHaBesteberegning, aktivitetStatuser, dagpengeAndelLagtTilIForrige) => {
  const dpIndex = findDagpengerIndex(fields);
  if (!skalHaBesteberegning) {
    if (dpIndex !== -1) {
      fields.remove(dpIndex);
    }
    return;
  }
  if (dpIndex !== -1) {
    return;
  }
  fields.push(dagpenger(aktivitetStatuser, dagpengeAndelLagtTilIForrige ? dagpengeAndelLagtTilIForrige.beregnetPrAar : undefined));
};


/**
 *  InntektFieldArray
 *
 * Presentasjonskomponent: Viser fordeling for andeler
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const InntektFieldArrayImpl = ({
  fields,
  meta,
  intl,
  readOnly,
  isBeregningFormDirty,
  erKunYtelse,
  skalKunneLeggeTilAndel,
  aktivitetStatuser,
  dagpengeAndelLagtTilIForrige,
  skalHaBesteberegning,
}) => {
  const tablerows = createAndelerTableRows(fields, readOnly);
  tablerows.push(createBruttoBGSummaryRow(fields));
  leggTilDagpengerOmBesteberegning(fields, skalHaBesteberegning, aktivitetStatuser, dagpengeAndelLagtTilIForrige);
  return (
    <NavFieldGroup errorMessage={getErrorMessage(meta, intl, isBeregningFormDirty)}>
      <Table headerTextCodes={getHeaderTextCodes(skalVisePeriode(fields), skalViseRefusjon(fields))} noHover classNameTable={styles.inntektTable}>
        {tablerows}
      </Table>
      {!readOnly && skalKunneLeggeTilAndel
      && (
        <AddAndelButton
          erKunYtelse={erKunYtelse}
          fields={fields}
        />
      )
      }
      <VerticalSpacer eightPx />
    </NavFieldGroup>
  );
};

InntektFieldArrayImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
  isBeregningFormDirty: PropTypes.bool.isRequired,
  erKunYtelse: PropTypes.bool.isRequired,
  skalKunneLeggeTilAndel: PropTypes.bool,
  aktivitetStatuser: PropTypes.arrayOf(kodeverkObjektPropType).isRequired,
  skalHaBesteberegning: PropTypes.bool.isRequired,
  dagpengeAndelLagtTilIForrige: PropTypes.shape(),
};

InntektFieldArrayImpl.defaultProps = {
  dagpengeAndelLagtTilIForrige: undefined,
  skalKunneLeggeTilAndel: true,
};

const InntektFieldArray = injectIntl(InntektFieldArrayImpl);

InntektFieldArray.transformValues = values => (
  values.filter(({ skalRedigereInntekt }) => skalRedigereInntekt).map(fieldValue => ({
    andelsnr: fieldValue.andelsnr,
    fastsattBelop: removeSpacesFromNumber(fieldValue.fastsattBelop),
    inntektskategori: fieldValue.inntektskategori,
    nyAndel: fieldValue.nyAndel,
    lagtTilAvSaksbehandler: fieldValue.lagtTilAvSaksbehandler,
    aktivitetStatus: fieldValue.aktivitetStatus,
  }))
);

const mapAndelToSortedObject = (value) => {
  const { andel, inntektskategori } = value;
  return { andelsinfo: andel, inntektskategori };
};

InntektFieldArray.validate = (values, erKunYtelse, skalRedigereInntekt) => {
  const arrayErrors = values
    .filter(skalRedigereInntekt)
    .map((andelFieldValues) => {
      const fieldErrors = {};
      fieldErrors.andel = required(andelFieldValues.andel);
      fieldErrors.fastsattBelop = required(andelFieldValues.fastsattBelop);
      fieldErrors.inntektskategori = required(andelFieldValues.inntektskategori);
      return fieldErrors.andel || fieldErrors.fastsattBelop || fieldErrors.inntektskategori ? fieldErrors : null;
    });
  if (arrayErrors.some(errors => errors !== null)) {
    return arrayErrors;
  }
  if (isArrayEmpty(values)) {
    return null;
  }
  const ulikeAndelerError = erKunYtelse ? validateUlikeAndelerWithGroupingFunction(values, mapAndelToSortedObject) : validateUlikeAndeler(values);
  if (ulikeAndelerError) {
    return { _error: ulikeAndelerError };
  }
  return null;
};


InntektFieldArray.buildInitialValues = (andeler) => {
  if (!andeler || andeler.length === 0) {
    return {};
  }
  return andeler.map(mapAndelToField);
};

const finnDagpengeAndelLagtTilIForrige = (bg) => {
  const andelerLagtTil = bg.beregningsgrunnlagPeriode[0].andelerLagtTilManueltIForrige;
  return andelerLagtTil
    ? andelerLagtTil.find(andel => andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) : undefined;
};

export const mapStateToProps = (state) => {
  const tilfeller = getFaktaOmBeregningTilfellerKoder(state);
  const isBeregningFormDirty = isFormDirty(state);
  const aktivitetStatuser = getKodeverk(kodeverkTyper.AKTIVITET_STATUS)(state);
  const skalHaBesteberegning = skalHaBesteberegningSelector(state) === true;
  return {
    isBeregningFormDirty,
    skalHaBesteberegning,
    aktivitetStatuser,
    dagpengeAndelLagtTilIForrige: finnDagpengeAndelLagtTilIForrige(getBeregningsgrunnlag(state)),
    erKunYtelse: tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE),
  };
};


export default connect(mapStateToProps)(InntektFieldArray);
