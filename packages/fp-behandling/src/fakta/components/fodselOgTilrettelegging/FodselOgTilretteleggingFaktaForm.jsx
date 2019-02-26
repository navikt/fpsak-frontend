import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
import {
  FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import FaktaSubmitButton from 'behandlingFpsak/src/fakta/components/FaktaSubmitButton';
import { behandlingForm } from 'behandlingFpsak/src/behandlingForm';
import { DatepickerField } from '@fpsak-frontend/form';
import {
  required, hasValidDate,
} from '@fpsak-frontend/utils';

import ArbeidsforholdFaktaPanel from './ArbeidsforholdFaktaPanel';

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
              <DatepickerField
                name="termindato"
                label={{ id: 'FodselOgTilretteleggingFaktaForm.Termindato' }}
                validate={[required, hasValidDate]}
                readOnly={false}
              />
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        <ArbeidsforholdFaktaPanel />
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
