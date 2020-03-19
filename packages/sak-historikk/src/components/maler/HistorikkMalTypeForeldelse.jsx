import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import historikkOpplysningTypeCodes from '../../kodeverk/historikkOpplysningTypeCodes';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';

const scrollUp = () => {
  window.scroll(0, 0);
};

export const HistorikkMalTypeForeldelse = ({
  historikkinnslagDeler,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
}) => {
  if (historikkinnslagDeler.length === 0) {
    return null;
  }
  return (
    <div>
      <Element>
        <NavLink
          to={createLocationForSkjermlenke(behandlingLocation, historikkinnslagDeler[0].skjermlenke.kode)}
          onClick={scrollUp}
        >
          {getKodeverknavn(historikkinnslagDeler[0].skjermlenke)}
        </NavLink>
      </Element>
      {historikkinnslagDeler.map((historikkinnslagDel) => {
        const { begrunnelseFritekst, opplysninger, endredeFelter } = historikkinnslagDel;
        const periodeFom = opplysninger.find((o) => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_FOM.kode).tilVerdi;
        const periodeTom = opplysninger.find((o) => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_TOM.kode).tilVerdi;

        return (
          <div key={periodeFom + periodeTom}>
            <Normaltekst>
              <FormattedHTMLMessage id="Historikk.Template.Foreldelse.VurderingAvPerioden" values={{ periodeFom, periodeTom }} />
            </Normaltekst>
            {endredeFelter && endredeFelter.map((felt) => {
              const { endretFeltNavn, fraVerdi, tilVerdi } = felt;

              return (
                <React.Fragment key={endretFeltNavn.kode}>
                  <Normaltekst>
                    <FormattedHTMLMessage
                      id={felt.fraVerdi ? 'Historikk.Template.Tilbakekreving.ChangedFromTo' : 'Historikk.Template.Tilbakekreving.FieldSetTo'}
                      values={{ navn: getKodeverknavn(endretFeltNavn), fraVerdi, tilVerdi }}
                    />
                  </Normaltekst>
                  <VerticalSpacer eightPx />
                </React.Fragment>
              );
            })}
            <VerticalSpacer eightPx />
            <Normaltekst>
              {begrunnelseFritekst && begrunnelseFritekst}
            </Normaltekst>
            <VerticalSpacer eightPx />
          </div>
        );
      })}
    </div>
  );
};

HistorikkMalTypeForeldelse.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  createLocationForSkjermlenke: PropTypes.func.isRequired,
};

export default HistorikkMalTypeForeldelse;
