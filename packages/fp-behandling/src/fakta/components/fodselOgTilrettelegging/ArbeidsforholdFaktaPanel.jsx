import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';

import {
  FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import {
  required, hasValidDate, maxLength, minLength, hasValidText,
} from '@fpsak-frontend/utils';

import FaktaGruppe from 'behandlingFpsak/src/fakta/components/FaktaGruppe';
import ArbeidsforholdTable from './ArbeidsforholdTable';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);


export class ArbeidsforholdFaktaPanel extends Component {
  constructor() {
    super();
    this.state = {
      selectedArbeidsforhold: undefined,
    };
    this.setSelectedArbeidsforhold = this.setSelectedArbeidsforhold.bind(this);
    this.cancelArbeidsforhold = this.cancelArbeidsforhold.bind(this);
  }

  setSelectedArbeidsforhold(event, id, selectedArbeidsforhold) {
    // this.initializeActivityForm(selectedArbeidsforhold);
    this.setState({ selectedArbeidsforhold });
  }

  cancelArbeidsforhold() {
    // this.initializeActivityForm({});
    this.setState({ selectedArbeidsforhold: undefined });
  }

  render() {
    const { tilrettelegging } = this.props;
    const { selectedArbeidsforhold } = this.state;
    return (
      <FaktaGruppe titleCode="ArbeidsforholdFaktaPanel.Faktagruppe">
        <ArbeidsforholdTable
          arbeidsforhold={tilrettelegging.arbforhold}
          selectArbeidsforholdCallback={this.setSelectedArbeidsforhold}
          selectedArbeidsforhold={selectedArbeidsforhold ? selectedArbeidsforhold.id : undefined}
        />
        {selectedArbeidsforhold
        && (
        <div>
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <DatepickerField
                  name="tilretteleggingFra"
                  label={{ id: 'ArbeidsforholdFaktaPanel.TilretteleggingFra' }}
                  validate={[required, hasValidDate]}
                  readOnly={false}
                />
                {selectedArbeidsforhold.jordmor.tilretteleggingFra}
              </FlexColumn>
            </FlexRow>
            <FlexRow>
              <FlexColumn>
                <TextAreaField
                  name="begrunnelse"
                  label={{ id: 'ArbeidsforholdFaktaPanel.BegrunnEndringene' }}
                  readOnly={false}
                  validate={[
                    minLength3,
                    maxLength1500,
                    hasValidText,
                  ]}
                  maxLength={1500}
                />
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
          <FlexContainer fluid>
            <FlexRow>
              <FlexColumn>
                <Hovedknapp
                  htmlType="button"
                  mini
                  onClick=""
                >
                  <FormattedMessage id="ArbeidsforholdFaktaPanel.Oppdater" />
                </Hovedknapp>
              </FlexColumn>
              <FlexColumn>
                <Knapp
                  htmlType="button"
                  mini
                  onClick={this.cancelArbeidsforhold}
                >
                  <FormattedMessage id="ArbeidsforholdFaktaPanel.Avbryt" />
                </Knapp>
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        </div>
        )
      }
      </FaktaGruppe>
    );
  }
}
ArbeidsforholdFaktaPanel.propTypes = {
  tilrettelegging: PropTypes.shape().isRequired,
};

ArbeidsforholdFaktaPanel.defaultProps = {
};

export default ArbeidsforholdFaktaPanel;
