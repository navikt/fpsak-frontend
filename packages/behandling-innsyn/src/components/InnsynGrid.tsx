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

import InnsynProsess from './InnsynProsess';
import { Innsyn } from '../types/innsynTsType';
import innsynPropType from '../propTypes/innsynPropType';

type OwnProps = Readonly<{
  fagsak: FagsakInfo;
  behandling: Behandling;
  aksjonspunkter: [Aksjonspunkt];
  vilkar: [Vilkar];
  innsyn: Innsyn;
  kodeverk: {[key: string]: [Kodeverk]};
  alleDokumenter: [Dokument];
  navAnsatt: NavAnsatt;
  valgtProsessSteg: string;
  oppdaterProsessStegIUrl: (punktnavn: string) => void;
  oppdaterBehandlingVersjon: (versjon: number) => void;
  settPaVent: (SettPaVentParams) => Promise<any>;
  hentBehandling: ({ behandlingId: number }) => Promise<any>;
  opneSokeside: () => void;
}>;

const InnsynGrid: FunctionComponent<OwnProps> = ({
  fagsak,
  behandling,
  aksjonspunkter,
  vilkar,
  innsyn,
  kodeverk,
  alleDokumenter,
  navAnsatt,
  valgtProsessSteg,
  oppdaterProsessStegIUrl,
  oppdaterBehandlingVersjon,
  settPaVent,
  hentBehandling,
  opneSokeside,
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
        <InnsynProsess
          fagsak={fagsak}
          behandling={behandling}
          aksjonspunkter={aksjonspunkter}
          vilkar={vilkar}
          innsyn={innsyn}
          kodeverk={kodeverk}
          alleDokumenter={alleDokumenter}
          navAnsatt={navAnsatt}
          valgtProsessSteg={valgtProsessSteg}
          oppdaterProsessStegIUrl={oppdaterProsessStegIUrl}
          oppdaterBehandlingVersjon={oppdaterBehandlingVersjon}
          opneSokeside={opneSokeside}
        />
      </>
    )}
    <VerticalSpacer sixteenPx />
    <PersonIndex medPanel person={fagsak.fagsakPerson} />
  </>
);

InnsynGrid.propTypes = {
  fagsak: fagsakInfoPropType.isRequired,
  behandling: behandlingPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  innsyn: innsynPropType.isRequired,
  kodeverk: PropTypes.shape({}).isRequired,
  alleDokumenter: PropTypes.arrayOf(PropTypes.shape({
    journalpostId: PropTypes.string.isRequired,
    dokumentId: PropTypes.string.isRequired,
    tittel: PropTypes.string,
    tidspunkt: PropTypes.string,
    kommunikasjonsretning: PropTypes.string.isRequired,
  })).isRequired,
  navAnsatt: navAnsattPropType.isRequired,
  valgtProsessSteg: PropTypes.string.isRequired,
  oppdaterProsessStegIUrl: PropTypes.func.isRequired,
  oppdaterBehandlingVersjon: PropTypes.func.isRequired,
  settPaVent: PropTypes.func.isRequired,
  hentBehandling: PropTypes.func.isRequired,
  opneSokeside: PropTypes.func.isRequired,
};

export default InnsynGrid;
