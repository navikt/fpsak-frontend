import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import {
  FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import { DatepickerField } from '@fpsak-frontend/form';
import {
  required, hasValidDate,
} from '@fpsak-frontend/utils';

import FaktaSubmitButton from 'behandlingFpsak/src/fakta/components/FaktaSubmitButton';
import { behandlingForm } from 'behandlingFpsak/src/behandlingForm';
import ArbeidsforholdFaktaPanel from './ArbeidsforholdFaktaPanel';

// Dette blir helt sikkert på et annet format
const tilrettelegging = {
  termindato: '2019-08-01',
  arbforhold: [
    {
      id: 123,
      jordmor: {
        tilretteleggingFra: '14.04.2019',
      },
      arbeidsforhold: {
        navn: 'Hansen flyttebyrå AS',
        tilrettelegging: 'REDUSERT',
        tilretteleggingFra: '14.04.2019',
        stillingsprosent: 50,
      },
    },
    {
      id: 456,
      jordmor: {
        tilretteleggingFra: '20.6.2019',
      },
      arbeidsforhold: {
        navn: 'Rema 100',
        tilrettelegging: 'IKKE_GJENNOMFORES',
        tilretteleggingFra: '14.04.2019',
        stillingsprosent: null,
      },
    }],
};

export class FodselOgTilretteleggingFaktaForm extends Component {
  constructor() {
    super();
  }

  render() {
    const {
      readOnly,
      hasOpenAksjonspunkter,
      ...formProps
    } = this.props;
    return (
      <form onSubmit={formProps.handleSubmit}>
        <FlexContainer fluid wrap>
          <FlexRow>
            <FlexColumn>
              {tilrettelegging.termindato}
              <DatepickerField
                name="termindato"
                label={{ id: 'FodselOgTilretteleggingFaktaForm.Termindato' }}
                validate={[required, hasValidDate]}
                readOnly={false}
              />
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        <ArbeidsforholdFaktaPanel tilrettelegging={tilrettelegging} />
        <FlexContainer fluid wrap>
          <FlexRow>
            <FlexColumn>
              <FaktaSubmitButton
                formName={formProps.form}
                isSubmittable={!readOnly}
                isReadOnly={false}
                hasOpenAksjonspunkter={hasOpenAksjonspunkter}
              />
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </form>
    );
  }
}

FodselOgTilretteleggingFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
};

export default (behandlingForm({
  form: 'FodselOgTilretteleggingForm',
})(FodselOgTilretteleggingFaktaForm));
