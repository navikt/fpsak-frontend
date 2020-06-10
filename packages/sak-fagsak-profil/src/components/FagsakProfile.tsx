import React, { FunctionComponent, ReactNode } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { EtikettInfo } from 'nav-frontend-etiketter';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer, Tooltip,
} from '@fpsak-frontend/shared-components';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Kodeverk, KodeverkMedNavn } from '@fpsak-frontend/types';

const visSakDekningsgrad = (saksKode, dekningsgrad) => {
  const erForeldrepenger = saksKode === fagsakYtelseType.FORELDREPENGER;
  const gyldigDekningsGrad = dekningsgrad === 100 || dekningsgrad === 80;

  return erForeldrepenger && gyldigDekningsGrad;
};

interface OwnProps {
  saksnummer: number;
  sakstype: Kodeverk;
  fagsakStatus: Kodeverk;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
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
  sakstype,
  fagsakStatus,
  alleKodeverk,
  renderBehandlingMeny,
  renderBehandlingVelger,
  dekningsgrad,
  intl,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <>
      <FlexContainer>
        <FlexRow spaceBetween alignItemsToBaseline>
          <FlexColumn>
            <FlexRow wrap>
              <FlexColumn>
                <Systemtittel>
                  {getKodeverknavn(sakstype)}
                </Systemtittel>
              </FlexColumn>
              {visSakDekningsgrad(sakstype.kode, dekningsgrad) && (
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
              {`${saksnummer} - ${getKodeverknavn(fagsakStatus)}`}
            </Normaltekst>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      {renderBehandlingVelger()}
    </>
  );
};

export default injectIntl(FagsakProfile);
