import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { injectIntl } from 'react-intl';

import { required, maxValue } from '@fpsak-frontend/utils';
import {
  FlexColumn, FlexContainer, FlexRow, PeriodFieldArray,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, InputField, SelectField } from '@fpsak-frontend/form';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';

import styles from './selvstendigNaringsdrivendeEllerFrilansFieldArray.less';

const maxValue3 = maxValue(100);

const defaultTilrettelegging = {
  tilretteleggingType: '',
  fomDato: '',
  stillingsprosent: '',
};

/**
 *  SelvstendigNaringsdrivendeEllerFrilansFieldArray
 *
 * Presentasjonskomponent: Viser inputfelter for arbeidsgiver og organisasjonsnummer for registrering av arbeidsforhold.
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const SelvstendigNaringsdrivendeEllerFrilansFieldArray = ({
  intl,
  fields,
  meta,
  readOnly,
}) => (
  <PeriodFieldArray
    fields={fields}
    meta={meta}
    emptyPeriodTemplate={defaultTilrettelegging}
    textCode="SelvstendigNaringsdrivendeFieldArray.LeggTilTilretteleggingsbehov"
    readOnly={readOnly}
  >
    {(tilretteleggingFieldId, index, getRemoveButton) => (
      <Row key={tilretteleggingFieldId} className={index !== (fields.length - 1) ? styles.notLastRow : ''}>
        <Column xs="12">
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <SelectField
                  readOnly={readOnly}
                  name={`${tilretteleggingFieldId}.tilretteleggingType`}
                  label={index === 0 ? { id: 'SelvstendigNaringsdrivendeFieldArray.BehovForTilrettelegging' } : ''}
                  validate={[required]}
                  selectValues={[
                    <option value={tilretteleggingType.HEL_TILRETTELEGGING} key={tilretteleggingType.HEL_TILRETTELEGGING}>
                      {intl.formatMessage({ id: 'SelvstendigNaringsdrivendeFieldArray.KanGjennomfores' })}
                    </option>,
                    <option value={tilretteleggingType.DELVIS_TILRETTELEGGING} key={tilretteleggingType.DELVIS_TILRETTELEGGING}>
                      {intl.formatMessage({ id: 'SelvstendigNaringsdrivendeFieldArray.RedusertArbeid' })}
                    </option>,
                    <option value={tilretteleggingType.INGEN_TILRETTELEGGING} key={tilretteleggingType.INGEN_TILRETTELEGGING}>
                      {intl.formatMessage({ id: 'SelvstendigNaringsdrivendeFieldArray.KanIkkeGjennomfores' })}
                    </option>,
                  ]}
                  bredde="XXL"
                />
              </FlexColumn>
              <FlexColumn>
                <DatepickerField
                  readOnly={readOnly}
                  name={`${tilretteleggingFieldId}.fomDato`}
                  defaultValue={null}
                  label={index === 0 ? { id: 'SelvstendigNaringsdrivendeFieldArray.FraDato' } : ''}
                  validate={[required]}
                />
              </FlexColumn>
              <FlexColumn>
                <InputField
                  readOnly={readOnly}
                  name={`${tilretteleggingFieldId}.stillingsprosent`}
                  label={index === 0 ? { id: 'SelvstendigNaringsdrivendeFieldArray.Stillingsprosent' } : ''}
                  bredde="XXL"
                  validate={[required, maxValue3]}
                  maxLength={99}
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

SelvstendigNaringsdrivendeEllerFrilansFieldArray.propTypes = {
  intl: PropTypes.shape().isRequired,
  fields: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  meta: PropTypes.shape().isRequired,
};

export default injectIntl(SelvstendigNaringsdrivendeEllerFrilansFieldArray);
