import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import {
  DecimalField, InputField, NavFieldGroup, PeriodpickerField, SelectField,
} from 'form/Fields';
import { getAksjonspunkter, getFaktaOmBeregning } from 'behandling/behandlingSelectors';
import { isBehandlingFormDirty } from 'behandling/behandlingForm';
import { isEmpty } from 'utils/arrayUtils';
import Image from 'sharedComponents/Image';
import addCircleIcon from 'images/add-circle.svg';
import { getKodeverk } from 'kodeverk/duck';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import kodeverkPropType from 'kodeverk/kodeverkPropType';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import inntektskategorier, { isSelvstendigNæringsdrivende } from 'kodeverk/inntektskategorier';
import { formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber } from 'utils/currencyUtils';
import createVisningsnavnForAktivitet from 'utils/arbeidsforholdUtil';

import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import styles from './renderBruttoBGFordelingFieldArray.less';
import { arbeidsforholdProptype, getUniqueListOfArbeidsforhold } from '../../ArbeidsforholdHelper';
import { validateAndelFields, validateUlikeAndeler } from '../ValidateAndelerUtils';

const defaultBGFordeling = {
  andel: '',
  arbeidsperiodeFom: '',
  arbeidsperiodeTom: '',
  fordelingForrigeYtelse: '',
  refusjonskrav: '',
  fastsattBeløp: '',
  inntektskategori: '',
  nyAndel: true,
  lagtTilAvSaksbehandler: true,
};

const fieldLabel = (index, labelId) => {
  if (index === 0) {
    return { id: labelId };
  }
  return '';
};


const arbeidsgiverSelectValues = (arbeidsforholdList, andeltyper) => {
  const optionlist = arbeidsforholdList
    .map(arbeidsforhold => (
      <option value={arbeidsforhold.andelsnr.toString()} key={arbeidsforhold.andelsnr}>
        {createVisningsnavnForAktivitet(arbeidsforhold)}
      </option>
    ));
  andeltyper.forEach((andelstype) => {
    optionlist.push(
      <option value={andelstype.kode} key={andelstype.kode}>
        {andelstype.navn}
      </option>,
    );
  });
  return optionlist;
};


const inntektskategoriSelectValues = kategorier => kategorier.map(ik => (
  <option value={ik.kode} key={ik.kode}>
    {ik.navn}
  </option>
));

const hentArbeidsperiode = (field, arbeidsforholdList, andeltyper) => {
  if (field.nyAndel === false) {
    return null;
  }
  if (andeltyper.map(({ kode }) => (kode)).includes(field.andel)) {
    return {
      arbeidsperiodeFom: '',
      arbeidsperiodeTom: '',
    };
  }
  let arbeidsperiode = null;
  arbeidsforholdList.forEach((af) => {
    if (af.andelsnr === field.andel) {
      arbeidsperiode = {
        arbeidsperiodeFom: af.startdato,
        arbeidsperiodeTom: af.opphoersdato,
      };
    }
  });
  return arbeidsperiode;
};

