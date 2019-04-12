import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { getAksjonspunkter } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { InputField, NavFieldGroup, SelectField } from '@fpsak-frontend/form';
import {
  isArrayEmpty, formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber, required,
} from '@fpsak-frontend/utils';
import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import { getKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  Image, Table, TableRow, TableColumn, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import styles from './brukersAndelFieldArray.less';
import { validateUlikeAndelerWithGroupingFunction } from '../ValidateAndelerUtils';
import { isBeregningFormDirty as isFormDirty } from '../../BeregningFormUtils';

const defaultBGFordeling = aktivitetStatuser => ({
  andel: aktivitetStatuser.filter(({ kode }) => kode === aktivitetStatus.BRUKERS_ANDEL)[0].navn,
  fastsattBelop: '',
  inntektskategori: '',
  nyAndel: true,
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
    sum += fields.get(index).fastsattBelop ? parseInt(removeSpacesFromNumber(fields.get(index).fastsattBelop), 10) : 0;
  });
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const isDirty = (meta, isBeregningFormDirty) => (meta.dirty || isBeregningFormDirty);

const renderMessage = (intl, error) => (error[0] && error[0].id ? intl.formatMessage(...error) : error);

const getErrorMessage = (meta, intl, isBeregningFormDirty) => (meta.error && isDirty(meta, isBeregningFormDirty)
&& meta.submitFailed ? renderMessage(intl, meta.error) : null);

function skalViseSletteknapp(index, fields, readOnly) {
  return (fields.get(index).nyAndel || fields.get(index).lagtTilAvSaksbehandler) && !readOnly;
}
const onKeyDown = (fields, aktivitetStatuser) => ({ keyCode }) => {
  if (keyCode === 13) {
    fields.push(defaultBGFordeling(aktivitetStatuser));
  }
};

const createAndelerTableRows = (fields, isAksjonspunktClosed, readOnly,
  inntektskategoriKoder, intl) => fields.map((andelElementFieldId, index) => (
    <TableRow key={andelElementFieldId}>
      <TableColumn>
        <FormattedMessage id="BeregningInfoPanel.FordelingBG.Ytelse" />
      </TableColumn>
      <TableColumn className={styles.rightAlignInput}>
        <InputField
          name={`${andelElementFieldId}.fastsattBelop`}
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
          bredde="L"
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

/**
 *  BrukersAndelFieldArray
 *
 * Presentasjonskomponent: Viser fordeling for brukers andel ved kun ytelse
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const BrukersAndelFieldArrayImpl = ({
  fields,
  meta,
  intl,
  inntektskategoriKoder,
  aktivitetStatuser,
  readOnly,
  isAksjonspunktClosed,
  isBeregningFormDirty,
}) => {
  const sumFordeling = summerFordeling(fields) || 0;
  const tablerows = createAndelerTableRows(fields, isAksjonspunktClosed, readOnly, inntektskategoriKoder, intl);
  tablerows.push(createBruttoBGSummaryRow(sumFordeling));
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
                fields.push(defaultBGFordeling(aktivitetStatuser));
              }}
              onKeyDown={onKeyDown(fields, aktivitetStatuser)}
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


BrukersAndelFieldArrayImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
  inntektskategoriKoder: kodeverkPropType.isRequired,
  aktivitetStatuser: kodeverkPropType.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  isBeregningFormDirty: PropTypes.bool.isRequired,
};

const BrukersAndelFieldArray = injectIntl(BrukersAndelFieldArrayImpl);


const mapBrukesAndelToSortedObject = (value) => {
  const { andel, inntektskategori } = value;
  return { andelsinfo: andel, inntektskategori };
};

BrukersAndelFieldArray.validate = (values) => {
  if (!values) {
    return null;
  }
  const arrayErrors = values.map((andelFieldValues) => {
    const fieldErrors = {};
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
  const ulikeAndelerError = validateUlikeAndelerWithGroupingFunction(values, mapBrukesAndelToSortedObject);
  if (ulikeAndelerError) {
    return { _error: <FormattedMessage id={ulikeAndelerError[0].id} /> };
  }
  return null;
};

const sorterKodeverkAlfabetisk = kodeverkListe => kodeverkListe.slice().sort((a, b) => a.navn.localeCompare(b.navn));


const mapStateToProps = (state) => {
  const isBeregningFormDirty = isFormDirty(state);
  const aktivitetStatuser = getKodeverk(kodeverkTyper.AKTIVITET_STATUS)(state);
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp
    .filter(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN);
  const isAksjonspunktClosed = relevantAp.length === 0 ? undefined : !isAksjonspunktOpen(relevantAp[0].status.kode);
  return {
    isBeregningFormDirty,
    isAksjonspunktClosed,
    aktivitetStatuser,
    inntektskategoriKoder: sorterKodeverkAlfabetisk(getKodeverk(kodeverkTyper.INNTEKTSKATEGORI)(state)),
  };
};


export default connect(mapStateToProps)(BrukersAndelFieldArray);
