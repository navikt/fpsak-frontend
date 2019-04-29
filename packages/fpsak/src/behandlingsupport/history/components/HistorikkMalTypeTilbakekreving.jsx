import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import historikkOpplysningTypeCodes from '@fpsak-frontend/kodeverk/src/historikkOpplysningTypeCodes';
import historikkEndretFeltType from '@fpsak-frontend/kodeverk/src/historikkEndretFeltType';
import { historikkinnslagDelPropType } from '@fpsak-frontend/prop-types';

const HistorikkMalTypeTilbakekreving = ({
  historikkinnslagDeler,
}) => (
  <React.Fragment>
    {historikkinnslagDeler.map((historikkinnslagDel) => {
      const { opplysninger, endredeFelter } = historikkinnslagDel;
      const periodeFom = opplysninger.find(o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_FOM.kode).tilVerdi;
      const periodeTom = opplysninger.find(o => o.opplysningType.kode === historikkOpplysningTypeCodes.PERIODE_TOM.kode).tilVerdi;
      const begrunnelse = opplysninger
        .find(o => o.opplysningType.kode === historikkOpplysningTypeCodes.TILBAKEKREVING_OPPFYLT_BEGRUNNELSE.kode).tilVerdi;

      return (
        <div key={periodeFom + periodeTom}>
          <FormattedHTMLMessage id="Historikk.Template.Tilbakekreving.VurderingAvPerioden" values={{ periodeFom, periodeTom }} />
          <VerticalSpacer eightPx />
          {endredeFelter.map((felt) => {
            const { endretFeltNavn, fraVerdi, tilVerdi } = felt;
            const { navn, kode } = endretFeltNavn;

            const visBegrunnelse = historikkEndretFeltType.ER_VILKARENE_TILBAKEKREVING_OPPFYLT === kode;

            return (
              <React.Fragment key={navn}>
                <FormattedHTMLMessage
                  id={felt.fraVerdi ? 'Historikk.Template.Tilbakekreving.ChangedFromTo' : 'Historikk.Template.Tilbakekreving.FieldSetTo'}
                  values={{ navn, fraVerdi, tilVerdi }}
                />
                <VerticalSpacer eightPx />
                {visBegrunnelse && begrunnelse}
                {visBegrunnelse && <VerticalSpacer eightPx />}
              </React.Fragment>
            );
            })}
          <VerticalSpacer eightPx />
        </div>
      );
    })}
  </React.Fragment>
);

HistorikkMalTypeTilbakekreving.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
};

export default HistorikkMalTypeTilbakekreving;
