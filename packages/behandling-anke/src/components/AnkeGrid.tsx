import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';

import { FormattedMessage } from 'react-intl';
import { aksjonspunktPropType, navAnsattPropType } from '@fpsak-frontend/prop-types';
import { VerticalSpacer, FadingPanel } from '@fpsak-frontend/shared-components';
import { PersonIndex } from '@fpsak-frontend/person-info';
import {
  Kodeverk, NavAnsatt, FagsakInfo, Behandling, Aksjonspunkt, Vilkar, fagsakInfoPropType, behandlingPropType, BehandlingPaVent,
} from '@fpsak-frontend/behandling-felles';

import AnkeProsess from './AnkeProsess';
import { AnkeVurdering } from '../types/ankeVurderingTsType';
import ankeVurderingPropType from '../propTypes/ankeVurderingPropType';

interface OwnProps {
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: [Aksjonspunkt];
  vilkar: [Vilkar];
  ankeVurdering: AnkeVurdering;
  navAnsatt: NavAnsatt;
  kodeverk: {[key: string]: [Kodeverk]};
  valgtProsessSteg: string;
  oppdaterProsessStegIUrl: (punktnavn?: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }) => Promise<any>;
  opneSokeside: () => void;
  alleBehandlinger: [{}];
}

const AnkeGrid: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  ankeVurdering,
  navAnsatt,
  kodeverk,
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
      <FadingPanel>
        <Undertittel>
          <FormattedMessage id="InnsynGrid.Henlagt" />
        </Undertittel>
      </FadingPanel>
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
        <AnkeProsess
          fagsak={fagsak}
          behandling={behandling}
          aksjonspunkter={aksjonspunkter}
          vilkar={vilkar}
          ankeVurdering={ankeVurdering}
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

AnkeGrid.propTypes = {
  fagsak: fagsakInfoPropType.isRequired,
  behandling: behandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  kodeverk: PropTypes.shape({}).isRequired,
  valgtProsessSteg: PropTypes.string.isRequired,
  oppdaterProsessStegIUrl: PropTypes.func.isRequired,
  oppdaterBehandlingVersjon: PropTypes.func.isRequired,
  settPaVent: PropTypes.func.isRequired,
  hentBehandling: PropTypes.func.isRequired,
  opneSokeside: PropTypes.func.isRequired,
  ankeVurdering: ankeVurderingPropType,
  alleBehandlinger: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default AnkeGrid;