const summerFordelingForrigeYtelse = (fields) => {
  let sum = 0;
  fields.forEach((andelElementFieldId, index) => {
    sum += fields.get(index).fordelingForrigeYtelse ? parseInt(removeSpacesFromNumber(fields.get(index).fordelingForrigeYtelse), 10) : 0;
  });
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const summerFordeling = (fields) => {
  let sum = 0;
  fields.forEach((andelElementFieldId, index) => {
    sum += fields.get(index).fastsattBeløp ? parseInt(removeSpacesFromNumber(fields.get(index).fastsattBeløp), 10) : 0;
  });
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const getRedusertFordeling = (dekningsgrad, sumFordeling) => {
  const redusert = (parseInt(removeSpacesFromNumber(sumFordeling), 10) * parseInt(dekningsgrad, 10)) / 100;
  return redusert > 0 ? formatCurrencyNoKr(redusert) : '';
};

const isSelvstendigOrFrilanser = fieldVal => (isSelvstendigNæringsdrivende(fieldVal.inntektskategori)
  || inntektskategorier.FRILANSER === fieldVal.inntektskategori);

const isDirty = (meta, isBeregningFormDirty) => (meta.dirty || isBeregningFormDirty);

const getErrorMessage = (meta, intl, isBeregningFormDirty) => (meta.error && isDirty(meta, isBeregningFormDirty)
&& meta.submitFailed ? intl.formatMessage(...meta.error) : null);

function skalViseSletteknapp(index, fields, readOnly) {
  return (fields.get(index).nyAndel || fields.get(index).lagtTilAvSaksbehandler) && !readOnly;
}
const createAndelerTableRows = (fields, selectVals, isAksjonspunktClosed, readOnly,
  inntektskategoriKoder) => fields.map((andelElementFieldId, index) => (
    <TableRow key={andelElementFieldId}>
      <TableColumn>
        {!fields.get(index).nyAndel
      && (
        <InputField
          name={`${andelElementFieldId}.andel`}
          bredde="L"
          readOnly
        />
      )
      }
        {fields.get(index).nyAndel
      && (
        <SelectField
          name={`${andelElementFieldId}.andel`}
          bredde="l"
          label={fieldLabel(index, 'BeregningInfoPanel.FordelingBG.Andel')}
          selectValues={selectVals}
          isEdited={isAksjonspunktClosed}
        />
      )
      }
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
          name={`${andelElementFieldId}.fordelingForrigeYtelse`}
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
          normalizeOnBlur={value => (Number.isNaN(Number(value)) ? value : parseFloat(value).toFixed(2))}
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
      <TableColumn className={styles.rightAlignInput}>
        <InputField
          name={`${andelElementFieldId}.fastsattBeløp`}
          bredde="XS"
          parse={parseCurrencyInput}
          readOnly={readOnly}
          isEdited={isAksjonspunktClosed}
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
        />
      )
      }
      </TableColumn>
    </TableRow>
));
const createBruttoBGSummaryRow = (sumFordelingForrigeYtelse, sumFordeling) => (
  <TableRow key="bruttoBGSummaryRow">
    <TableColumn>
      <FormattedMessage id="BeregningInfoPanel.FordelingBG.BruttoBeregningsgrunnlagSum" />
    </TableColumn>
    <TableColumn />
    <TableColumn>
      <Undertekst>
        {sumFordelingForrigeYtelse}
      </Undertekst>
    </TableColumn>
    <TableColumn />
    <TableColumn />
    <TableColumn>
      <Undertekst>
        {sumFordeling}
      </Undertekst>
    </TableColumn>
    <TableColumn />
    <TableColumn />
  </TableRow>
);

const createRedusertBGSummaryRow = sumRedusertFordeling => (
  <TableRow key="redusertBruttoBGSummaryRow">
    <TableColumn>
      <FormattedMessage id="BeregningInfoPanel.FordelingBG.RedusertBeregningsgrunnlagSum" />
    </TableColumn>
    <TableColumn />
    <TableColumn />
    <TableColumn />
    <TableColumn />
    <TableColumn>
      <Element>
        {sumRedusertFordeling}
      </Element>
    </TableColumn>
    <TableColumn />
    <TableColumn />
  </TableRow>
);

const getHeaderTextCodes = () => ([
  'BeregningInfoPanel.FordelingBG.Andel',
  'BeregningInfoPanel.FordelingBG.Arbeidsperiode',
  'BeregningInfoPanel.FordelingBG.FordelingForrigeYtelse',
  'BeregningInfoPanel.FordelingBG.AndelIArbeid',
  'BeregningInfoPanel.FordelingBG.Refusjonskrav',
  'BeregningInfoPanel.FordelingBG.Fordeling',
  'BeregningInfoPanel.FordelingBG.Inntektskategori']
);

