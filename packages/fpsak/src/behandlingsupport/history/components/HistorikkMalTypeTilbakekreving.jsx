import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import historikkOpplysningTypeCodes from '@fpsak-frontend/kodeverk/src/historikkOpplysningTypeCodes';
import historikkEndretFeltType from '@fpsak-frontend/kodeverk/src/historikkEndretFeltType';
import { historikkinnslagDelPropType } from '@fpsak-frontend/prop-types';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleKodeverk } from 'kodeverk/duck';
import { createLocationForHistorikkItems } from 'kodeverk/skjermlenkeCodes';

const scrollUp = () => {
  if (window.innerWidth < 1305) {
    window.scroll(0, 0);
  }
  return false;
};

export const HistorikkMalTypeTilbakekreving = ({
  historikkinnslagDeler,
  behandlingLocation,
  getKodeverknavn,
}) => {
  if (historikkinnslagDeler.length === 0) {
    return null;
  }
  return (
    <>
      <Element>
        <NavLink
          to={createLocationForHistorikkItems(behandlingLocation, historikkinnslagDeler[0].skjermlenke.kode)}
          onClick={scrollUp}
        >
          {getKodeverknavn(historikkinnslagDeler[0].skjermlenke)}
        </NavLink>
      </Element>
      {historikkinnslagDeler.map((historikkinnslagDel) => {
        const { opplysninger, endredeFelter, begrunnelseFritekst } = historikkinnslagDel;
        const periodeFom = opplysninger.find((o) => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_FOM.kode).tilVerdi;
        const periodeTom = opplysninger.find((o) => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_TOM.kode).tilVerdi;
        const begrunnelse = opplysninger
          .find((o) => o.opplysningType.kode === historikkOpplysningTypeCodes.TILBAKEKREVING_OPPFYLT_BEGRUNNELSE.kode).tilVerdi;

        return (
          <div key={periodeFom + periodeTom}>
            <Normaltekst>
              <FormattedHTMLMessage id="Historikk.Template.Tilbakekreving.VurderingAvPerioden" values={{ periodeFom, periodeTom }} />
            </Normaltekst>
            <VerticalSpacer eightPx />
            {endredeFelter && endredeFelter.map((felt, index) => {
              const { endretFeltNavn, fraVerdi, tilVerdi } = felt;

              const visBelopTilbakekreves = historikkEndretFeltType.BELOEP_TILBAKEKREVES === endretFeltNavn.kode;
              const visProsentverdi = historikkEndretFeltType.ANDEL_TILBAKEKREVES === endretFeltNavn.kode;
              const visIleggRenter = historikkEndretFeltType.ILEGG_RENTER === endretFeltNavn.kode;
              if ((visBelopTilbakekreves || visProsentverdi || visIleggRenter) && !tilVerdi) {
                return null;
              }

              const visBegrunnelse = historikkEndretFeltType.ER_VILKARENE_TILBAKEKREVING_OPPFYLT === endretFeltNavn.kode;
              const formatertFraVerdi = visProsentverdi && fraVerdi ? `${fraVerdi}%` : fraVerdi;
              const formatertTilVerdi = visProsentverdi && tilVerdi ? `${tilVerdi}%` : tilVerdi;
              const visAktsomhetBegrunnelse = begrunnelseFritekst && index === endredeFelter.length - 1;

              return (
                <React.Fragment key={endretFeltNavn.kode}>
                  <Normaltekst>
                    <FormattedHTMLMessage
                      id={felt.fraVerdi ? 'Historikk.Template.Tilbakekreving.ChangedFromTo' : 'Historikk.Template.Tilbakekreving.FieldSetTo'}
                      values={{ navn: getKodeverknavn(endretFeltNavn), fraVerdi: formatertFraVerdi, tilVerdi: formatertTilVerdi }}
                    />
                  </Normaltekst>
                  <VerticalSpacer eightPx />
                  {visBegrunnelse && begrunnelse}
                  {visBegrunnelse && <VerticalSpacer eightPx />}
                  {visAktsomhetBegrunnelse && begrunnelseFritekst}
                  {visAktsomhetBegrunnelse && <VerticalSpacer eightPx />}
                </React.Fragment>
              );
            })}
            <Normaltekst>
              {(!endredeFelter && begrunnelseFritekst) && begrunnelseFritekst}
            </Normaltekst>
            <VerticalSpacer eightPx />
          </div>
        );
      })}
    </>
  );
};

HistorikkMalTypeTilbakekreving.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectKodeverk(getAlleKodeverk)(HistorikkMalTypeTilbakekreving);
