import React from 'react';
import PropTypes from 'prop-types';

import { pathToBehandling } from 'app/paths';
import historikkinnslagPropType from 'behandling/proptypes/historikkinnslagPropType';
import historikkinnslagType from 'kodeverk/historikkinnslagType';
import SnakkebobleMedRoller from './snakkebobleMedRoller';
import HistorikkMalType1 from './historikkMalType1';
import HistorikkMalType2 from './historikkMalType2';
import HistorikkMalType3 from './historikkMalType3';
import HistorikkMalType4 from './historikkMalType4';
import HistorikkMalType5 from './historikkMalType5';
import HistorikkMalType6 from './HistorikkMalType6';
import HistorikkMalType7 from './HistorikkMalType7';
import HistorikkMalType8 from './HistorikkMalType8';
import HistorikkMalType9 from './HistorikkMalType9';
import HistorikkMalType10 from './HistorikkMalType10';
import PlaceholderHistorikkMal from './placeholderHistorikkMal';

import styles from './history.less';

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
      return HistorikkMalType4;
    case historikkinnslagType.FAKTA_ENDRET:
    case historikkinnslagType.KLAGE_BEH_NK:
    case historikkinnslagType.KLAGE_BEH_NFP:
    case historikkinnslagType.BYTT_ENHET:
    case historikkinnslagType.UTTAK:
      return HistorikkMalType5;
    case historikkinnslagType.NY_INFO_FRA_TPS:
      return HistorikkMalType6;
    case historikkinnslagType.OVERSTYRT:
      return HistorikkMalType7;
    case historikkinnslagType.OPPTJENING:
      return HistorikkMalType8;
    case historikkinnslagType.OVST_UTTAK_SPLITT:
    case historikkinnslagType.FASTSATT_UTTAK_SPLITT:
      return HistorikkMalType9;
    case historikkinnslagType.OVST_UTTAK:
    case historikkinnslagType.FASTSATT_UTTAK:
      return HistorikkMalType10;
    default:
      return PlaceholderHistorikkMal;
  }
};

/**
 * History
 *
 * Historikken for en behandling -tar emot en liste av historikkobjekt og sprider ut de i historikkbobler
 */
const History = ({
  historyList,
  selectedBehandlingId,
  saksNr,
  location,
}) => (
  <div className={styles.historyContainer}>
    {historyList.map((item, index) => {
      const HistorikkMal = velgHistorikkMal(item.type);
      const aktorIsVL = item.aktoer.kode === 'VL';
      const aktorIsSOKER = item.aktoer.kode === 'SOKER';
      const aktorIsArbeidsgiver = item.aktoer.kode === 'ARBEIDSGIVER';
      return (
        <SnakkebobleMedRoller
          key={`${item.opprettetTidspunkt}${index}`} // eslint-disable-line react/no-array-index-key
          historikkinnslagDeler={item.historikkinnslagDeler}
          rolle={item.aktoer.kode}
          rolleNavn={item.aktoer.navn}
          dato={item.opprettetTidspunkt}
          kjoennKode={item.kjoenn ? item.kjoenn.kode : ''}
          opprettetAv={(aktorIsSOKER || aktorIsArbeidsgiver || aktorIsVL) ? null : item.opprettetAv}
          histType={item.type}
          dokumentLinks={item.dokumentLinks}
          selectedBehandlingId={selectedBehandlingId}
        >
          <HistorikkMal
            historikkinnslagDeler={item.historikkinnslagDeler}
            dokumentLinks={item.dokumentLinks}
            behandlingLocation={{
              ...location,
              pathname: pathToBehandling(saksNr, item.behandlingId),
            }}
            originType={item.type}
            saksNr={saksNr}
          />
        </SnakkebobleMedRoller>);
    })
    }
  </div>
);

History.propTypes = {
  historyList: PropTypes.arrayOf(historikkinnslagPropType).isRequired,
  selectedBehandlingId: PropTypes.string,
  saksNr: PropTypes.number,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

History.defaultProps = {
  selectedBehandlingId: '',
  saksNr: 0,
};

export default History;
