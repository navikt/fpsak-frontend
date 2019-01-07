import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  required, minLength, maxLength, hasValidText,
} from '@fpsak-frontend/utils';
import {
  AksjonspunktHelpText, VerticalSpacer, FlexContainer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import {
  RadioGroupField, RadioOption, TextAreaField,
} from '@fpsak-frontend/form';

import styles from './annenForelderHarRett.less';

const minLength3 = minLength(3);
const maxLength4000 = maxLength(4000);

export const AnnenForelderHarRett = ({
  hasOpenAksjonspunkter,
  aksjonspunkter,
  readOnly,
}) => (
  <FlexContainer>
    {!readOnly && (
    <FlexRow>
      <FlexColumn>
        <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
          {aksjonspunkter.map(ap => (
            <FormattedMessage
              key={`UttakInfoPanel.Aksjonspunkt.${ap.definisjon.kode}`}
              id={`UttakInfoPanel.Aksjonspunkt.${ap.definisjon.kode}`}
            />
          ))}

        </AksjonspunktHelpText>
      </FlexColumn>
    </FlexRow>
    )
    }

    <FlexRow>
      <FlexColumn className={styles.fauxColumn}>
        <VerticalSpacer twentyPx />
        <FlexRow>
          <FlexColumn>
            <RadioGroupField name="annenForelderHarRett" validate={[required]} readOnly={readOnly}>
              <RadioOption value label={{ id: 'UttakInfoPanel.AnnenForelderHarRett' }} />
              <RadioOption value={false} label={{ id: 'UttakInfoPanel.AnnenForelderHarIkkeRett' }} />
            </RadioGroupField>
          </FlexColumn>
        </FlexRow>

        <FlexRow>
          <FlexColumn>

            <div className={styles.textAreaStyle}>
              <TextAreaField
                name="begrunnelse"
                readOnly={readOnly}
                label={{ id: 'UttakInfoPanel.BegrunnEndringene' }}
                validate={[required, minLength3, maxLength4000, hasValidText]}
                maxLength={4000}
              />
            </div>
          </FlexColumn>
        </FlexRow>
      </FlexColumn>
    </FlexRow>
  </FlexContainer>
);

AnnenForelderHarRett.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.shape().isRequired,
};

export default AnnenForelderHarRett;
