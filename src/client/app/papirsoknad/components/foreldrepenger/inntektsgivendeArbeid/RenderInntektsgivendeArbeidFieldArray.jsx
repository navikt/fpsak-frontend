import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Column } from 'nav-frontend-grid';

import PeriodFieldArray from 'sharedComponents/PeriodFieldArray';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import landkoder from 'kodeverk/landkoder';
import { maxLength } from 'utils/validation/validators';
import { FlexContainer, FlexColumn, FlexRow } from 'sharedComponents/flexGrid';
import { InputField, DatepickerField, SelectField } from 'form/Fields';

import styles from './renderInntektsgivendeArbeidFieldArray.less';

const maxLength50 = maxLength(50);

const defaultInntektsgivendeArbeid = {
  arbeidsgiver: '',
  periodeFom: '',
  periodeTom: '',
  land: '',
};

const countrySelectValues = countryCodes => countryCodes
  .filter(({ kode }) => kode !== landkoder.NORGE)
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

/**
 *  RenderInntektsgivendeArbeidFieldArray
 *
 * Presentasjonskomponent: Viser inputfelter for arbeidsgiver og organisasjonsnummer for registrering av arbeidsforhold.
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const RenderInntektsgivendeArbeidFieldArray = ({
  fields,
  meta,
  countryCodes,
  readOnly,
}) => {
  const sortedCountriesByName = countryCodes.slice().sort((a, b) => a.navn.localeCompare(b.navn));

  return (
    <PeriodFieldArray
      fields={fields}
      meta={meta}
      emptyPeriodTemplate={defaultInntektsgivendeArbeid}
      textCode="Registrering.InntektsgivendeArbeid.LeggTilArbeidsforhold"
      readOnly={readOnly}
    >
      {(arbeidsforholdElementFieldId, index, getRemoveButton) => (
        <Row key={arbeidsforholdElementFieldId}>
          <Column xs="12" className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <InputField
                    readOnly={readOnly}
                    name={`${arbeidsforholdElementFieldId}.arbeidsgiver`}
                    label={index === 0 ? { id: 'Registrering.InntektsgivendeArbeid.Arbeidsgiver' } : ''}
                    bredde="XXL"
                    validate={[maxLength50]}
                    maxLength={99}
                  />
                </FlexColumn>
                <FlexColumn>
                  <DatepickerField
                    readOnly={readOnly}
                    name={`${arbeidsforholdElementFieldId}.periodeFom`}
                    defaultValue={null}
                    label={index === 0 ? { id: 'Registrering.InntektsgivendeArbeid.periodeFom' } : ''}
                  />
                </FlexColumn>
                <FlexColumn>
                  <DatepickerField
                    readOnly={readOnly}
                    name={`${arbeidsforholdElementFieldId}.periodeTom`}
                    defaultValue={null}
                    label={index === 0 ? { id: 'Registrering.InntektsgivendeArbeid.periodeTom' } : ''}
                  />
                </FlexColumn>
                <FlexColumn>
                  <SelectField
                    readOnly={readOnly}
                    name={`${arbeidsforholdElementFieldId}.land`}
                    label={index === 0 ? { id: 'Registrering.InntektsgivendeArbeid.Land' } : ''}
                    selectValues={countrySelectValues(sortedCountriesByName)}
                    bredde="m"
                  />
                </FlexColumn>
                <FlexColumn>
                  {getRemoveButton()}
                </FlexColumn>
              </FlexRow>
            </FlexContainer>
          </Column>
        </Row>
      )}
    </PeriodFieldArray>
  );
};

RenderInntektsgivendeArbeidFieldArray.propTypes = {
  fields: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  meta: PropTypes.shape().isRequired,
  countryCodes: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })).isRequired,
};

const mapStateToProps = state => ({
  countryCodes: getKodeverk(kodeverkTyper.LANDKODER)(state),
});

export default connect(mapStateToProps)(RenderInntektsgivendeArbeidFieldArray);
