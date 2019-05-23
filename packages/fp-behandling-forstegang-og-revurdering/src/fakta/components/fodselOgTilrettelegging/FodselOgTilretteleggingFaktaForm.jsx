import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import {
  FlexContainer, FlexColumn, FlexRow, VerticalSpacer, ElementWrapper,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import {
  required, hasValidDate, hasValidText, maxLength,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import {
  behandlingForm,
  getBehandlingFormInitialValues,
  getBehandlingFormValues,
  isBehandlingFormDirty,
} from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
 import {
   getTilrettelegging,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import ArbeidsforholdFaktaPanel from './ArbeidsforholdFaktaPanel';


import styles from './arbeidsforholdInnhold.less';

/**
 * Svangerskapspenger
 */

const maxLength1500 = maxLength(1500);

const FODSEL_TILRETTELEGGING_FORM = 'FodselOgTilretteleggingForm';

export const FodselOgTilretteleggingFaktaForm = ({
  readOnly,
  hasOpenAksjonspunkter,
  visBegrunnelse,
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
      </FlexRow>
      {visBegrunnelse
      && (
      <FlexRow>
        <FlexColumn className={styles.textAreaBredde}>
          <TextAreaField
            name="begrunnelse"
            label={{ id: 'FodselOgTilretteleggingFaktaForm.BegrunnEndringene' }}
            validate={[required, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
      )
    }
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
  </form>
);

FodselOgTilretteleggingFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  visBegrunnelse: PropTypes.bool.isRequired,
};

const transformValues = values => ([{
  kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
  ...values,
  bekreftetSvpArbeidsforholdList: values.arbeidsforhold,
}]);

const visBegrunnelse = createSelector([isBehandlingFormDirty(FODSEL_TILRETTELEGGING_FORM), getBehandlingFormValues(FODSEL_TILRETTELEGGING_FORM),
    getBehandlingFormInitialValues(FODSEL_TILRETTELEGGING_FORM)],
    (dirty, values, initialValues = {}) => dirty && values.termindato !== initialValues.termindato);

const mapStateToPropsFactory = (initialState, ownProps) => {
  // TODO: hente info fra backend når klart.  venter avklaring på om det blir checkboxer( mulighet for flere datoer),
  //  eller radiobuttons (kun 1 dato)
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
