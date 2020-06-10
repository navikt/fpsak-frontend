import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { FlexColumn, FlexContainer, FlexRow } from '@fpsak-frontend/shared-components';
import { Risikoklassifisering } from '@fpsak-frontend/types';

interface OwnProps {
  risikoklassifisering: Risikoklassifisering;
}

/**
 * Faresignaler
 *
 * Presentasjonskomponent. Viser en liste over faresignaler knyttet til behandlingen.
 */
const Faresignaler: FunctionComponent<OwnProps> = ({
  risikoklassifisering,
}) => (
  <FlexContainer>
    {risikoklassifisering.medlFaresignaler && risikoklassifisering.medlFaresignaler.faresignaler
          && (
          <div>
            <FlexRow>
              <FlexColumn>
                <Element><FormattedMessage id="Risikopanel.Panel.Medlemskap" /></Element>
                <ul>
                  {risikoklassifisering.medlFaresignaler.faresignaler.map((faresignal) => (
                    <li key={faresignal}>
                      <Normaltekst>{decodeHtmlEntity(faresignal)}</Normaltekst>
                    </li>
                  ))}
                </ul>
              </FlexColumn>
            </FlexRow>
          </div>
          )}
    {risikoklassifisering.iayFaresignaler && risikoklassifisering.iayFaresignaler.faresignaler
          && (
          <div>
            <FlexRow>
              <FlexColumn>
                <Element><FormattedMessage id="Risikopanel.Panel.ArbeidsforholdInntekt" /></Element>
                <ul>
                  {risikoklassifisering.iayFaresignaler.faresignaler.map((faresignal) => (
                    <li key={faresignal}>
                      <Normaltekst>{decodeHtmlEntity(faresignal)}</Normaltekst>
                    </li>
                  ))}
                </ul>
              </FlexColumn>
            </FlexRow>
          </div>
          )}
  </FlexContainer>
);

export default Faresignaler;
