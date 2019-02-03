import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import {
  isArrayEmpty, formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber, createVisningsnavnForAktivitet,
} from '@fpsak-frontend/utils';
import {
  Table, Image, TableRow, TableColumn, ElementWrapper,
} from '@fpsak-frontend/shared-components';
import {
  InputField, DecimalField, PeriodpickerField, NavFieldGroup, SelectField,
} from '@fpsak-frontend/form';
import {
  getEndringBeregningsgrunnlagPerioder,
  getFaktaOmBeregningTilfellerKoder,
} from 'behandlingFpsak/src/behandlingSelectors';
import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import { getKodeverk } from 'behandlingFpsak/src/duck';
import kodeverkPropType from '@fpsak-frontend/kodeverk/src/kodeverkPropType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import beregningsgrunnlagAndeltyper from '@fpsak-frontend/kodeverk/src/beregningsgrunnlagAndeltyper';
import inntektskategorier, { isSelvstendigNæringsdrivende } from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import { arbeidsforholdProptype, getUniqueListOfArbeidsforhold } from '../../ArbeidsforholdHelper';
import {
  validateAndelFields, validateSumFastsattBelop, validateUlikeAndeler,
  validateTotalRefusjonPrArbeidsforhold,
} from '../ValidateAndelerUtils';
import { setSkalRedigereInntektForATFL } from '../BgFordelingUtils';

import styles from './renderEndringBGFieldArray.less';

const defaultBGFordeling = periodeUtenAarsak => ({
  nyAndel: true,
  fordelingForrigeBehandling: 0,
  fastsattBeløp: formatCurrencyNoKr(0),
  lagtTilAvSaksbehandler: true,
  refusjonskravFraInntektsmelding: 0,
  belopFraInntektsmelding: null,
  kanRedigereInntekt: true,
  harPeriodeAarsakGraderingEllerRefusjon: !periodeUtenAarsak,
});

const fieldLabel = (index, labelId) => {
  if (index === 0) {
    return { id: labelId };
  }
  return '';
};


const arbeidsgiverSelectValues = arbeidsforholdList => (arbeidsforholdList
  .map(arbeidsforhold => (
    <option value={arbeidsforhold.andelsnr.toString()} key={arbeidsforhold.andelsnr}>
      {createVisningsnavnForAktivitet(arbeidsforhold)}
    </option>
  )));

const arbeidsgiverSelectValuesForKunYtelse = (arbeidsforholdList, intl) => {
  const nedtrekksvalgListe = arbeidsforholdList
    .map(arbeidsforhold => (
      <option value={arbeidsforhold.andelsnr.toString()} key={arbeidsforhold.andelsnr}>
        {createVisningsnavnForAktivitet(arbeidsforhold)}
      </option>
    ));
  nedtrekksvalgListe.push(
    <option value={beregningsgrunnlagAndeltyper.BRUKERS_ANDEL} key={beregningsgrunnlagAndeltyper.BRUKERS_ANDEL}>
      {intl.formatMessage({ id: 'BeregningInfoPanel.FordelingBG.Ytelse' })}
    </option>,
  );
  return nedtrekksvalgListe;
};

const inntektskategoriSelectValues = kategorier => kategorier.map(ik => (
  <option value={ik.kode} key={ik.kode}>
    {ik.navn}
  </option>
));

