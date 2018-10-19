import React from 'react';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import historikkinnslagDelPropType from 'behandling/proptypes/historikkinnslagDelPropType';
import { NavLink } from 'react-router-dom';
import { Element } from 'nav-frontend-typografi';
import { createLocationForHistorikkItems } from 'app/paths';
import { findHendelseText, findResultatText } from './historikkUtils';

const scrollUp = () => {
  if (window.innerWidth < 1305) {
    window.scroll(0, 0);
  }
  return false;
};

const HistorikkMalType2 = ({ historikkinnslagDeler, behandlingLocation, intl }) => (
  <div>
    {historikkinnslagDeler[0].skjermlenke
    && (
    <Element className="snakkeboble-panel__tekst">
      <NavLink
        to={createLocationForHistorikkItems(behandlingLocation, historikkinnslagDeler[0].skjermlenke.kode)}
        onClick={scrollUp}
      >
        {historikkinnslagDeler[0].skjermlenke.navn}
      </NavLink>
    </Element>
    )
    }
    {historikkinnslagDeler[0].resultat && historikkinnslagDeler[0].hendelse
      && (
      <Element className="snakkeboble-panel__tekst">
        {`${findHendelseText(historikkinnslagDeler[0].hendelse)}: ${findResultatText(historikkinnslagDeler[0].resultat, intl)}`}
      </Element>
      )
    }
    {!historikkinnslagDeler[0].resultat && historikkinnslagDeler[0].hendelse
      && <Element className="snakkeboble-panel__tekst">{findHendelseText(historikkinnslagDeler[0].hendelse)}</Element>
    }
  </div>
);

HistorikkMalType2.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(HistorikkMalType2);

/*

URL:
 http://[HOSTNAME]<:PORT>/#[/fagsak/FAGSAK_ID]</behandling/[BEHANDLING_ID]></punkt/[PUNKT_NAVN]></fakta/[FAKTA_NAVN]></SIDOPANEL_NAVN>

 PUNKT_NAVN: default | beregningsresultat | vedtak | vilkår-type navn uten norske tegn
 FAKTA_NAVN: default | tilleggsopplysninger | vilkår-type navn uten norske tegn ("-" er separator hvis flere)
 SIDOPANEL_NAVN: historikk, meldinger, etc

 */
