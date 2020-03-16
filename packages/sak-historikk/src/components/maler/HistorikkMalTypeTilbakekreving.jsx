import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import historikkEndretFeltType from '../../kodeverk/historikkEndretFeltType';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';

const scrollUp = () => {
  window.scroll(0, 0);
};

export const HistorikkMalTypeTilbakekreving = ({
  historikkinnslagDeler,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
}) => {
  if (historikkinnslagDeler.length === 0) {
    return null;
  }
  return (
    <>
      <Element>
        <NavLink
          to={createLocationForSkjermlenke(behandlingLocation, historikkinnslagDeler[0].skjermlenke.kode)}
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
        const sarligGrunnerBegrunnelseFelt = opplysninger
          .find((o) => o.opplysningType.kode === historikkOpplysningTypeCodes.SÆRLIG_GRUNNER_BEGRUNNELSE.kode);
        const sarligGrunnerBegrunnelse = sarligGrunnerBegrunnelseFelt !== undefined ? sarligGrunnerBegrunnelseFelt.tilVerdi : undefined;

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
              const visSarligGrunnerBegrunnelse = sarligGrunnerBegrunnelse && index === endredeFelter.length - 1;

              return (
                <React.Fragment key={endretFeltNavn.kode}>
                  {visBegrunnelse && begrunnelse}
                  {visBegrunnelse && <VerticalSpacer eightPx />}
                  {visAktsomhetBegrunnelse && begrunnelseFritekst}
                  {visAktsomhetBegrunnelse && <VerticalSpacer eightPx />}
                  <Normaltekst>
                    <FormattedHTMLMessage
                      id={felt.fraVerdi ? 'Historikk.Template.Tilbakekreving.ChangedFromTo' : 'Historikk.Template.Tilbakekreving.FieldSetTo'}
                      values={{ navn: getKodeverknavn(endretFeltNavn), fraVerdi: formatertFraVerdi, tilVerdi: formatertTilVerdi }}
                    />
                  </Normaltekst>
                  <VerticalSpacer eightPx />
                  {visSarligGrunnerBegrunnelse && sarligGrunnerBegrunnelse}
                  {visSarligGrunnerBegrunnelse && <VerticalSpacer eightPx />}
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
  createLocationForSkjermlenke: PropTypes.func.isRequired,
};

export default HistorikkMalTypeTilbakekreving;