const summerFordelingForrigeBehandlingFraFields = (fields) => {
  let sum = 0;
  let index = 0;
  for (index; index < fields.length; index += 1) {
    const { fordelingForrigeBehandling } = fields.get(index);
    if (fordelingForrigeBehandling === undefined || fordelingForrigeBehandling === null || fordelingForrigeBehandling === '') {
      return '';
    }
    sum += Number(removeSpacesFromNumber(fordelingForrigeBehandling));
  }
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const summerFordeling = (fields) => {
  let sum = 0;
  let index = 0;
  for (index; index < fields.length; index += 1) {
    const field = fields.get(index);
    if (field.skalRedigereInntekt) {
      sum += field.fastsattBeløp ? Number(removeSpacesFromNumber(field.fastsattBeløp)) : 0;
    } else {
      sum += field.readOnlyBelop ? Number(removeSpacesFromNumber(field.readOnlyBelop)) : 0;
    }
  }
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const isSelvstendigOrFrilanser = fieldVal => (isSelvstendigNæringsdrivende(fieldVal.inntektskategori)
  || inntektskategorier.FRILANSER === fieldVal.inntektskategori);

const getErrorMessage = (meta, intl) => (meta.error && (meta.submitFailed) ? intl.formatMessage(...meta.error) : null);

const onKeyDown = (fields, periode) => ({ keyCode }) => {
  if (keyCode === 13) {
    fields.push(defaultBGFordeling(periode));
  }
};

const finnArbeidsforholdForAndel = (arbeidsforholdListe, val) => {
  const andelsnr = Number(val);
  return arbeidsforholdListe.find(arbeidsforhold => arbeidsforhold.andelsnr === andelsnr);
};

const setArbeidsforholdInfo = (fields, index, arbeidsforholdList, val) => {
  const field = fields.get(index);
  const arbeidsforhold = finnArbeidsforholdForAndel(arbeidsforholdList, val);
  if (arbeidsforhold) {
    field.arbeidsforholdId = arbeidsforhold.arbeidsforholdId;
    field.arbeidsgiverNavn = arbeidsforhold.arbeidsgiverNavn;
    field.arbeidsgiverId = arbeidsforhold.arbeidsgiverId;
    field.arbeidsperiodeFom = arbeidsforhold.startdato;
    field.arbeidsperiodeTom = arbeidsforhold.opphoersdato;
    field.andelsnrRef = arbeidsforhold.andelsnr;
  }
};

const arbeidsforholdReadOnlyOrSelect = (fields, index, elementFieldId, selectVals, isReadOnly, arbeidsforholdList) => (
  <ElementWrapper>
    {(!fields.get(index).nyAndel)
      && (
      <InputField
        name={`${elementFieldId}.andel`}
        bredde="L"
        readOnly
      />
      )
      }
    {fields.get(index).nyAndel
      && (
      <SelectField
        name={`${elementFieldId}.andel`}
        bredde="l"
        label={fieldLabel(index, 'BeregningInfoPanel.EndringBG.Andel')}
        selectValues={selectVals}
        readOnly={isReadOnly}
        onChange={event => setArbeidsforholdInfo(fields, index, arbeidsforholdList, event.target.value)}
      />
      )
      }
  </ElementWrapper>
);

export const lagBelopKolonne = (andelElementFieldId, readOnly, skalRedigereInntekt, isAksjonspunktClosed) => {
  if (readOnly || !skalRedigereInntekt) {
    return (
      <TableColumn>
        <InputField
          name={`${andelElementFieldId}.readOnlyBelop`}
          bredde="S"
          parse={parseCurrencyInput}
          readOnly
          isEdited={isAksjonspunktClosed && skalRedigereInntekt}
        />
      </TableColumn>
    );
  }
  return (
    <TableColumn className={styles.rightAlignInput}>
      <InputField
        name={`${andelElementFieldId}.fastsattBeløp`}
        bredde="XS"
        parse={parseCurrencyInput}
        readOnly={false}
        isEdited={isAksjonspunktClosed && skalRedigereInntekt}
      />
    </TableColumn>
  );
};

const skalViseSletteknapp = (index, fields, readOnly) => ((fields.get(index).nyAndel
|| fields.get(index).lagtTilAvSaksbehandler) && !readOnly);

const createAndelerTableRows = (fields, isAksjonspunktClosed, readOnly,
  inntektskategoriKoder, periodeUtenAarsak, arbeidsforholdList, selectVals) => (
  fields.map((andelElementFieldId, index) => (
    <TableRow key={andelElementFieldId}>
      <TableColumn>
        {arbeidsforholdReadOnlyOrSelect(fields, index, andelElementFieldId, selectVals, (readOnly || periodeUtenAarsak), arbeidsforholdList)}
      </TableColumn>
      <TableColumn>
        {!isSelvstendigOrFrilanser(fields.get(index))
        && (
          <PeriodpickerField
            names={[`${andelElementFieldId}.arbeidsperiodeFom`, `${andelElementFieldId}.arbeidsperiodeTom`]}
            readOnly
            defaultValue={null}
            renderIfMissingDateOnReadOnly
          />
        )
        }
      </TableColumn>
      <TableColumn>
        <InputField
          name={`${andelElementFieldId}.fordelingForrigeBehandling`}
          bredde="S"
          readOnly
          parse={parseCurrencyInput}
        />
      </TableColumn>
      <TableColumn>
        <DecimalField
          name={`${andelElementFieldId}.andelIArbeid`}
          readOnly
          bredde="S"
          format={(value) => {
            if (value || value === 0) {
              return `${value} %`;
            }
            return '';
          }}
          normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
        />
      </TableColumn>
      <TableColumn className={(readOnly || periodeUtenAarsak) || !fields.get(index).skalKunneEndreRefusjon ? undefined : styles.rightAlignInput}>
        <InputField
          name={`${andelElementFieldId}.refusjonskrav`}
          bredde="XS"
          readOnly={(readOnly || periodeUtenAarsak) || !fields.get(index).skalKunneEndreRefusjon}
          parse={parseCurrencyInput}
        />
      </TableColumn>
      {lagBelopKolonne(andelElementFieldId, readOnly, fields.get(index).skalRedigereInntekt, isAksjonspunktClosed)}
      <TableColumn className={(readOnly || periodeUtenAarsak) ? styles.shortLeftAligned : undefined}>
        <SelectField
          label=""
          name={`${andelElementFieldId}.inntektskategori`}
          bredde="s"
          selectValues={inntektskategoriSelectValues(inntektskategoriKoder)}
          value={fields.get(index).inntektskategori}
          readOnly={(readOnly || periodeUtenAarsak)}
          isEdited={isAksjonspunktClosed && !periodeUtenAarsak}
        />
      </TableColumn>
      <TableColumn>
        {skalViseSletteknapp(index, fields, (readOnly || periodeUtenAarsak))
        && (
          <button
            className={styles.buttonRemove}
            type="button"
            onClick={() => {
              fields.remove(index);
            }}
          />
        )
        }
      </TableColumn>
    </TableRow>
  ))
);
const createBruttoBGSummaryRow = (sumFordelingForrigeBehandling, sumFordeling) => (
  <TableRow key="bruttoBGSummaryRow">
    <TableColumn>
      <FormattedMessage id="BeregningInfoPanel.EndringBG.Sum" />
    </TableColumn>
    <TableColumn />
    <TableColumn>
      <Element>
        {sumFordelingForrigeBehandling}
      </Element>
    </TableColumn>
    <TableColumn />
    <TableColumn />
    <TableColumn>
      <Element>
        {sumFordeling}
      </Element>
    </TableColumn>
    <TableColumn />
    <TableColumn />
  </TableRow>
);

const getHeaderTextCodes = () => ([
  'BeregningInfoPanel.EndringBG.Andel',
  'BeregningInfoPanel.EndringBG.Arbeidsperiode',
  'BeregningInfoPanel.EndringBG.FordelingForrigeBehandling',
  'BeregningInfoPanel.EndringBG.AndelIArbeid',
  'BeregningInfoPanel.EndringBG.Refusjonskrav',
  'BeregningInfoPanel.EndringBG.Fordeling',
  'BeregningInfoPanel.EndringBG.Inntektskategori']
);

/**
 *  RenderEndringBGFieldArray
 *
 * Presentasjonskomponent: Viser fordeling av brutto beregningsgrunnlag ved endret beregningsgrunnlag
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const RenderEndringBGFieldArrayImpl = ({
  fields,
  meta,
  intl,
  arbeidsforholdList,
  inntektskategoriKoder,
  readOnly,
  periodeUtenAarsak,
  isAksjonspunktClosed,
  harKunYtelse,
}) => {
  const sumFordelingForrigeBehandling = summerFordelingForrigeBehandlingFraFields(fields);
  const sumFordeling = summerFordeling(fields);
  const selectVals = harKunYtelse
    ? arbeidsgiverSelectValuesForKunYtelse(arbeidsforholdList, intl)
    : arbeidsgiverSelectValues(arbeidsforholdList);
  const tablerows = createAndelerTableRows(fields, isAksjonspunktClosed, readOnly, inntektskategoriKoder, periodeUtenAarsak, arbeidsforholdList, selectVals);
  tablerows.push(createBruttoBGSummaryRow(sumFordelingForrigeBehandling, sumFordeling));
  return (
    <NavFieldGroup errorMessage={getErrorMessage(meta, intl)} className={styles.dividerTop}>
      <Table headerTextCodes={getHeaderTextCodes()} noHover classNameTable={styles.inntektTable}>
        {tablerows}
      </Table>
      {!readOnly && !periodeUtenAarsak
      && (
      <Row className={styles.buttonRow}>
        <Column xs="3">
          {// eslint-disable-next-line jsx-a11y/click-events-have-key-events
          }
          <div
            id="leggTilAndelDiv"
            onClick={() => {
              fields.push(defaultBGFordeling(periodeUtenAarsak));
            }}
            onKeyDown={onKeyDown(fields, periodeUtenAarsak)}
            className={styles.addPeriode}
            role="button"
            tabIndex="0"
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
    </NavFieldGroup>
  );
};

RenderEndringBGFieldArrayImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
  arbeidsforholdList: PropTypes.arrayOf(arbeidsforholdProptype).isRequired,
  inntektskategoriKoder: kodeverkPropType.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  periodeUtenAarsak: PropTypes.bool.isRequired,
  harKunYtelse: PropTypes.bool.isRequired,
};

const RenderEndringBGFieldArray = injectIntl(RenderEndringBGFieldArrayImpl);

const summerFordelingForrigeBehandlingFraValues = values => (values
  .map(({ fordelingForrigeBehandling }) => (fordelingForrigeBehandling ? removeSpacesFromNumber(fordelingForrigeBehandling) : 0))
  .reduce((sum, fordeling) => sum + fordeling, 0));

const harAndelUtenInntektsmeldingIForstegangsbehandling = values => values
  .some(({ fordelingForrigeBehandling }) => (fordelingForrigeBehandling === '' || fordelingForrigeBehandling === null
  || fordelingForrigeBehandling === undefined));

RenderEndringBGFieldArray.validate = (values, fastsattIForstePeriode, skalRedigereInntekt) => {
  const arrayErrors = values.map((andelFieldValues) => {
    if (!skalRedigereInntekt(andelFieldValues)) {
      return null;
    }
    return validateAndelFields(andelFieldValues);
  });
  if (arrayErrors.some(errors => errors !== null)) {
    return arrayErrors;
  }
  if (isArrayEmpty(values)) {
    return null;
  }
  const ulikeAndelerError = validateUlikeAndeler(values);
  if (ulikeAndelerError) {
    return { _error: ulikeAndelerError };
  }
  const refusjonPrArbeidsforholdError = validateTotalRefusjonPrArbeidsforhold(values);
  if (refusjonPrArbeidsforholdError) {
    return { _error: refusjonPrArbeidsforholdError };
  }
  const kanRedigereInntekt = values.some(andel => skalRedigereInntekt(andel));
  if (!kanRedigereInntekt) {
    return null;
  }
  if (harAndelUtenInntektsmeldingIForstegangsbehandling(values)) {
    if (fastsattIForstePeriode !== undefined && fastsattIForstePeriode !== null) {
      const fastsattBelopError = validateSumFastsattBelop(values, fastsattIForstePeriode, skalRedigereInntekt);
      if (fastsattBelopError) {
        return { _error: fastsattBelopError };
      }
    }
    return null;
  }
  const sumFordelingForrigeBehandling = summerFordelingForrigeBehandlingFraValues(values);
  const fastsattBelopError = validateSumFastsattBelop(values, sumFordelingForrigeBehandling, skalRedigereInntekt);
  if (fastsattBelopError) {
    return { _error: fastsattBelopError };
  }
  return null;
};

const mapStateToProps = (state, ownProps) => {
  const tilfeller = getFaktaOmBeregningTilfellerKoder(state);
  const arbeidsforholdList = getUniqueListOfArbeidsforhold(getEndringBeregningsgrunnlagPerioder(state)
    ? getEndringBeregningsgrunnlagPerioder(state).flatMap(p => p.endringBeregningsgrunnlagAndeler) : undefined);
  setSkalRedigereInntektForATFL(state, ownProps.fields, ownProps.formName);
  return {
    arbeidsforholdList,
    inntektskategoriKoder: getKodeverk(kodeverkTyper.INNTEKTSKATEGORI)(state),
    harKunYtelse: tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BG_KUN_YTELSE),
  };
};

export default connect(mapStateToProps)(RenderEndringBGFieldArray);
