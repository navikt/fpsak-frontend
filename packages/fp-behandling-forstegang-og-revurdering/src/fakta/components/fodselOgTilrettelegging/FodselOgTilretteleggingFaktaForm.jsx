import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  FlexContainer, FlexColumn, FlexRow, VerticalSpacer, ElementWrapper,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import {
  required, hasValidDate, hasValidText, maxLength, requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import {
  behandlingForm,
} from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
 import {
   getTilrettelegging,
   getAksjonspunkter,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import ArbeidsforholdFaktaPanel from './ArbeidsforholdFaktaPanel';


import styles from './arbeidsforholdInnhold.less';

/**
 * Svangerskapspenger
 * Presentasjonskomponent - viser tillrettlegging før svangerskapspenger
 */

const maxLength1500 = maxLength(1500);

const FODSEL_TILRETTELEGGING_FORM = 'FodselOgTilretteleggingForm';

const getAksjonspunkt = aksjonspunkter => aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.FODSELTILRETTELEGGING)[0].begrunnelse;

export const FodselOgTilretteleggingFaktaForm = ({
  readOnly,
  hasOpenAksjonspunkter,
  fødselsdato,
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
        {fødselsdato && (
        <FlexColumn>
          <DatepickerField
            name="fødselsdato"
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
  fødselsdato: PropTypes.string,
};

FodselOgTilretteleggingFaktaForm.defaultProps = {
  fødselsdato: '',
};

const transformValues = values => ([{
  kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
  ...values,
  bekreftetSvpArbeidsforholdList: values.arbeidsforhold,
}]);

    const mapStateToPropsFactory = (initialState, ownProps) => {
      const aksjonspunkter = getAksjonspunkter(initialState);
      const tilrettelegging = getTilrettelegging(initialState);
      const fødselsdato = tilrettelegging ? tilrettelegging.fødselsdato : '';
      const initialValues = {
        termindato: tilrettelegging ? tilrettelegging.termindato : '',
        arbeidsforhold: tilrettelegging ? tilrettelegging.arbeidsforholdListe : [],
        fødselsdato,
        begrunnelse: getAksjonspunkt(aksjonspunkter),
      };
 const onSubmit = values => ownProps.submitCallback(transformValues(values));

  return ({
      initialValues,
      onSubmit,
      fødselsdato,
    });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: FODSEL_TILRETTELEGGING_FORM,
})(FodselOgTilretteleggingFaktaForm));
