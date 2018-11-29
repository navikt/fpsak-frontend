import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import {
  DecimalField, InputField, NavFieldGroup, PeriodpickerField, SelectField,
} from 'form/Fields';
import { isEmpty } from 'utils/arrayUtils';
import { getEndringBeregningsgrunnlagPerioder } from 'behandling/behandlingSelectors';
import Image from 'sharedComponents/Image';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import inntektskategorier, { isSelvstendigNæringsdrivende } from 'kodeverk/inntektskategorier';
import { formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber } from 'utils/currencyUtils';
import createVisningsnavnForAktivitet from 'utils/arbeidsforholdUtil';
import { arbeidsforholdProptype, getUniqueListOfArbeidsforhold } from '../../ArbeidsforholdHelper';
import { validateAndelFields, validateSumFastsattBelop, validateUlikeAndeler } from '../ValidateAndelerUtils';
import styles from './renderEndringBGFieldArray.less';


const defaultBGFordeling = periodeUtenAarsak => ({
  nyAndel: true,
  fordelingForrigeBehandling: 0,
  fastsattBeløp: formatCurrencyNoKr(0),
  lagtTilAvSaksbehandler: true,
  refusjonskravFraInntektsmelding: 0,
  belopFraInntektsmelding: null,
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


const inntektskategoriSelectValues = kategorier => kategorier.map(ik => (
  <option value={ik.kode} key={ik.kode}>
    {ik.navn}
  </option>
));

const hentArbeidsperiode = (field, arbeidsforholdList) => {
  if (field.nyAndel === false) {
    return null;
  }
  let arbeidsperiode = null;
  arbeidsforholdList.forEach((af) => {
    if (af.andelsnr.toString() === field.andel) {
      arbeidsperiode = {
        arbeidsperiodeFom: af.startdato,
        arbeidsperiodeTom: af.opphoersdato,
      };
    }
  });
  return arbeidsperiode;
};

const summerFordelingForrigeBehandlingFraFields = (fields) => {
  let sum = 0;
  fields.forEach((andelElementFieldId, index) => {
    sum += fields.get(index).fordelingForrigeBehandling ? Number(removeSpacesFromNumber(fields.get(index).fordelingForrigeBehandling)) : 0;
  });
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const summerFordeling = (fields) => {
  let sum = 0;
  fields.forEach((andelElementFieldId, index) => {
    sum += fields.get(index).fastsattBeløp ? Number(removeSpacesFromNumber(fields.get(index).fastsattBeløp)) : 0;
  });
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

const arbeidsforholdReadOnlyOrSelect = (fields, index, elementFieldId, selectVals, isReadOnly) => (
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
      />
      )
      }
  </ElementWrapper>
);

function skalViseSletteknapp(index, fields, readOnly) {
  return (fields.get(index).nyAndel || fields.get(index).lagtTilAvSaksbehandler) && !readOnly;
}

const createAndelerTableRows = (fields, selectVals, isAksjonspunktClosed, readOnly,
  inntektskategoriKoder, periodeUtenAarsak) => fields.map((andelElementFieldId, index) => (
    <TableRow key={andelElementFieldId}>
      <TableColumn>
        {arbeidsforholdReadOnlyOrSelect(fields, index, andelElementFieldId, selectVals, readOnly)}
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
      <TableColumn className={readOnly || !fields.get(index).skalKunneEndreRefusjon ? undefined : styles.rightAlignInput}>
        <InputField
          name={`${andelElementFieldId}.refusjonskrav`}
          bredde="XS"
          readOnly={readOnly || !fields.get(index).skalKunneEndreRefusjon}
          parse={parseCurrencyInput}
        />
      </TableColumn>
      <TableColumn className={readOnly ? undefined : styles.rightAlignInput}>
        <InputField
          name={`${andelElementFieldId}.fastsattBeløp`}
          bredde="XS"
          parse={parseCurrencyInput}
          readOnly={readOnly}
          isEdited={isAksjonspunktClosed && !periodeUtenAarsak}
        />
      </TableColumn>
      <TableColumn>
        <SelectField
          label=""
          name={`${andelElementFieldId}.inntektskategori`}
          bredde="s"
          selectValues={inntektskategoriSelectValues(inntektskategoriKoder)}
          value={fields.get(index).inntektskategori}
          readOnly={readOnly}
          isEdited={isAksjonspunktClosed && !periodeUtenAarsak}
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
        />
      )
      }
      </TableColumn>
    </TableRow>
));
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
}) => {
  const sumFordelingForrigeBehandling = summerFordelingForrigeBehandlingFraFields(fields);
  const sumFordeling = summerFordeling(fields);
  fields.forEach((andelElementFieldId, index) => {
    const field = fields.get(index);
    const arbeidsperiode = hentArbeidsperiode(field, arbeidsforholdList);
    if (arbeidsperiode !== null) {
      field.arbeidsperiodeFom = arbeidsperiode.arbeidsperiodeFom;
      field.arbeidsperiodeTom = arbeidsperiode.arbeidsperiodeTom;
    }
  });
  const selectVals = arbeidsgiverSelectValues(arbeidsforholdList);
  const tablerows = createAndelerTableRows(fields, selectVals, isAksjonspunktClosed, readOnly, inntektskategoriKoder, periodeUtenAarsak);
  tablerows.push(createBruttoBGSummaryRow(sumFordelingForrigeBehandling, sumFordeling));
  return (
    <NavFieldGroup errorMessage={getErrorMessage(meta, intl)}>
      <Table headerTextCodes={getHeaderTextCodes()} noHover classNameTable={styles.inntektTable}>
        {tablerows}
      </Table>
      {!readOnly
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
};

const RenderEndringBGFieldArray = injectIntl(RenderEndringBGFieldArrayImpl);

const summerFordelingForrigeBehandlingFraValues = values => (values
  .map(({ fordelingForrigeBehandling }) => (fordelingForrigeBehandling ? removeSpacesFromNumber(fordelingForrigeBehandling) : 0))
  .reduce((sum, fordeling) => sum + fordeling, 0));

RenderEndringBGFieldArray.validate = (values) => {
  const arrayErrors = values.map((andelFieldValues) => {
    if (!andelFieldValues.harPeriodeAarsakGraderingEllerRefusjon) {
      return null;
    }
    return validateAndelFields(andelFieldValues);
  });
  if (arrayErrors.some(errors => errors !== null)) {
    return arrayErrors;
  }
  if (isEmpty(values)) {
    return null;
  }
  const ulikeAndelerError = validateUlikeAndeler(values);
  if (ulikeAndelerError) {
    return { _error: ulikeAndelerError };
  }
  const sumFordelingForrigeBehandling = summerFordelingForrigeBehandlingFraValues(values);
  const fastsattBelopError = validateSumFastsattBelop(values, sumFordelingForrigeBehandling);
  if (fastsattBelopError) {
    return { _error: fastsattBelopError };
  }
  return null;
};

const mapStateToProps = (state) => {
  const arbeidsforholdList = getUniqueListOfArbeidsforhold(getEndringBeregningsgrunnlagPerioder(state)
    ? getEndringBeregningsgrunnlagPerioder(state).flatMap(p => p.endringBeregningsgrunnlagAndeler) : undefined);
  return {
    arbeidsforholdList,
    inntektskategoriKoder: getKodeverk(kodeverkTyper.INNTEKTSKATEGORI)(state),
  };
};

export default connect(mapStateToProps)(RenderEndringBGFieldArray);
