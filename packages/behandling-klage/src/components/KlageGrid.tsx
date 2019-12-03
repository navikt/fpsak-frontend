import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';

import { FormattedMessage } from 'react-intl';
import { aksjonspunktPropType, navAnsattPropType } from '@fpsak-frontend/prop-types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { PersonIndex } from '@fpsak-frontend/person-info';
import {
  Kodeverk, Dokument, NavAnsatt, FagsakInfo, Behandling, Aksjonspunkt, Vilkar, fagsakInfoPropType, behandlingPropType, BehandlingPaVent,
} from '@fpsak-frontend/behandling-felles';

import KlageProsess from './KlageProsess';

type OwnProps = Readonly<{
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: [Aksjonspunkt];
  vilkar: [Vilkar];
  kodeverk: {[key: string]: [Kodeverk]};
  navAnsatt: NavAnsatt;
  valgtProsessSteg: string;
  oppdaterProsessStegIUrl: (punktnavn: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }) => Promise<any>;
  opneSokeside: () => void;
}>;

const KlageGrid: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  klageVurdering,
  kodeverk,
  navAnsatt,
  valgtProsessSteg,
  oppdaterProsessStegIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
  alleBehandlinger,
}) => (
  <>
    {behandling.behandlingHenlagt && (
      <Undertittel>
        <FormattedMessage id="InnsynGrid.Henlagt" />
      </Undertittel>
    )}
    {!behandling.behandlingHenlagt && (
      <>
        <BehandlingPaVent
          behandling={behandling}
          aksjonspunkter={aksjonspunkter}
          kodeverk={kodeverk}
          settPaVent={settPaVent}
          hentBehandling={hentBehandling}
        />
        <KlageProsess
          fagsak={fagsak}
          behandling={behandling}
          aksjonspunkter={aksjonspunkter}
          vilkar={vilkar}
          klageVurdering={klageVurdering}
          kodeverk={kodeverk}
          navAnsatt={navAnsatt}
          valgtProsessSteg={valgtProsessSteg}
          oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
          oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
          opneSokeside={opneSokeside}
          alleBehandlinger={alleBehandlinger}
        />
      </>
    )}
    <VerticalSpacer sixteenPx />
    <PersonIndex medPanel person={fagsak.fagsakPerson} />
  </>
);

KlageGrid.propTypes = {
  fagsak: fagsakInfoPropType.isRequired,
  behandling: behandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  kodeverk: PropTypes.shape({}).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  valgtProsessSteg: PropTypes.string.isRequired,
  oppdaterProsessStegIUrl: PropTypes.func.isRequired,
  oppdaterBehandlingVersjon: PropTypes.func.isRequired,
  settPaVent: PropTypes.func.isRequired,
  hentBehandling: PropTypes.func.isRequired,
  opneSokeside: PropTypes.func.isRequired,
};

export default KlageGrid;
