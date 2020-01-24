import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import { Knapp } from 'nav-frontend-knapper';

import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, InputField } from '@fpsak-frontend/form';
import { required, hasValidOrgNumberOrFodselsnr } from '@fpsak-frontend/utils';
import BehovForTilrettteleggingFieldArray from './BehovForTilrettteleggingFieldArray';

const behovForTilretteleggingFieldArrayName = 'tilretteleggingArbeidsgiver';

const defaultTilrettelegging = {
  organisasjonsnummer: '',
  behovsdato: '',
};

const leggTilArbeidsgiver = (fields) => () => {
  fields.push(defaultTilrettelegging);
};

/*
 * TilretteleggingForArbeidsgiverFieldArray
 *
 * Form som brukes for registrere om det er behov for tilrettelegging for arbeidsgiver.
 */
const TilretteleggingForArbeidsgiverFieldArray = ({
  fields,
  readOnly,
}) => fields.map((fieldId, index) => (
  <div key={fieldId}>
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <InputField
            readOnly={readOnly}
            name={`${fieldId}.organisasjonsnummer`}
            label={{ id: 'TilretteleggingForArbeidsgiverFieldArray.OrgNr' }}
            bredde="XL"
            validate={[required, hasValidOrgNumberOrFodselsnr]}
            maxLength={99}
          />
        </FlexColumn>
        <FlexColumn>
          <DatepickerField
            name={`${fieldId}.behovsdato`}
            label={{ id: 'BehovForTilretteleggingPanel.TilretteleggingFra' }}
            validate={[required]}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    <FieldArray
      name={`${fieldId}.${behovForTilretteleggingFieldArrayName}`}
      component={BehovForTilrettteleggingFieldArray}
      readOnly={readOnly}
    />
    {fields.length > index + 1 && (
      <>
        <hr />
        <VerticalSpacer sixteenPx />
      </>
    )}
    {fields.length === index + 1 && (
      <Knapp mini htmlType="button" onClick={leggTilArbeidsgiver(fields)}>
        <FormattedMessage id="TilretteleggingForArbeidsgiverFieldArray.LeggTilArbeidsgiver" />
      </Knapp>
    )}
  </div>
));

TilretteleggingForArbeidsgiverFieldArray.propTypes = {
  readOnly: PropTypes.bool.isRequired,
};

export default TilretteleggingForArbeidsgiverFieldArray;
