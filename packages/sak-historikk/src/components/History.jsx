import React from 'react';
import PropTypes from 'prop-types';

import historikkinnslagPropType from '../propTypes/historikkinnslagPropType';
import historikkinnslagType from '../kodeverk/historikkinnslagType';
import Snakkeboble from './maler/felles/snakkeboble';
import HistorikkMalType1 from './maler/historikkMalType1';
import HistorikkMalType2 from './maler/historikkMalType2';
import HistorikkMalType3 from './maler/historikkMalType3';
import HistorikkMalType4 from './maler/historikkMalType4';
import HistorikkMalType5 from './maler/historikkMalType5';
import HistorikkMalType6 from './maler/HistorikkMalType6';
import HistorikkMalType7 from './maler/HistorikkMalType7';
import HistorikkMalType8 from './maler/HistorikkMalType8';
import HistorikkMalType9 from './maler/HistorikkMalType9';
import HistorikkMalType10 from './maler/HistorikkMalType10';
import HistorikkMalTypeFeilutbetaling from './maler/HistorikkMalTypeFeilutbetaling';
import HistorikkMalTypeTilbakekreving from './maler/HistorikkMalTypeTilbakekreving';
import HistorikkMalTypeForeldelse from './maler/HistorikkMalTypeForeldelse';
import PlaceholderHistorikkMal from './maler/placeholderHistorikkMal';

const velgHistorikkMal = (histType) => { // NOSONAR
  switch (histType.kode) { // NOSONAR
    case historikkinnslagType.BEH_GJEN:
    case historikkinnslagType.KOET_BEH_GJEN:
    case historikkinnslagType.BEH_MAN_GJEN:
    case historikkinnslagType.BEH_STARTET:
    case historikkinnslagType.BEH_STARTET_PAA_NYTT:
    case historikkinnslagType.VEDLEGG_MOTTATT:
    case historikkinnslagType.BREV_SENT:
    case historikkinnslagType.BREV_BESTILT:
    case historikkinnslagType.REVURD_OPPR:
    case historikkinnslagType.REGISTRER_PAPIRSOK:
    case historikkinnslagType.MANGELFULL_SOKNAD:
    case historikkinnslagType.INNSYN_OPPR:
    case historikkinnslagType.VRS_REV_IKKE_SNDT:
    case historikkinnslagType.NYE_REGOPPLYSNINGER:
    case historikkinnslagType.BEH_AVBRUTT_VUR:
    case historikkinnslagType.BEH_OPPDATERT_NYE_OPPL:
    case historikkinnslagType.SPOLT_TILBAKE:
    case historikkinnslagType.TILBAKEKREVING_OPPR:
    case historikkinnslagType.MIGRERT_FRA_INFOTRYGD:
    case historikkinnslagType.MIGRERT_FRA_INFOTRYGD_FJERNET:
      return HistorikkMalType1;
    case historikkinnslagType.FORSLAG_VEDTAK:
    case historikkinnslagType.FORSLAG_VEDTAK_UTEN_TOTRINN:
    case historikkinnslagType.VEDTAK_FATTET:
    case historikkinnslagType.UENDRET_UTFALL:
    case historikkinnslagType.REGISTRER_OM_VERGE:
      return HistorikkMalType2;
    case historikkinnslagType.SAK_RETUR:
      return HistorikkMalType3;
    case historikkinnslagType.AVBRUTT_BEH:
    case historikkinnslagType.BEH_KØET:
    case historikkinnslagType.BEH_VENT:
    case historikkinnslagType.IVERKSETTELSE_VENT:
    case historikkinnslagType.FJERNET_VERGE:
      return HistorikkMalType4;
    case historikkinnslagType.SAK_GODKJENT:
    case historikkinnslagType.FAKTA_ENDRET:
    case historikkinnslagType.KLAGE_BEH_NK:
    case historikkinnslagType.KLAGE_BEH_NFP:
    case historikkinnslagType.BYTT_ENHET:
    case historikkinnslagType.UTTAK:
    case historikkinnslagType.TERMINBEKREFTELSE_UGYLDIG:
    case historikkinnslagType.ANKE_BEH:
      return HistorikkMalType5;
    case historikkinnslagType.NY_INFO_FRA_TPS:
    case historikkinnslagType.NY_GRUNNLAG_MOTTATT:
      return HistorikkMalType6;
    case historikkinnslagType.OVERSTYRT:
      return HistorikkMalType7;
    case historikkinnslagType.OPPTJENING:
      return HistorikkMalType8;
    case historikkinnslagType.OVST_UTTAK_SPLITT:
    case historikkinnslagType.FASTSATT_UTTAK_SPLITT:
    case historikkinnslagType.TILBAKEKR_VIDEREBEHANDLING:
      return HistorikkMalType9;
    case historikkinnslagType.OVST_UTTAK:
    case historikkinnslagType.FASTSATT_UTTAK:
      return HistorikkMalType10;
    case historikkinnslagType.FAKTA_OM_FEILUTBETALING:
      return HistorikkMalTypeFeilutbetaling;
    case historikkinnslagType.FORELDELSE:
      return HistorikkMalTypeForeldelse;
    case historikkinnslagType.TILBAKEKREVING:
      return HistorikkMalTypeTilbakekreving;
    default:
      return PlaceholderHistorikkMal;
  }
};

/**
 * History
 *
 * Historikken for en behandling
 */
const History = ({
  historieInnslag,
  saksNr,
  getBehandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
}) => {
  const HistorikkMal = velgHistorikkMal(historieInnslag.type);
  const aktorIsVL = historieInnslag.aktoer.kode === 'VL';
  const aktorIsSOKER = historieInnslag.aktoer.kode === 'SOKER';
  const aktorIsArbeidsgiver = historieInnslag.aktoer.kode === 'ARBEIDSGIVER';
  return (
    <Snakkeboble
      historikkinnslagDeler={historieInnslag.historikkinnslagDeler}
      rolle={historieInnslag.aktoer.kode}
      rolleNavn={getKodeverknavn(historieInnslag.aktoer)}
      dato={historieInnslag.opprettetTidspunkt}
      kjoennKode={historieInnslag.kjoenn ? historieInnslag.kjoenn.kode : ''}
      opprettetAv={(aktorIsSOKER || aktorIsArbeidsgiver || aktorIsVL) ? null : historieInnslag.opprettetAv}
      histType={historieInnslag.type}
      dokumentLinks={historieInnslag.dokumentLinks}
    >
      <HistorikkMal
        historikkinnslagDeler={historieInnslag.historikkinnslagDeler}
        dokumentLinks={historieInnslag.dokumentLinks}
        behandlingLocation={getBehandlingLocation(historieInnslag.behandlingId)}
        originType={historieInnslag.type}
        saksNr={saksNr}
        getKodeverknavn={getKodeverknavn}
        erTilbakekreving={historieInnslag.erTilbakekreving}
        createLocationForSkjermlenke={createLocationForSkjermlenke}
      />
    </Snakkeboble>
  );
};

History.propTypes = {
  historieInnslag: historikkinnslagPropType.isRequired,
  saksNr: PropTypes.number,
  getBehandlingLocation: PropTypes.func.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  createLocationForSkjermlenke: PropTypes.func.isRequired,
};

History.defaultProps = {
  saksNr: 0,
};

export default History;
