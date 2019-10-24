import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  ElementWrapper, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidDate, hasValidText, maxLength, required, requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { getTilrettelegging } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import ArbeidsforholdFaktaPanel from './arbeidsforhold/ArbeidsforholdFaktaPanel';

import styles from './fodselOgTilretteleggingFaktaFormOld.less';

const maxLength1500 = maxLength(1500);

const FODSEL_TILRETTELEGGING_FORM = 'FodselOgTilretteleggingForm';

const getAksjonspunkt = (aksjonspunkter) => aksjonspunkter.filter((ap) => ap.definisjon.kode === aksjonspunktCodes.FODSELTILRETTELEGGING)[0].begrunnelse;

/**
 * Svangerskapspenger
 * Presentasjonskomponent - viser tillrettlegging før svangerskapspenger
 */
export const FodselOgTilretteleggingFaktaFormOld = ({
  readOnly,
  hasOpenAksjonspunkter,
  fødselsdato,
  submittable,
  ...formProps
}) => {
  const [erArbeidsforholdValgt, settErArbeidsforholdValgt] = useState(false);
  return (
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
      <ArbeidsforholdFaktaPanel
        readOnly={readOnly}
        formName={FODSEL_TILRETTELEGGING_FORM}
        submittable={submittable}
        settErArbeidsforholdValgt={settErArbeidsforholdValgt}
      />
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
                formName={FODSEL_TILRETTELEGGING_FORM}
                isSubmittable={submittable && !erArbeidsforholdValgt}
                isReadOnly={readOnly}
                hasOpenAksjonspunkter={hasOpenAksjonspunkter}
              />
            </ElementWrapper>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </form>
  );
};

FodselOgTilretteleggingFaktaFormOld.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  fødselsdato: PropTypes.string,
  submittable: PropTypes.bool.isRequired,
};

FodselOgTilretteleggingFaktaFormOld.defaultProps = {
  fødselsdato: '',
};

const transformValues = (values) => ([{
  kode: aksjonspunktCodes.FODSELTILRETTELEGGING,
  ...values,
  bekreftetSvpArbeidsforholdList: values.arbeidsforhold,
}]);

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunkter = behandlingSelectors.getAksjonspunkter(initialState);
  const tilrettelegging = getTilrettelegging(initialState);
  const fødselsdato = tilrettelegging ? tilrettelegging.fødselsdato : '';
  const initialValues = {
    termindato: tilrettelegging ? tilrettelegging.termindato : '',
    arbeidsforhold: tilrettelegging ? tilrettelegging.arbeidsforholdListe : [],
    fødselsdato,
    begrunnelse: getAksjonspunkt(aksjonspunkter),
  };
  const onSubmit = (values) => ownProps.submitCallback(transformValues(values));
  return ({
    initialValues,
    onSubmit,
    fødselsdato,
  });
};

export default connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
  form: FODSEL_TILRETTELEGGING_FORM,
})(FodselOgTilretteleggingFaktaFormOld));