import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import landkoder from '@fpsak-frontend/kodeverk/src/landkoder';
import { maxLength } from '@fpsak-frontend/utils';
import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, InputField, SelectField } from '@fpsak-frontend/form';

import styles from './renderInntektsgivendeArbeidFieldArray.less';

const maxLength50 = maxLength(50);

const defaultInntektsgivendeArbeid = {
  arbeidsgiver: '',
  periodeFom: '',
  periodeTom: '',
  land: '',
};

const countrySelectValues = (countryCodes) => countryCodes
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
        <Row key={arbeidsforholdElementFieldId} className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
          <Column xs="12">
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

const mapStateToProps = (state, ownProps) => ({
  countryCodes: ownProps.alleKodeverk[kodeverkTyper.LANDKODER],
});

export default connect(mapStateToProps)(RenderInntektsgivendeArbeidFieldArray);
