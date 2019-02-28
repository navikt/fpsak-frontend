import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

export class FodselOgTilretteleggingFaktaForm extends Component {
  render() {
    const {
      readOnly,
      hasOpenAksjonspunkter,
      tilrettelegging,
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
  tilrettelegging: PropTypes.shape().isRequired,
};

const mapStateToProps = (state, props) => {
  // Dette blir helt sikkert på et annet format
  const tilrettelegging = {
    termindato: '2019-08-01',
    arbforhold: [
      {
        id: 123,
        jordmor: {
          tilretteleggingFra: '2019-04-18',
        },
        arbeidsforhold: {
          navn: 'Hansen flyttebyrå AS',
          tilrettelegging: 'REDUSERT',
          tilretteleggingFra: '2019-04-18',
          stillingsprosent: 50,
          begrunnelse: 'TEsting',
        },
      },
      {
        id: 456,
        jordmor: {
          tilretteleggingFra: '2019-06-20',
        },
        arbeidsforhold: {
          navn: 'Rema 100',
          tilrettelegging: 'IKKE_GJENNOMFORES',
          tilretteleggingFra: '2019-06-20',
          stillingsprosent: null,
          begrunnelse: 'Heia',
        },
      }],
  };
  return {
    tilrettelegging,
    initialValues: {
      termindato: tilrettelegging.termindato,
    },
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: 'FodselOgTilretteleggingForm',
})(FodselOgTilretteleggingFaktaForm));
