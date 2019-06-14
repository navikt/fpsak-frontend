import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { injectKodeverk } from '@fpsak-frontend/fp-felles';
import aktivitetStatuser from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  isArrayEmpty, formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber,
} from '@fpsak-frontend/utils';
import {
  Table, Image, TableRow, TableColumn, ElementWrapper,
} from '@fpsak-frontend/shared-components';
import {
  InputField, DecimalField, PeriodpickerField, NavFieldGroup, SelectField,
} from '@fpsak-frontend/form';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { kodeverkPropType, arbeidsforholdBeregningProptype } from '@fpsak-frontend/prop-types';
import beregningsgrunnlagAndeltyper from '@fpsak-frontend/kodeverk/src/beregningsgrunnlagAndeltyper';
import inntektskategorier, { isSelvstendigNæringsdrivende } from '@fpsak-frontend/kodeverk/src/inntektskategorier';
import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';

import {
  getBeregningsgrunnlag,
  getBehandlingIsRevurdering,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { createVisningsnavnForAktivitet } from 'behandlingForstegangOgRevurdering/src/visningsnavnHelper';
import { getKodeverk, getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import 'core-js/fn/array/flat-map';

import { getUniqueListOfArbeidsforhold } from '../ArbeidsforholdHelper';
import {
  validateAndeler, validateUlikeAndeler,
  validateTotalRefusjonPrArbeidsforhold, validateSumFastsattBelop,
} from '../ValidateAndelerUtils';
import styles from './renderEndringBGFieldArray.less';

const ENTER_KEY_CODE = 13;

const defaultBGFordeling = periodeUtenAarsak => ({
  nyAndel: true,
  fordelingForrigeBehandling: 0,
  fastsattBelop: formatCurrencyNoKr(0),
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


const arbeidsgiverSelectValues = (arbeidsforholdList, getKodeverknavn) => (arbeidsforholdList
  .map(arbeidsforhold => (
    <option value={arbeidsforhold.andelsnr.toString()} key={arbeidsforhold.andelsnr}>
      {createVisningsnavnForAktivitet(arbeidsforhold, getKodeverknavn)}
    </option>
  )));

const arbeidsgiverSelectValuesForKunYtelse = (arbeidsforholdList, intl, getKodeverknavn) => {
  const nedtrekksvalgListe = arbeidsforholdList
    .map(arbeidsforhold => (
      <option value={arbeidsforhold.andelsnr.toString()} key={arbeidsforhold.andelsnr}>
        {createVisningsnavnForAktivitet(arbeidsforhold, getKodeverknavn)}
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
    if (fordelingForrigeBehandling !== undefined && fordelingForrigeBehandling !== null && fordelingForrigeBehandling !== '') {
      sum += Number(removeSpacesFromNumber(fordelingForrigeBehandling));
    }
  }
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const summerFordeling = (fields) => {
  let sum = 0;
  let index = 0;
  for (index; index < fields.length; index += 1) {
    const field = fields.get(index);
    if (field.harPeriodeAarsakGraderingEllerRefusjon) {
      sum += field.fastsattBelop ? Number(removeSpacesFromNumber(field.fastsattBelop)) : 0;
    } else {
      sum += field.readOnlyBelop ? Number(removeSpacesFromNumber(field.readOnlyBelop)) : 0;
    }
  }
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const summerBeregningsgrunnlagPrAar = (fields) => {
  let sum = 0;
  let index = 0;
  for (index; index < fields.length; index += 1) {
    const field = fields.get(index);
    if (field.beregningsgrunnlagPrAar) {
      sum += field.beregningsgrunnlagPrAar ? Number(removeSpacesFromNumber(field.beregningsgrunnlagPrAar)) : 0;
    }
  }
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const isSelvstendigOrFrilanser = fieldVal => (isSelvstendigNæringsdrivende(fieldVal.inntektskategori)
  || inntektskategorier.FRILANSER === fieldVal.inntektskategori);

const renderMessage = (intl, error) => (error[0] && error[0].id ? intl.formatMessage(...error) : error);

const getErrorMessage = (meta, intl) => (meta.error
&& meta.submitFailed ? renderMessage(intl, meta.error) : null);

const onKeyDown = (fields, periodeUtenAarsak) => ({ keyCode }) => {
  if (keyCode === ENTER_KEY_CODE) {
    fields.push(defaultBGFordeling(periodeUtenAarsak));
  }
};

const finnArbeidsforholdForAndel = (arbeidsforholdListe, val) => {
  const andelsnr = Number(val);
  return arbeidsforholdListe.find(arbeidsforhold => arbeidsforhold.andelsnr === andelsnr);
};

const finnAktivitetStatus = (fields, val) => {
  const andelsnr = Number(val);
  for (let index = 0; index < fields.length; index += 1) {
    if (fields.get(index).andelsnr === andelsnr) {
      return fields.get(index).aktivitetStatus;
    }
  }
  return null;
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
    field.aktivitetStatus = finnAktivitetStatus(fields, val);
    field.nyttArbeidsforhold = arbeidsforhold.nyttArbeidsforhold;
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

export const lagBelopKolonne = (andelElementFieldId, readOnly, periodeUtenAarsak, isAksjonspunktClosed) => {
  if (!readOnly && periodeUtenAarsak) {
    return (
      <TableColumn>
        <InputField
          name={`${andelElementFieldId}.readOnlyBelop`}
          bredde="S"
          parse={parseCurrencyInput}
          readOnly
          isEdited={false}
        />
      </TableColumn>
    );
  }
  return (
    <TableColumn className={styles.rightAlignInput}>
      <InputField
        name={`${andelElementFieldId}.fastsattBelop`}
        bredde="XS"
        parse={parseCurrencyInput}
        readOnly={readOnly}
        isEdited={isAksjonspunktClosed && !periodeUtenAarsak}
      />
    </TableColumn>
  );
};

const skalViseSletteknapp = (index, fields, readOnly) => ((fields.get(index).nyAndel
|| fields.get(index).lagtTilAvSaksbehandler) && !readOnly);

const createAndelerTableRows = (fields, isAksjonspunktClosed, readOnly,
  inntektskategoriKoder, periodeUtenAarsak, arbeidsforholdList, selectVals, erRevurdering) => (
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
      {erRevurdering
      && (
      <TableColumn>
        <InputField
          name={`${andelElementFieldId}.fordelingForrigeBehandling`}
          bredde="S"
          readOnly
          parse={parseCurrencyInput}
        />
      </TableColumn>
)
        }
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
      <TableColumn>
        <InputField
          name={`${andelElementFieldId}.beregningsgrunnlagPrAar`}
          bredde="S"
          readOnly
          parse={parseCurrencyInput}
        />
      </TableColumn>
      {lagBelopKolonne(andelElementFieldId, readOnly, periodeUtenAarsak, isAksjonspunktClosed)}
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
const createBruttoBGSummaryRow = (sumFordelingForrigeBehandling, sumFordeling, sumBeregningsgrunnlagPrAar, erRevurdering) => (
  <TableRow key="bruttoBGSummaryRow">
    <TableColumn>
      <FormattedMessage id="BeregningInfoPanel.EndringBG.Sum" />
    </TableColumn>
    <TableColumn />
    {erRevurdering
    && (
    <TableColumn>
      <Element>
        {sumFordelingForrigeBehandling}
      </Element>
    </TableColumn>
)
    }
    <TableColumn />
    <TableColumn />
    <TableColumn>
      <Element>
        {sumBeregningsgrunnlagPrAar}
      </Element>
    </TableColumn>
    <TableColumn>
      <Element>
        {sumFordeling}
      </Element>
    </TableColumn>
    <TableColumn />
    <TableColumn />
  </TableRow>
);

const getHeaderTextCodes = (erRevurdering) => {
  const headerCodes = [];
  headerCodes.push('BeregningInfoPanel.EndringBG.Andel');
  headerCodes.push('BeregningInfoPanel.EndringBG.Arbeidsperiode');
  if (erRevurdering) {
    headerCodes.push('BeregningInfoPanel.EndringBG.FordelingForrigeBehandling');
  }
  headerCodes.push('BeregningInfoPanel.EndringBG.AndelIArbeid');
  headerCodes.push('BeregningInfoPanel.EndringBG.Refusjonskrav');
  headerCodes.push('BeregningInfoPanel.EndringBG.Beregningsgrunnlag');
  headerCodes.push('BeregningInfoPanel.EndringBG.Fordeling');
  headerCodes.push('BeregningInfoPanel.EndringBG.Inntektskategori');
  return headerCodes;
};

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
  erRevurdering,
  getKodeverknavn,
}) => {
  const sumFordelingForrigeBehandling = summerFordelingForrigeBehandlingFraFields(fields);
  const sumFordeling = summerFordeling(fields);
  const sumBeregningsgrunnlagPrAar = summerBeregningsgrunnlagPrAar(fields);
  const selectVals = harKunYtelse
    ? arbeidsgiverSelectValuesForKunYtelse(arbeidsforholdList, intl, getKodeverknavn)
    : arbeidsgiverSelectValues(arbeidsforholdList, getKodeverknavn);
  const tablerows = createAndelerTableRows(fields, isAksjonspunktClosed, readOnly, inntektskategoriKoder, periodeUtenAarsak,
    arbeidsforholdList, selectVals, erRevurdering);
  tablerows.push(createBruttoBGSummaryRow(sumFordelingForrigeBehandling, sumFordeling, sumBeregningsgrunnlagPrAar, erRevurdering));
  const error = getErrorMessage(meta, intl);
  return (
    <NavFieldGroup errorMessage={error} className={styles.dividerTop}>
      <Table headerTextCodes={getHeaderTextCodes(erRevurdering)} noHover classNameTable={styles.inntektTable}>
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
  arbeidsforholdList: PropTypes.arrayOf(arbeidsforholdBeregningProptype).isRequired,
  inntektskategoriKoder: kodeverkPropType.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  periodeUtenAarsak: PropTypes.bool.isRequired,
  harKunYtelse: PropTypes.bool.isRequired,
  erRevurdering: PropTypes.bool.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

const RenderEndringBGFieldArray = injectIntl(injectKodeverk(getAlleKodeverk)(RenderEndringBGFieldArrayImpl));

RenderEndringBGFieldArray.validate = (values, sumIPeriode, skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn) => {
  const fieldErrors = validateAndeler(values, skalValidereMotBeregningsgrunnlagPrAar, getKodeverknavn);
  if (fieldErrors != null) {
    return fieldErrors;
  }
  if (isArrayEmpty(values)) {
    return null;
  }
  const ulikeAndelerError = validateUlikeAndeler(values);
  if (ulikeAndelerError) {
    return { _error: <FormattedMessage id={ulikeAndelerError[0].id} /> };
  }
  const refusjonPrArbeidsforholdError = validateTotalRefusjonPrArbeidsforhold(values, getKodeverknavn);
  if (refusjonPrArbeidsforholdError) {
    return { _error: <FormattedMessage id={refusjonPrArbeidsforholdError[0].id} values={refusjonPrArbeidsforholdError[1]} /> };
  }
  if (sumIPeriode !== undefined && sumIPeriode !== null && values.some(andel => andel.harPeriodeAarsakGraderingEllerRefusjon === true)) {
    const fastsattBelopError = validateSumFastsattBelop(values, sumIPeriode);
    if (fastsattBelopError) {
      return { _error: <FormattedMessage id={fastsattBelopError[0].id} values={fastsattBelopError[1]} /> };
    }
  }
  return null;
};

const mapStateToPropsFactory = (initialState) => {
  const erRevurdering = getBehandlingIsRevurdering(initialState);
  const inntektskategoriKoder = getKodeverk(kodeverkTyper.INNTEKTSKATEGORI)(initialState);
  return state => ({
    erRevurdering,
    inntektskategoriKoder,
    arbeidsforholdList: getUniqueListOfArbeidsforhold(state),
    harKunYtelse: getBeregningsgrunnlag(state).aktivitetStatus
    .some(status => status.kode === aktivitetStatuser.KUN_YTELSE),
  });
};

export default connect(mapStateToPropsFactory)(RenderEndringBGFieldArray);
