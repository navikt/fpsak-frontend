import React from 'react';
import {
  FlexContainer, FlexColumn, FlexRow,
} from '@fpsak-frontend/shared-components';
import { DatepickerField, TextAreaField } from '@fpsak-frontend/form';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';

import {
  required, hasValidDate, maxLength, minLength, hasValidText,
} from '@fpsak-frontend/utils';

import FaktaGruppe from 'behandlingFpsak/src/fakta/components/FaktaGruppe';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const ArbeidsforholdFaktaPanel = () => (
  <FaktaGruppe titleCode="ArbeidsforholdFaktaPanel.Faktagruppe">
    <div>Arbeidsforhold...</div>
    <div>Tabell</div>
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <DatepickerField
            name="tilretteleggingFra"
            label={{ id: 'ArbeidsforholdFaktaPanel.TilretteleggingFra' }}
            validate={[required, hasValidDate]}
            readOnly={false}
          />
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
            onClick=""
          >
            <FormattedMessage id="ArbeidsforholdFaktaPanel.Avbryt" />
          </Knapp>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  </FaktaGruppe>
);
ArbeidsforholdFaktaPanel.propTypes = {
};

ArbeidsforholdFaktaPanel.defaultProps = {
};

export default ArbeidsforholdFaktaPanel;
