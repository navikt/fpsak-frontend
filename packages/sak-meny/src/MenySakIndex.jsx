import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { navAnsattPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import BehandlingMenu from './components/BehandlingMenu';
import MenyKodeverk from './MenyKodeverk';
import MenyBehandlingData from './MenyBehandlingData';
import MenyRettigheter from './MenyRettigheter';
import messages from '../i18n/nb_NO';

const cache = createIntlCache();

const intl = createIntl({
  locale: 'nb-NO',
  messages,
}, cache);

const MenySakIndex = ({
  saksnummer,
  behandlingData,
  ytelseType,
  behandlendeEnheter,
  navAnsatt,
  kanTilbakekrevingOpprettes,
  erTilbakekrevingAktivert,
  uuidForSistLukkede,
  menyKodeverk,
  rettigheter,
  previewHenleggBehandling,
  resumeBehandling,
  shelveBehandling,
  nyBehandlendeEnhet,
  createNewBehandling,
  setBehandlingOnHold,
  openBehandlingForChanges,
  fjernVerge,
  opprettVerge,
  sjekkOmTilbakekrevingKanOpprettes,
  sjekkOmTilbakekrevingRevurderingKanOpprettes,
  push,
}) => (
  <RawIntlProvider value={intl}>
    <BehandlingMenu
      saksnummer={saksnummer}
      behandlingData={behandlingData}
      ytelseType={ytelseType}
      behandlendeEnheter={behandlendeEnheter}
      navAnsatt={navAnsatt}
      kanTilbakekrevingOpprettes={kanTilbakekrevingOpprettes}
      erTilbakekrevingAktivert={erTilbakekrevingAktivert}
      uuidForSistLukkede={uuidForSistLukkede}
      menyKodeverk={menyKodeverk}
      rettigheter={rettigheter}
      previewHenleggBehandling={previewHenleggBehandling}
      resumeBehandling={resumeBehandling}
      shelveBehandling={shelveBehandling}
      nyBehandlendeEnhet={nyBehandlendeEnhet}
      createNewBehandling={createNewBehandling}
      setBehandlingOnHold={setBehandlingOnHold}
      openBehandlingForChanges={openBehandlingForChanges}
      fjernVerge={fjernVerge}
      opprettVerge={opprettVerge}
      sjekkOmTilbakekrevingKanOpprettes={sjekkOmTilbakekrevingKanOpprettes}
      sjekkOmTilbakekrevingRevurderingKanOpprettes={sjekkOmTilbakekrevingRevurderingKanOpprettes}
      push={push}
    />
  </RawIntlProvider>
);

MenySakIndex.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  behandlingData: PropTypes.instanceOf(MenyBehandlingData).isRequired,
  ytelseType: kodeverkObjektPropType.isRequired,
  behandlendeEnheter: PropTypes.arrayOf(PropTypes.shape({
    enhetId: PropTypes.string.isRequired,
    enhetNavn: PropTypes.string.isRequired,
  })),
  navAnsatt: navAnsattPropType.isRequired,
  kanTilbakekrevingOpprettes: PropTypes.shape({
    kanBehandlingOpprettes: PropTypes.bool.isRequired,
    kanRevurderingOpprettes: PropTypes.bool.isRequired,
  }),
  erTilbakekrevingAktivert: PropTypes.bool.isRequired,
  uuidForSistLukkede: PropTypes.string,
  menyKodeverk: PropTypes.instanceOf(MenyKodeverk),
  rettigheter: PropTypes.instanceOf(MenyRettigheter),
  previewHenleggBehandling: PropTypes.func.isRequired,
  resumeBehandling: PropTypes.func.isRequired,
  shelveBehandling: PropTypes.func.isRequired,
  nyBehandlendeEnhet: PropTypes.func.isRequired,
  createNewBehandling: PropTypes.func.isRequired,
  setBehandlingOnHold: PropTypes.func.isRequired,
  openBehandlingForChanges: PropTypes.func.isRequired,
  sjekkOmTilbakekrevingKanOpprettes: PropTypes.func.isRequired,
  sjekkOmTilbakekrevingRevurderingKanOpprettes: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  fjernVerge: PropTypes.func,
  opprettVerge: PropTypes.func,
};

MenySakIndex.defaultProps = {
  behandlendeEnheter: null,
  fjernVerge: undefined,
  opprettVerge: undefined,
  kanTilbakekrevingOpprettes: undefined,
};

export default MenySakIndex;
