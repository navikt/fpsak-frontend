import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  FlexContainer, FlexColumn, FlexRow, VerticalSpacer, ElementWrapper,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import {
  requiredIfNotPristine, hasValidDate, hasValidText, maxLength, required,
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
  fodselsdato,
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
        {fodselsdato && (
        <FlexColumn>
          <DatepickerField
            name="fodselsdato"
            label={{ id: 'FodselOgTilretteleggingFaktaForm.Fodselsdato' }}
            validate={[required, hasValidDate]}
            readOnly={readOnly}
          />
        </FlexColumn>
        )}
      </FlexRow>
    </FlexContainer>
    <ArbeidsforholdFaktaPanel readOnly={readOnly} formName={FODSEL_TILRETTELEGGING_FORM} />
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

  </form>
);

FodselOgTilretteleggingFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  fodselsdato: PropTypes.string.isRequired,
};

const transformValues = values => ([{
  kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
  ...values,
  bekreftetSvpArbeidsforholdList: values.arbeidsforhold,
}]);

<<<<<<< HEAD
const mapStateToPropsFactory = (initialState, ownProps) => {
  const tilrettelegging = getTilrettelegging(initialState);
  const soknad = getSoknad(state);
  const initialValues = {
    termindato: tilrettelegging ? tilrettelegging.termindato : '',
    begrunnelse: tilrettelegging ? tilrettelegging.begrunnelse : '',
    arbeidsforhold: tilrettelegging ? tilrettelegging.arbeidsforholdListe : [],
    fodselsdato: soknad.fodselsdatoer ? soknad.fodselsdatoer[0] : '',
=======
const mapStateToProps = (state, ownProps) => {
  const tilrettelegging = getTilrettelegging(state);
  const fodselsdato = tilrettelegging ? tilrettelegging.fødselsdato : '';
  return {
    fodselsdato,
    initialValues: {
      termindato: tilrettelegging ? tilrettelegging.termindato : '',
      begrunnelse: tilrettelegging ? tilrettelegging.begrunnelse : '',
      arbeidsforhold: tilrettelegging ? tilrettelegging.arbeidsforholdListe : [],
      fodselsdato,
    },
    onSubmit: values => ownProps.submitCallback(transformValues(values)),
>>>>>>> FIX: fixes
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
