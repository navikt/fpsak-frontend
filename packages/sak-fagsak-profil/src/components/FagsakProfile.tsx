import React, { FunctionComponent, ReactNode } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { EtikettInfo } from 'nav-frontend-etiketter';

import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer, Tooltip,
} from '@fpsak-frontend/shared-components';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { KodeverkMedNavn } from '@fpsak-frontend/types';

const visSakDekningsgrad = (saksKode, dekningsgrad) => {
  const erForeldrepenger = saksKode === FagsakYtelseType.FORELDREPENGER;
  const gyldigDekningsGrad = dekningsgrad === 100 || dekningsgrad === 80;

  return erForeldrepenger && gyldigDekningsGrad;
};

interface OwnProps {
  saksnummer: number;
  fagsakYtelseType: KodeverkMedNavn;
  fagsakStatus: KodeverkMedNavn;
  renderBehandlingMeny: () => ReactNode;
  renderBehandlingVelger: () => ReactNode;
  dekningsgrad?: number;
}

/**
 * FagsakProfile
 *
 * Presentasjonskomponent. Viser fagsakinformasjon og knapper for å endre status eller lukke sak.
 */
export const FagsakProfile: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  saksnummer,
  fagsakYtelseType,
  fagsakStatus,
  renderBehandlingMeny,
  renderBehandlingVelger,
  dekningsgrad,
  intl,
}) => (
  <>
    <FlexContainer>
      <FlexRow spaceBetween alignItemsToBaseline>
        <FlexColumn>
          <FlexRow wrap>
            <FlexColumn>
              <Systemtittel>
                {fagsakYtelseType.navn}
              </Systemtittel>
            </FlexColumn>
            {visSakDekningsgrad(fagsakYtelseType.kode, dekningsgrad) && (
            <FlexColumn>
              <Tooltip content={intl.formatMessage({ id: 'FagsakProfile.Dekningsgrad' }, { dekningsgrad })} alignBottom>
                <EtikettInfo>
                  {`${dekningsgrad}%`}
                </EtikettInfo>
              </Tooltip>
            </FlexColumn>
            )}
          </FlexRow>
        </FlexColumn>
        <FlexColumn>
          {renderBehandlingMeny()}
        </FlexColumn>
      </FlexRow>
      <VerticalSpacer eightPx />
      <FlexRow>
        <FlexColumn>
          <Normaltekst>
            {`${saksnummer} - ${fagsakStatus.navn}`}
          </Normaltekst>
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
    {renderBehandlingVelger()}
  </>
);

export default injectIntl(FagsakProfile);
