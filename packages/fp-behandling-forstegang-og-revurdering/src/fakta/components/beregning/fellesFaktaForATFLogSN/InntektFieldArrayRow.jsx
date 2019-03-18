import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { getKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import { InputField, SelectField, PeriodpickerField } from '@fpsak-frontend/form';
import { removeSpacesFromNumber, parseCurrencyInput, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import { TableRow, TableColumn } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getAksjonspunkter } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import styles from './kunYtelse/brukersAndelFieldArray.less';
import ArbeidsforholdField from './ArbeidsforholdField';
import { skalRedigereInntektSelector, skalRedigereInntektskategoriSelector } from './BgFordelingUtils';

const summerFordeling = (fields) => {
  let sum = 0;
  fields.forEach((andelElementFieldId, index) => {
    const field = fields.get(index);
    const belop = field.skalRedigereInntekt ? field.fastsattBelop : field.belopReadOnly;
    sum += belop ? parseInt(removeSpacesFromNumber(belop), 10) : 0;
  });
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};


export const SummaryRow = ({ skalVisePeriode, skalViseRefusjon, fields }) => (
  <TableRow key="bruttoBGSummaryRow">
    <TableColumn>
      <FormattedMessage id="BeregningInfoPanel.FordelingBG.Sum" />
    </TableColumn>
    {skalVisePeriode
          && <TableColumn />
    }
    <TableColumn className={styles.rightAlign}>
      <Undertekst>
        {summerFordeling(fields) || 0}
      </Undertekst>
    </TableColumn>
    {skalViseRefusjon
          && <TableColumn />
    }
    <TableColumn />
  </TableRow>
);

SummaryRow.propTypes = {
  fields: PropTypes.shape().isRequired,
  skalVisePeriode: PropTypes.bool.isRequired,
  skalViseRefusjon: PropTypes.bool.isRequired,
};


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

const inntektskategoriSelectValues = kategorier => kategorier.map(ik => (
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
}) => (
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
      )
    }
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
    )
    }
    {!skalRedigereInntekt
    && (
    <TableColumn className={styles.rightAlignInput}>
      <InputField
        name={`${andelElementFieldId}.belopReadOnly`}
        bredde="M"
        parse={parseCurrencyInput}
        readOnly
      />
    </TableColumn>
    )
    }
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
          )
    }
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
    )
    }
    </TableColumn>
  </TableRow>
);


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


const sorterKodeverkAlfabetisk = kodeverkListe => kodeverkListe.slice().sort((a, b) => a.navn.localeCompare(b.navn));


export const mapStateToProps = (state, ownProps) => {
  const alleAp = getAksjonspunkter(state);
  const relevantAp = alleAp
    .filter(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN);
  const isAksjonspunktClosed = relevantAp.length === 0 ? undefined : !isAksjonspunktOpen(relevantAp[0].status.kode);
  const field = ownProps.fields.get(ownProps.index);
  const skalRedigereInntekt = skalRedigereInntektSelector(state)(field);
  const skalRedigereInntektskategori = skalRedigereInntektskategoriSelector(state)(field);
  field.skalRedigereInntekt = skalRedigereInntekt;
  return {
    skalRedigereInntekt,
    skalRedigereInntektskategori,
    isAksjonspunktClosed,
    inntektskategoriKoder: sorterKodeverkAlfabetisk(getKodeverk(kodeverkTyper.INNTEKTSKATEGORI)(state)),
  };
};


export const AndelRow = connect(mapStateToProps)(injectIntl(AndelRowImpl));
