import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { NavFieldGroup } from '@fpsak-frontend/form';
import {
  formatCurrencyNoKr, isArrayEmpty, removeSpacesFromNumber, required,
} from '@fpsak-frontend/utils';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { Table, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { mapAndelToField, skalFastsetteInntektForSN, skalHaBesteberegningSelector } from './BgFordelingUtils';
import styles from './inntektFieldArray.less';
import { validateUlikeAndeler, validateUlikeAndelerWithGroupingFunction } from './ValidateAndelerUtils';
import { isBeregningFormDirty as isFormDirty } from '../BeregningFormUtils';
import { AndelRow, getHeaderTextCodes } from './InntektFieldArrayRow';
import AddAndelButton from './AddAndelButton';
import SummaryRow from './SummaryRow';


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

const skalViseRad = (field, skalFastsetteSN) => field.aktivitetStatus !== aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE || skalFastsetteSN;

const createAndelerTableRows = (
  fields,
  readOnly,
  skalFastsetteSN,
  beregningsgrunnlag,
  behandlingId,
  behandlingVersjon,
  isAksjonspunktClosed,
  alleKodeverk,
) => {
  const rows = [];
  fields.forEach((andelElementFieldId, index) => {
    const field = fields.get(index);
    if (skalViseRad(field, skalFastsetteSN)) {
      rows.push(
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
          behandlingId={behandlingId}
          beregningsgrunnlag={beregningsgrunnlag}
          behandlingVersjon={behandlingVersjon}
          isAksjonspunktClosed={isAksjonspunktClosed}
          alleKodeverk={alleKodeverk}
        />,
      );
    }
  });
  return rows;
};

const createBruttoBGSummaryRow = (fields, readOnly, beregningsgrunnlag, behandlingId, behandlingVersjon) => (
  <SummaryRow

    readOnly={readOnly}
    key="summaryRow"
    skalVisePeriode={skalVisePeriode(fields)}
    skalViseRefusjon={skalViseRefusjon(fields)}
    fields={fields}
    beregningsgrunnlag={beregningsgrunnlag}
    behandlingId={behandlingId}
    behandlingVersjon={behandlingVersjon}
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
      const field = fields.get(dpIndex);
      if (field.lagtTilAvSaksbehandler) {
        fields.remove(dpIndex);
      }
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
  skalFastsetteSN,
  behandlingId,
  behandlingVersjon,
  beregningsgrunnlag,
  isAksjonspunktClosed,
  alleKodeverk,
}) => {
  const tablerows = createAndelerTableRows(
    fields,
    readOnly,
    skalFastsetteSN,
    beregningsgrunnlag,
    behandlingId,
    behandlingVersjon,
    isAksjonspunktClosed,
    alleKodeverk,
  );
  leggTilDagpengerOmBesteberegning(fields, skalHaBesteberegning, aktivitetStatuser, dagpengeAndelLagtTilIForrige);
  if (tablerows.length === 0) {
    return null;
  }
  tablerows.push(createBruttoBGSummaryRow(fields, readOnly, beregningsgrunnlag, behandlingId, behandlingVersjon));
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
          alleKodeverk={alleKodeverk}
        />
      )}
      <VerticalSpacer eightPx />
    </NavFieldGroup>
  );
};

InntektFieldArrayImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  isBeregningFormDirty: PropTypes.bool.isRequired,
  erKunYtelse: PropTypes.bool.isRequired,
  skalKunneLeggeTilAndel: PropTypes.bool,
  aktivitetStatuser: PropTypes.arrayOf(kodeverkObjektPropType).isRequired,
  skalHaBesteberegning: PropTypes.bool.isRequired,
  dagpengeAndelLagtTilIForrige: PropTypes.shape(),
  skalFastsetteSN: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};

InntektFieldArrayImpl.defaultProps = {
  dagpengeAndelLagtTilIForrige: undefined,
  skalKunneLeggeTilAndel: true,
};

const InntektFieldArray = injectIntl(InntektFieldArrayImpl);

InntektFieldArray.transformValues = (values) => (values
  ? values.filter(({ skalRedigereInntekt }) => skalRedigereInntekt).map((fieldValue) => ({
    andelsnr: fieldValue.andelsnr,
    fastsattBelop: removeSpacesFromNumber(fieldValue.fastsattBelop),
    inntektskategori: fieldValue.inntektskategori,
    nyAndel: fieldValue.nyAndel,
    lagtTilAvSaksbehandler: fieldValue.lagtTilAvSaksbehandler,
    aktivitetStatus: fieldValue.aktivitetStatus,
    arbeidsforholdId: fieldValue.arbeidsforholdId,
    arbeidsgiverId: fieldValue.arbeidsgiverId,
  })) : null
);

const mapAndelToSortedObject = (value) => {
  const { andel, inntektskategori } = value;
  return { andelsinfo: andel, inntektskategori };
};

InntektFieldArray.validate = (values, erKunYtelse, skalRedigereInntekt) => {
  const arrayErrors = values
    .map((andelFieldValues) => {
      const fieldErrors = {};
      fieldErrors.andel = required(andelFieldValues.andel);
      fieldErrors.fastsattBelop = skalRedigereInntekt(andelFieldValues) ? required(andelFieldValues.fastsattBelop) : null;
      fieldErrors.inntektskategori = required(andelFieldValues.inntektskategori);
      return fieldErrors.andel || fieldErrors.fastsattBelop || fieldErrors.inntektskategori ? fieldErrors : null;
    });
  if (arrayErrors.some((errors) => errors !== null)) {
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
  return andeler.map((a) => mapAndelToField(a));
};

const finnDagpengeAndelLagtTilIForrige = (bg) => {
  const andelerLagtTil = bg.beregningsgrunnlagPeriode[0].andelerLagtTilManueltIForrige;
  return andelerLagtTil
    ? andelerLagtTil.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.DAGPENGER) : undefined;
};

export const mapStateToProps = (state, ownProps) => {
  const isBeregningFormDirty = isFormDirty(state, ownProps);
  const aktivitetStatuser = ownProps.alleKodeverk[kodeverkTyper.AKTIVITET_STATUS];
  const skalHaBesteberegning = skalHaBesteberegningSelector(state, ownProps) === true;
  const skalFastsetteSN = skalFastsetteInntektForSN(state, ownProps);
  const tilfeller = ownProps.beregningsgrunnlag.faktaOmBeregning.faktaOmBeregningTilfeller
    ? ownProps.beregningsgrunnlag.faktaOmBeregning.faktaOmBeregningTilfeller.map(({ kode }) => kode) : [];
  return {
    skalFastsetteSN,
    isBeregningFormDirty,
    skalHaBesteberegning,
    aktivitetStatuser,
    dagpengeAndelLagtTilIForrige: finnDagpengeAndelLagtTilIForrige(ownProps.beregningsgrunnlag),
    erKunYtelse: tilfeller && tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE),
  };
};


export default connect(mapStateToProps)(InntektFieldArray);
