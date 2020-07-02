import React from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { InputField, PeriodpickerField, SelectField } from '@fpsak-frontend/form';
import { parseCurrencyInput } from '@fpsak-frontend/utils';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import { TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import styles from './inntektFieldArray.less';
import ArbeidsforholdField from './ArbeidsforholdField';
import { getSkalRedigereInntekt, getSkalRedigereInntektskategori } from './BgFordelingUtils';

export const getHeaderTextCodes = (skalVisePeriode, skalViseRefusjon) => {
  const headerCodes = [];
  headerCodes.push('BeregningInfoPanel.FordelingBG.Andel');
  if (skalVisePeriode) {
    headerCodes.push('BeregningInfoPanel.FordelingBG.Arbeidsperiode');
  }
  headerCodes.push('BeregningInfoPanel.FordelingBG.Fordeling');
  if (skalViseRefusjon) {
    headerCodes.push('BeregningInfoPanel.FordelingBG.Refusjonskrav');
  }
  headerCodes.push('BeregningInfoPanel.FordelingBG.Inntektskategori');

  return headerCodes;
};

const inntektskategoriSelectValues = (kategorier) => kategorier.map((ik) => (
  <option value={ik.kode} key={ik.kode}>
    {ik.navn}
  </option>
));

/**
 *  InntektFieldArrayAndelRow
 *
 * Presentasjonskomponent: Viser en rad korresponderende til ein andel i beregning.
 */
export const AndelRowImpl = ({
  fields,
  index,
  intl,
  skalVisePeriode,
  skalViseRefusjon,
  skalViseSletteknapp,
  skalRedigereInntekt,
  skalRedigereInntektskategori,
  andelElementFieldId,
  inntektskategoriKoder,
  readOnly,
  isAksjonspunktClosed,
  removeAndel,
  alleKodeverk,
}) => {
  const field = fields.get(index);
  field.skalRedigereInntekt = skalRedigereInntekt;
  return (
    <TableRow>
      <TableColumn>
        <ArbeidsforholdField
          fields={fields}
          index={index}
          name={`${andelElementFieldId}.andel`}
          readOnly={readOnly}
          alleKodeverk={alleKodeverk}
        />
      </TableColumn>
      {skalVisePeriode
      && (
      <TableColumn>
        <PeriodpickerField
          names={[`${andelElementFieldId}.arbeidsperiodeFom`, `${andelElementFieldId}.arbeidsperiodeTom`]}
          readOnly
          defaultValue={null}
          renderIfMissingDateOnReadOnly
        />
      </TableColumn>
      )}
      {skalRedigereInntekt
    && (
    <TableColumn className={styles.rightAlignInput}>
      <InputField
        name={`${andelElementFieldId}.fastsattBelop`}
        bredde="M"
        parse={parseCurrencyInput}
        readOnly={readOnly}
        isEdited={isAksjonspunktClosed}
      />
    </TableColumn>
    )}
      {!skalRedigereInntekt
    && (
    <TableColumn className={styles.rightAlign}>
      <InputField
        name={`${andelElementFieldId}.belopReadOnly`}
        bredde="M"
        parse={parseCurrencyInput}
        readOnly
      />
    </TableColumn>
    )}
      {skalViseRefusjon
          && (
          <TableColumn className={styles.rightAlign}>
            <InputField
              name={`${andelElementFieldId}.refusjonskrav`}
              bredde="XS"
              readOnly
              parse={parseCurrencyInput}
            />
          </TableColumn>
          )}
      <TableColumn className={styles.rightAlign}>
        <SelectField
          label=""
          name={`${andelElementFieldId}.inntektskategori`}
          bredde="l"
          selectValues={inntektskategoriSelectValues(inntektskategoriKoder)}
          value={fields.get(index).inntektskategori}
          readOnly={readOnly || !skalRedigereInntektskategori}
          isEdited={isAksjonspunktClosed && skalRedigereInntektskategori}
        />
      </TableColumn>
      <TableColumn>
        {skalViseSletteknapp
    && (
      <button
        className={styles.buttonRemove}
        type="button"
        onClick={() => removeAndel()}
        title={intl.formatMessage({ id: 'BeregningInfoPanel.FordelingBG.FjernAndel' })}
      />
    )}
      </TableColumn>
    </TableRow>
  );
};

AndelRowImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fields: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  inntektskategoriKoder: kodeverkPropType.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  skalVisePeriode: PropTypes.bool.isRequired,
  skalViseRefusjon: PropTypes.bool.isRequired,
  skalViseSletteknapp: PropTypes.bool.isRequired,
  skalRedigereInntekt: PropTypes.bool.isRequired,
  skalRedigereInntektskategori: PropTypes.bool.isRequired,
  andelElementFieldId: PropTypes.string.isRequired,
  removeAndel: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export const getInntektskategorierAlfabetiskSortert = createSelector(
  [(ownProps) => ownProps.alleKodeverk[kodeverkTyper.INNTEKTSKATEGORI]],
  (kodeverkListe) => kodeverkListe.slice().sort((a, b) => a.navn.localeCompare(b.navn)),
);

export const mapStateToProps = (state, ownProps) => {
  const field = ownProps.fields.get(ownProps.index);
  const skalRedigereInntekt = getSkalRedigereInntekt(state, ownProps)(field);
  const skalRedigereInntektskategori = getSkalRedigereInntektskategori(state, ownProps)(field);
  return {
    skalRedigereInntekt,
    skalRedigereInntektskategori,
    inntektskategoriKoder: getInntektskategorierAlfabetiskSortert(ownProps),
  };
};

export const AndelRow = connect(mapStateToProps)(injectIntl(AndelRowImpl));
