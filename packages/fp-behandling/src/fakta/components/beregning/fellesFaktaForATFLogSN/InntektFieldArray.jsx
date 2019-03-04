import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { getAksjonspunkter, getFaktaOmBeregningTilfellerKoder } from 'behandlingFpsak/src/behandlingSelectors';
import { InputField, NavFieldGroup, SelectField } from '@fpsak-frontend/form';
import {
  isArrayEmpty, formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber, required,
} from '@fpsak-frontend/utils';
import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import { getKodeverk } from 'behandlingFpsak/src/duck';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import inntektskategorier from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import {
  Image, Table, TableRow, TableColumn, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { setGenerellAndelsinfo } from './BgFordelingUtils';
import { arbeidsforholdProptype, getUniqueListOfArbeidsforhold } from '../ArbeidsforholdHelper';
import styles from './kunYtelse/brukersAndelFieldArray.less';
import { validateUlikeAndeler, validateUlikeAndelerWithGroupingFunction } from './ValidateAndelerUtils';
import ArbeidsforholdField from './ArbeidsforholdField';
import { isBeregningFormDirty as isFormDirty } from '../BeregningFormUtils';

const defaultBGFordeling = (aktivitetStatuser, erKunYtelse) => ({
  andel: erKunYtelse ? aktivitetStatuser.filter(({ kode }) => kode === aktivitetStatus.BRUKERS_ANDEL)[0].navn : undefined,
  fastsattBeløp: '',
  inntektskategori: '',
  nyAndel: true,
  skalKunneEndreAktivitet: true,
  lagtTilAvSaksbehandler: true,
});

const dagpenger = aktivitetStatuser => ({
  andel: aktivitetStatuser.filter(({ kode }) => kode === aktivitetStatus.DAGPENGER)[0].navn,
  aktivitetStatus: aktivitetStatus.DAGPENGER,
  fastsattBeløp: '',
  inntektskategori: inntektskategorier.DAGPENGER,
  nyAndel: true,
  skalKunneEndreAktivitet: false,
  lagtTilAvSaksbehandler: true,
});

const inntektskategoriSelectValues = kategorier => kategorier.map(ik => (
  <option value={ik.kode} key={ik.kode}>
    {ik.navn}
  </option>
));

const summerFordeling = (fields) => {
  let sum = 0;
  fields.forEach((andelElementFieldId, index) => {
    sum += fields.get(index).fastsattBeløp ? parseInt(removeSpacesFromNumber(fields.get(index).fastsattBeløp), 10) : 0;
  });
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const isDirty = (meta, isBeregningFormDirty) => (meta.dirty || isBeregningFormDirty);

const getErrorMessage = (meta, intl, isBeregningFormDirty) => (meta.error && isDirty(meta, isBeregningFormDirty)
&& meta.submitFailed ? intl.formatMessage(...meta.error) : null);

const skalViseSletteknapp = (index, fields, readOnly) => (fields.get(index).skalKunneEndreAktivitet && !readOnly);

const onKeyDown = (fields, aktivitetStatuser, erKunYtelse) => ({ keyCode }) => {
  if (keyCode === 13) {
    fields.push(defaultBGFordeling(aktivitetStatuser, erKunYtelse));
  }
};

const createAndelerTableRows = (fields, isAksjonspunktClosed, readOnly,
  inntektskategoriKoder, intl, erKunYtelse, arbeidsforholdList) => fields.map((andelElementFieldId, index) => (
    <TableRow key={andelElementFieldId}>
      <TableColumn>
        {erKunYtelse && <FormattedMessage id="BeregningInfoPanel.FordelingBG.Ytelse" />}
        {!erKunYtelse
          && (
          <ArbeidsforholdField
            fields={fields}
            index={index}
            name={`${andelElementFieldId}.andel`}
            readOnly={readOnly}
            arbeidsforholdList={arbeidsforholdList}
          />
          )
        }
      </TableColumn>
      <TableColumn className={styles.rightAlignInput}>
        <InputField
          name={`${andelElementFieldId}.fastsattBeløp`}
          bredde="M"
          parse={parseCurrencyInput}
          readOnly={readOnly}
          isEdited={isAksjonspunktClosed}
        />
      </TableColumn>
      <TableColumn className={styles.rightAlign}>
        <SelectField
          label=""
          name={`${andelElementFieldId}.inntektskategori`}
          bredde="l"
          selectValues={inntektskategoriSelectValues(inntektskategoriKoder)}
          value={fields.get(index).inntektskategori}
          readOnly={readOnly}
          isEdited={isAksjonspunktClosed}
        />
      </TableColumn>
      <TableColumn>
        {skalViseSletteknapp(index, fields, readOnly)
      && (
        <button
          className={styles.buttonRemove}
          type="button"
          onClick={() => {
            fields.remove(index);
          }}
          title={intl.formatMessage({ id: 'BeregningInfoPanel.FordelingBG.FjernAndel' })}
        />
      )
      }
      </TableColumn>
    </TableRow>
));
const createBruttoBGSummaryRow = sumFordeling => (
  <TableRow key="bruttoBGSummaryRow">
    <TableColumn>
      <FormattedMessage id="BeregningInfoPanel.FordelingBG.Sum" />
    </TableColumn>
    <TableColumn className={styles.rightAlign}>
      <Undertekst>
        {sumFordeling}
      </Undertekst>
    </TableColumn>
    <TableColumn />
  </TableRow>
);

const getHeaderTextCodes = () => ([
  'BeregningInfoPanel.FordelingBG.Andel',
  'BeregningInfoPanel.FordelingBG.Fordeling',
  'BeregningInfoPanel.FordelingBG.Inntektskategori']
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
  inntektskategoriKoder,
  aktivitetStatuser,
  readOnly,
  isAksjonspunktClosed,
  isBeregningFormDirty,
  erKunYtelse,
  arbeidsforholdList,
  skalHaBesteberegning,
  skalKunneLeggeTilAndel,
}) => {
  const sumFordeling = summerFordeling(fields) || 0;
  const tablerows = createAndelerTableRows(fields, isAksjonspunktClosed, readOnly, inntektskategoriKoder, intl,
    erKunYtelse, arbeidsforholdList);
  tablerows.push(createBruttoBGSummaryRow(sumFordeling));
  leggTilDagpengerOmBesteberegning(fields, skalHaBesteberegning, aktivitetStatuser);
  return (
    <NavFieldGroup errorMessage={getErrorMessage(meta, intl, isBeregningFormDirty)}>
      <Table headerTextCodes={getHeaderTextCodes()} noHover classNameTable={styles.inntektTable}>
        {tablerows}
      </Table>
      {!readOnly && skalKunneLeggeTilAndel
      && (
        <Row className={styles.buttonRow}>
          <Column xs="3">
            {// eslint-disable-next-line jsx-a11y/click-events-have-key-events
            }
            <div
              id="leggTilAndelDiv"
              onClick={() => {
                fields.push(defaultBGFordeling(aktivitetStatuser, erKunYtelse));
              }}
              onKeyDown={onKeyDown(fields, aktivitetStatuser, erKunYtelse)}
              className={styles.addPeriode}
              role="button"
              tabIndex="0"
              title={intl.formatMessage({ id: 'BeregningInfoPanel.FordelingBG.LeggTilAndel' })}
            >
              <Image
                className={styles.addCircleIcon}
                src={addCircleIcon}
              />
              <Undertekst className={styles.imageText}>
                {' '}
                <FormattedMessage
                  id="BeregningInfoPanel.FordelingBG.LeggTilAndel"
                />
              </Undertekst>
            </div>
          </Column>
        </Row>
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
  inntektskategoriKoder: kodeverkPropType.isRequired,
  aktivitetStatuser: kodeverkPropType.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  isBeregningFormDirty: PropTypes.bool.isRequired,
  erKunYtelse: PropTypes.bool.isRequired,
  skalHaBesteberegning: PropTypes.bool.isRequired,
  arbeidsforholdList: PropTypes.arrayOf(arbeidsforholdProptype).isRequired,
  skalKunneLeggeTilAndel: PropTypes.bool,
};

InntektFieldArrayImpl.defaultProps = {
  skalKunneLeggeTilAndel: true,
};


const InntektFieldArray = injectIntl(InntektFieldArrayImpl);

InntektFieldArray.transformValues = values => (
  values.map(fieldValue => ({
    andelsnr: fieldValue.andelsnr,
    fastsattBeløp: removeSpacesFromNumber(fieldValue.fastsattBeløp),
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
    fieldErrors.fastsattBeløp = required(andelFieldValues.fastsattBeløp);
    fieldErrors.inntektskategori = required(andelFieldValues.inntektskategori);
    return fieldErrors.fastsattBeløp || fieldErrors.inntektskategori ? fieldErrors : null;
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
    skalKunneEndreAktivitet: andel.lagtTilAvSaksbehandler && andel.aktivitetStatus.kode !== aktivitetStatus.DAGPENGER,
    fastsattBeløp: andel.fastsattBelopPrMnd || andel.fastsattBelopPrMnd === 0
      ? formatCurrencyNoKr(andel.fastsattBelopPrMnd) : '',
  }));
};


const sorterKodeverkAlfabetisk = kodeverkListe => kodeverkListe.slice().sort((a, b) => a.navn.localeCompare(b.navn));


export const mapStateToProps = (state, ownProps) => {
  const tilfeller = getFaktaOmBeregningTilfellerKoder(state);
  const isBeregningFormDirty = isFormDirty(state);
  const aktivitetStatuser = getKodeverk(kodeverkTyper.AKTIVITET_STATUS)(state);
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp
    .filter(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN);
  const isAksjonspunktClosed = relevantAp.length === 0 ? undefined : !isAksjonspunktOpen(relevantAp[0].status.kode);
  const arbeidsforholdList = getUniqueListOfArbeidsforhold(ownProps.andeler);
  return {
    arbeidsforholdList,
    isBeregningFormDirty,
    isAksjonspunktClosed,
    aktivitetStatuser,
    inntektskategoriKoder: sorterKodeverkAlfabetisk(getKodeverk(kodeverkTyper.INNTEKTSKATEGORI)(state)),
    erKunYtelse: tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE),
  };
};


export default connect(mapStateToProps)(InntektFieldArray);
