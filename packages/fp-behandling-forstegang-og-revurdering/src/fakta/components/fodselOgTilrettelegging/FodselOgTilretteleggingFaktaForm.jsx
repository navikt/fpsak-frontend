import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  FlexContainer, FlexColumn, FlexRow, VerticalSpacer, ElementWrapper,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import {
  requiredIfNotPristine, hasValidDate, hasValidText, maxLength,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import {
  behandlingForm,
} from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
 import {
   getTilrettelegging,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import ArbeidsforholdFaktaPanel from './ArbeidsforholdFaktaPanel';


import styles from './arbeidsforholdInnhold.less';

/**
 * Svangerskapspenger
 * Presentasjonskomponent - viser tillrettlegging før svangerskapspenger
 */

const maxLength1500 = maxLength(1500);

const FODSEL_TILRETTELEGGING_FORM = 'FodselOgTilretteleggingForm';

export const FodselOgTilretteleggingFaktaForm = ({
  readOnly,
  hasOpenAksjonspunkter,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FlexContainer fluid wrap>
      <FlexRow>
        <FlexColumn>
          <DatepickerField
            name="termindato"
            label={{ id: 'FodselOgTilretteleggingFaktaForm.Termindato' }}
            validate={[required, hasValidDate]}
            readOnly={readOnly}
          />
        </FlexColumn>
        {fodelsdato && (
          <FlexColumn>
            <DatepickerField
              name="fodseldato"
              label={{ id: 'FodselOgTilretteleggingFaktaForm.Termindato' }}
              validate={[required, hasValidDate]}
              readOnly={readOnly}
            />
          </FlexColumn>
          )}
      </FlexRow>
    </FlexContainer>
    <ArbeidsforholdFaktaPanel readOnly={readOnly} formName={FODSEL_TILRETTELEGGING_FORM} />
    <FlexContainer fluid wrap>
      <FlexRow>
        <FlexColumn>
          <ElementWrapper>
            <VerticalSpacer twentyPx />
            <FaktaSubmitButton
              formName={formProps.form}
              isSubmittable={!readOnly}
              isReadOnly={readOnly}
              hasOpenAksjonspunkter={hasOpenAksjonspunkter}
            />
          </ElementWrapper>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    <FlexContainer>
      <FlexRow>
        <FlexColumn className={styles.textAreaBredde}>
          <TextAreaField
            name="begrunnelse"
            label={{ id: 'FodselOgTilretteleggingFaktaForm.BegrunnEndringene' }}
            validate={[requiredIfNotPristine, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </form>
);

FodselOgTilretteleggingFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
};

const transformValues = values => ([{
  kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
  ...values,
  bekreftetSvpArbeidsforholdList: values.arbeidsforhold,
}]);



const mapStateToPropsFactory = (initialState, ownProps) => {
  const tilrettelegging = getTilrettelegging(initialState);
  const initialValues = {
    termindato: tilrettelegging ? tilrettelegging.termindato : '',
    begrunnelse: tilrettelegging ? tilrettelegging.begrunnelse : '',
    arbeidsforhold: tilrettelegging ? tilrettelegging.arbeidsforholdListe : [],
  };
  const onSubmit = values => ownProps.submitCallback(transformValues(values));

  return state => ({
      initialValues,
      onSubmit,
      visBegrunnelse: visBegrunnelse(state),
    });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: FODSEL_TILRETTELEGGING_FORM,
})(FodselOgTilretteleggingFaktaForm));
