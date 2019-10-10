import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { createLocationForHistorikkItems } from '@fpsak-frontend/fp-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import historikkEndretFeltTypeCodes from '../../kodeverk/historikkEndretFeltTypeCodes';
import BubbleText from './felles/bubbleText';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';

const scrollUp = () => {
  if (window.innerWidth < 13010) {
    window.scroll(0, 0);
  }
  return false;
};

const finnFomOpplysning = (opplysninger) => {
  const found = opplysninger.find((o) => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_FOM.kode);
  return found.tilVerdi;
};

const finnTomOpplysning = (opplysninger) => {
  const found = opplysninger.find((o) => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_TOM.kode);
  return found.tilVerdi;
};

const buildEndretFeltText = (endredeFelter) => {
  const årsakFelt = endredeFelter.filter((felt) => felt.endretFeltNavn.kode === historikkEndretFeltTypeCodes.FAKTA_OM_FEILUTBETALING_AARSAK.kode)[0];
  const underÅrsakFelt = endredeFelter.filter((felt) => felt.endretFeltNavn.kode === historikkEndretFeltTypeCodes.FAKTA_OM_FEILUTBETALING_UNDERAARSAK.kode)[0];
  const underÅrsakFraVerdi = underÅrsakFelt ? underÅrsakFelt.fraVerdi : null;
  const underÅrsakTilVerdi = underÅrsakFelt ? underÅrsakFelt.tilVerdi : null;
  const endret = endredeFelter.filter((felt) => felt.fraVerdi !== null).length > 0;

  if (endret) {
    const årsakFraVerdi = årsakFelt.fraVerdi ? årsakFelt.fraVerdi : årsakFelt.tilVerdi;
    const fraVerdi = `${årsakFraVerdi} ${underÅrsakFraVerdi ? `(${underÅrsakFraVerdi})` : ''}`;
    const tilVerdi = `${årsakFelt.tilVerdi} ${underÅrsakTilVerdi ? `(${underÅrsakTilVerdi})` : ''}`;
    return <FormattedHTMLMessage id="Historikk.Template.Feilutbetaling.endretFelt" values={{ fraVerdi, tilVerdi }} />;
  }
  const feltVerdi = `${årsakFelt.tilVerdi} ${underÅrsakTilVerdi ? `(${underÅrsakTilVerdi})` : ''}`;
  return <FormattedHTMLMessage id="Historikk.Template.Feilutbetaling.sattFelt" values={{ feltVerdi }} />;
};

const HistorikkMalTypeFeilutbetaling = ({
  historikkinnslagDeler,
  behandlingLocation,
  getKodeverknavn,
}) => (
  <div>
    <Element>
      <NavLink
        to={createLocationForHistorikkItems(behandlingLocation, historikkinnslagDeler[0].skjermlenke.kode)}
        onClick={scrollUp}
      >
        {getKodeverknavn(historikkinnslagDeler[0].skjermlenke)}
      </NavLink>
    </Element>
    {historikkinnslagDeler.map((historikkinnslagDel, index) => (historikkinnslagDel.endredeFelter ? (
      <div key={`historikkinnslagDel${index + 1}`}>
        <FormattedHTMLMessage
          id="Historikk.Template.Feilutbetaling.FaktaFeilutbetalingPeriode"
          values={{
            periodeFom: finnFomOpplysning(historikkinnslagDel.opplysninger),
            periodeTom: finnTomOpplysning(historikkinnslagDel.opplysninger),
          }}
        />
        <Normaltekst>
          { buildEndretFeltText(historikkinnslagDel.endredeFelter) }
        </Normaltekst>
        <VerticalSpacer eightPx />
      </div>
    ) : null))}
    {historikkinnslagDeler[0] && historikkinnslagDeler[0].begrunnelseFritekst && (
      <BubbleText
        bodyText={historikkinnslagDeler[0].begrunnelseFritekst}
        className="snakkeboble-panel__tekst"
      />
    )}
  </div>
);

HistorikkMalTypeFeilutbetaling.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectIntl(HistorikkMalTypeFeilutbetaling);