/**
 *  RenderBruttoBGFordelingFieldArray
 *
 * Presentasjonskomponent: Viser fordeling av brutto beregningsgrunnlag ved tilstøtende ytelser
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const RenderBruttoBGFordelingFieldArrayImpl = ({
  fields,
  meta,
  intl,
  arbeidsforholdList,
  inntektskategoriKoder,
  andeltyper,
  readOnly,
  dekningsgrad,
  isAksjonspunktClosed,
  isBeregningFormDirty,
}) => {
  const sumFordelingForrigeYtelse = summerFordelingForrigeYtelse(fields);
  const sumFordeling = summerFordeling(fields) || 0;
  const sumRedusertFordeling = getRedusertFordeling(dekningsgrad, sumFordeling) || 0;
  fields.forEach((andelElementFieldId, index) => {
    const field = fields.get(index);
    const arbeidsperiode = hentArbeidsperiode(field, arbeidsforholdList, andeltyper);
    if (arbeidsperiode !== null) {
      field.arbeidsperiodeFom = arbeidsperiode.arbeidsperiodeFom;
      field.arbeidsperiodeTom = arbeidsperiode.arbeidsperiodeTom;
    }
  });
  const selectVals = arbeidsgiverSelectValues(arbeidsforholdList, andeltyper);
  const tablerows = createAndelerTableRows(fields, selectVals, isAksjonspunktClosed, readOnly, inntektskategoriKoder);
  tablerows.push(createBruttoBGSummaryRow(sumFordelingForrigeYtelse, sumFordeling));
  tablerows.push(createRedusertBGSummaryRow(sumRedusertFordeling));
  return (
    <NavFieldGroup errorMessage={getErrorMessage(meta, intl, isBeregningFormDirty)}>
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
                fields.push(defaultBGFordeling);
              }}
              onKeyDown={() => fields.push(defaultBGFordeling)}
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
      <VerticalSpacer eightPx />
    </NavFieldGroup>
  );
};


RenderBruttoBGFordelingFieldArrayImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
  arbeidsforholdList: PropTypes.arrayOf(arbeidsforholdProptype).isRequired,
  inntektskategoriKoder: kodeverkPropType.isRequired,
  andeltyper: kodeverkPropType.isRequired,
  dekningsgrad: PropTypes.number.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  isBeregningFormDirty: PropTypes.bool.isRequired,
};

const RenderBruttoBGFordelingFieldArray = injectIntl(RenderBruttoBGFordelingFieldArrayImpl);


RenderBruttoBGFordelingFieldArray.validate = (values) => {
  const arrayErrors = values.map(andelFieldValues => validateAndelFields(andelFieldValues));
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
  return null;
};

const sorterKodeverkAlfabetisk = kodeverkListe => kodeverkListe.slice().sort((a, b) => a.navn.localeCompare(b.navn));


const mapStateToProps = (state, props) => {
  const faktaOmBeregning = getFaktaOmBeregning(state);
  const isBeregningFormDirty = isBehandlingFormDirty(props.formName)(state);
  let arbeidsforholdList;
  if (props.endringBGPeriode) {
    arbeidsforholdList = getUniqueListOfArbeidsforhold(props.endringBGPeriode.endringBeregningsgrunnlagAndeler);
  } else {
    arbeidsforholdList = getUniqueListOfArbeidsforhold(faktaOmBeregning && faktaOmBeregning.tilstøtendeYtelse
      ? faktaOmBeregning.tilstøtendeYtelse.tilstøtendeYtelseAndeler : undefined);
  }
  const andeltyper = getKodeverk(kodeverkTyper.BEREGNINGSGRUNNLAG_ANDELTYPER)(state);
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp
    .filter(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN);
  const isAksjonspunktClosed = relevantAp.length === 0 ? undefined : !isAksjonspunktOpen(relevantAp[0].status.kode);
  return {
    isBeregningFormDirty,
    isAksjonspunktClosed,
    andeltyper,
    arbeidsforholdList,
    dekningsgrad: faktaOmBeregning.tilstøtendeYtelse.dekningsgrad,
    inntektskategoriKoder: sorterKodeverkAlfabetisk(getKodeverk(kodeverkTyper.INNTEKTSKATEGORI)(state)),
  };
};


export default connect(mapStateToProps)(RenderBruttoBGFordelingFieldArray);
