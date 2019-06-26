import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Element } from 'nav-frontend-typografi';
import {
  FlexContainer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';

/**
 * Faresignaler
 *
 * Presentasjonskomponent. Viser en liste over faresignaler knyttet til behandlingen.
 */
const Faresignaler = ({
  risikoklassifisering,
}) => (
  <FlexContainer>
    {risikoklassifisering.medlFaresignaler
          && (
          <div>
            <FlexRow>
              <FlexColumn>
                <Element><FormattedMessage id="Risikopanel.Panel.Medlemskap" /></Element>
                <ul>
                  {risikoklassifisering.medlFaresignaler.faresignaler.map(faresignal => (
                    <li key={faresignal}>{faresignal}</li>
                  ))}
                </ul>
              </FlexColumn>
            </FlexRow>
          </div>
          )
      }
    {risikoklassifisering.iayFaresignaler
          && (
          <div>
            <FlexRow>
              <FlexColumn>
                <Element><FormattedMessage id="Risikopanel.Panel.ArbeidsforholdInntekt" /></Element>
                <ul>
                  {risikoklassifisering.iayFaresignaler.faresignaler.map(faresignal => (
                    <li key={faresignal}>{faresignal}</li>
                  ))}
                </ul>
              </FlexColumn>
            </FlexRow>
          </div>
          )
        }
  </FlexContainer>
);
Faresignaler.propTypes = {
  risikoklassifisering: PropTypes.shape().isRequired,
};

export default Faresignaler;