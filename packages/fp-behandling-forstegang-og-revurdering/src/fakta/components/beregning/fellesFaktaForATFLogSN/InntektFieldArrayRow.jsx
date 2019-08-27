import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import { InputField, SelectField, PeriodpickerField } from '@fpsak-frontend/form';
import { parseCurrencyInput } from '@fpsak-frontend/utils';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import { TableRow, TableColumn } from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { createSelector } from 'reselect';
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
  intl: intlShape.isRequired,
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
};

export const getIsAksjonspunktClosed = createSelector(
  [behandlingSelectors.getAksjonspunkter], (alleAp) => {
    const relevantAp = alleAp.filter((ap) => ap.definisjon.kode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN
      || ap.definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG);
    return relevantAp.length === 0 ? false : relevantAp.some((ap) => !isAksjonspunktOpen(ap.status.kode));
  },
);

export const getInntektskategorierAlfabetiskSortert = createSelector(
  [getKodeverk(kodeverkTyper.INNTEKTSKATEGORI)],
  (kodeverkListe) => kodeverkListe.slice().sort((a, b) => a.navn.localeCompare(b.navn)),
);


export const mapStateToProps = (state, ownProps) => {
  const field = ownProps.fields.get(ownProps.index);
  const isAksjonspunktClosed = getIsAksjonspunktClosed(state);
  const skalRedigereInntekt = getSkalRedigereInntekt(state)(field);
  const skalRedigereInntektskategori = getSkalRedigereInntektskategori(state)(field);
  return {
    skalRedigereInntekt,
    skalRedigereInntektskategori,
    isAksjonspunktClosed,
    inntektskategoriKoder: getInntektskategorierAlfabetiskSortert(state),
  };
};


export const AndelRow = connect(mapStateToProps)(injectIntl(AndelRowImpl));
