import React from 'react';
import PropTypes from 'prop-types';
import historikkinnslagDelPropType from 'behandling/proptypes/historikkinnslagDelPropType';
import { Element } from 'nav-frontend-typografi';
import styles from './historikkMalType.less';
import BubbleText from './bubbleText';
import { findHendelseText } from './historikkUtils';

const HistorikkMalType1 = ({
  historikkinnslagDeler, dokumentLinks, saksNr,
}) => (
  <div>
    {historikkinnslagDeler[0] && historikkinnslagDeler[0].hendelse
      && <Element className="snakkeboble-panel__tekst">{findHendelseText(historikkinnslagDeler[0].hendelse)}</Element>
    }

    {historikkinnslagDeler[0].begrunnelse && (
      <BubbleText
        bodyText={historikkinnslagDeler[0].begrunnelse.navn}
        cutOffLength={70}
        className="snakkeboble-panel__tekst"
      />
    )}
    {historikkinnslagDeler[0].begrunnelseFritekst
    && <BubbleText bodyText={historikkinnslagDeler[0].begrunnelseFritekst} className="snakkeboble-panel__tekst" />}
    <div>
      {dokumentLinks && dokumentLinks.map(dokumentLink => (
        <a
          key={`${dokumentLink.tag}@${dokumentLink.url}`}
          className={styles.documentLink}
          href={`/fpsak/api/dokument/hent-dokument?saksnummer=${saksNr}&journalpostId=${dokumentLink.journalpostId}&dokumentId=${dokumentLink.dokumentId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
            #
          {dokumentLink.tag}
        </a>
      ))}
    </div>
  </div>
);

HistorikkMalType1.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  dokumentLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  saksNr: PropTypes.number.isRequired,
};

export default HistorikkMalType1;

/*
 https://confluence.adeo.no/display/MODNAV/OMR-13+SF4+Sakshistorikk+-+UX+og+grafisk+design

 Fem design patterns:

 +----------------------------+
 | Type 1                     |
 | BEH_VENT                   |
 | BEH_GJEN                   |
 | KØET_BEH_GJEN                   |
 | BEH_STARTET                |
 | VEDLEGG_MOTTATT            |
 | BREV_SENT                  |
 | BREV_BESTILT               |
 | REGISTRER_PAPIRSØK         |
 | MANGELFULL_SØKNAD          |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <hendelse>
 <begrunnelsestekst>
 <dokumentLinker>

 +----------------------------+
 | Type 2                     |
 | FORSLAG_VEDTAK             |
 | FORSLAG_VEDTAK_UTEN_TOTRINN|
 | VEDTAK_FATTET              |
 | OVERSTYRT (hvis beslutter) |
 | REGISTRER_OM_VERGE         |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <hendelse>: <resultat>
 <skjermlinke>


 +----------------------------+
 | Type 3                     |
 | SAK_RETUR                  |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <hendelse>
 <begrunnelsestekst>
 <dokumentLinker>


 +----------------------------+
 | Type 4                     |
 | AVBRUTT_BEH                |
 | OVERSTYRT (hvis saksbeh.)  |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <hendelse>
 <årsak>
 <begrunnelsestekst>


 +----------------------------+
 | Type 5                     |
 | FAKTA_ENDRET               |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <skjermlinke>
 <feltnavn> er endret <fra-verdi> til <til-verdi>
 <radiogruppe> er satt til <verdi>
 <begrunnelsestekst>
 <dokumentLinker>

 +----------------------------+
 | Type 6                     |
 | NY_INFO_FRA_TPS            |
 +----------------------------+
 Ikke definert

 +----------------------------+
 | Type 7                     |
 | OVERSTYRT                  |
 +----------------------------+
 <tidspunkt> // <rolle> <id>
 <skjermlinke>
 Overstyrt <vurdering/beregning>: <Utfallet/beløpet> er endret fra <fra-verdi> til <til-verdi>
 <begrunnelsestekst>

+----------------------------+
 | Type 8                     |
 | ???                        |
 +----------------------------+
 Ikke definiert

 */
