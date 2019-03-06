import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { getFaktaOmBeregningTilfellerKoder } from 'behandlingFpsak/src/behandlingSelectors';
import { NavFieldGroup } from '@fpsak-frontend/form';
import {
  isArrayEmpty, formatCurrencyNoKr, removeSpacesFromNumber, required,
} from '@fpsak-frontend/utils';
import { getKodeverk } from 'behandlingFpsak/src/duck';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { Table, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { setGenerellAndelsinfo, setArbeidsforholdInitialValues } from './BgFordelingUtils';
import styles from './kunYtelse/brukersAndelFieldArray.less';
import { validateUlikeAndeler, validateUlikeAndelerWithGroupingFunction } from './ValidateAndelerUtils';
import { isBeregningFormDirty as isFormDirty } from '../BeregningFormUtils';
import { AndelRow, getHeaderTextCodes, SummaryRow } from './InntektFieldArrayRow';
import AddAndelButton from './AddAndelButton';

const dagpenger = aktivitetStatuser => ({
  andel: aktivitetStatuser.filter(({ kode }) => kode === aktivitetStatus.DAGPENGER)[0].navn,
  aktivitetStatus: aktivitetStatus.DAGPENGER,
  fastsattBeløp: '',
  inntektskategori: inntektskategorier.DAGPENGER,
  nyAndel: true,
  skalKunneEndreAktivitet: false,
  lagtTilAvSaksbehandler: true,
});


const isDirty = (meta, isBeregningFormDirty) => (meta.dirty || isBeregningFormDirty);

const getErrorMessage = (meta, intl, isBeregningFormDirty) => (meta.error && isDirty(meta, isBeregningFormDirty)
&& meta.submitFailed ? intl.formatMessage(...meta.error) : null);

const skalViseSletteknapp = (index, fields, readOnly) => (fields.get(index).skalKunneEndreAktivitet && !readOnly);


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

const harDagpenger = (fields) => {
  let harDp = false;
  fields.forEach((id, index) => {
    const field = fields.get(index);
    if (field.aktivitetStatus === aktivitetStatus.DAGPENGER) {
      harDp = true;
    }
  });
  return harDp;
};

export const leggTilDagpengerOmBesteberegning = (fields, skalHaBesteberegning, aktivitetStatuser) => {
  if (!skalHaBesteberegning || harDagpenger(fields)) {
    return;
  }
  fields.push(dagpenger(aktivitetStatuser));
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
  aktivitetStatuser,
  readOnly,
  isBeregningFormDirty,
  erKunYtelse,
  skalHaBesteberegning,
  skalKunneLeggeTilAndel,
}) => {
  const tablerows = createAndelerTableRows(fields, readOnly);
  tablerows.push(createBruttoBGSummaryRow(fields));
  leggTilDagpengerOmBesteberegning(fields, skalHaBesteberegning, aktivitetStatuser);
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
  aktivitetStatuser: kodeverkPropType.isRequired,
  isBeregningFormDirty: PropTypes.bool.isRequired,
  erKunYtelse: PropTypes.bool.isRequired,
  skalHaBesteberegning: PropTypes.bool.isRequired,
  skalKunneLeggeTilAndel: PropTypes.bool,
};

InntektFieldArrayImpl.defaultProps = {
  skalKunneLeggeTilAndel: true,
};

const InntektFieldArray = injectIntl(InntektFieldArrayImpl);

InntektFieldArray.transformValues = values => (
  values.map(fieldValue => ({
    andelsnr: fieldValue.andelsnr,
    fastsattBelop: removeSpacesFromNumber(fieldValue.fastsattBelop),
    inntektskategori: fieldValue.inntektskategori,
    nyAndel: fieldValue.nyAndel,
    lagtTilAvSaksbehandler: fieldValue.lagtTilAvSaksbehandler,
  }))
);

const mapAndelToSortedObject = (value) => {
  const { andel, inntektskategori } = value;
  return { andelsinfo: andel, inntektskategori };
};

InntektFieldArray.validate = (values, erKunYtelse) => {
  const arrayErrors = values.map((andelFieldValues) => {
    const fieldErrors = {};
    fieldErrors.andel = required(andelFieldValues.andel);
    fieldErrors.fastsattBelop = required(andelFieldValues.fastsattBelop);
    fieldErrors.inntektskategori = required(andelFieldValues.inntektskategori);
    return fieldErrors.fastsattBelop || fieldErrors.inntektskategori ? fieldErrors : null;
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
  return andeler.map(andel => ({
    ...setGenerellAndelsinfo(andel),
    ...setArbeidsforholdInitialValues(andel),
    skalKunneEndreAktivitet: andel.lagtTilAvSaksbehandler && andel.aktivitetStatus.kode !== aktivitetStatus.DAGPENGER,
    fastsattBelop: andel.fastsattBelopPrMnd || andel.fastsattBelopPrMnd === 0
      ? formatCurrencyNoKr(andel.fastsattBelopPrMnd) : '',
    refusjonskrav: andel.refusjonPrMnd !== null && andel.refusjonPrMnd !== undefined ? formatCurrencyNoKr(andel.refusjonPrMnd) : '',
  }));
};

export const mapStateToProps = (state) => {
  const tilfeller = getFaktaOmBeregningTilfellerKoder(state);
  const isBeregningFormDirty = isFormDirty(state);
  const aktivitetStatuser = getKodeverk(kodeverkTyper.AKTIVITET_STATUS)(state);
  return {
    isBeregningFormDirty,
    aktivitetStatuser,
    erKunYtelse: tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE),
  };
};


export default connect(mapStateToProps)(InntektFieldArray);
