import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import {
  FadingPanel, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleTilbakekrevingKodeverk } from 'behandlingTilbakekreving/src/duckTilbake';
import tilbakekrevingAksjonspunktCodes from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingAksjonspunktCodes';
import { getBeregningsresultat } from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';
import TilbakekrevingVedtakForm from './TilbakekrevingVedtakForm';

const vedtakAksjonspunkter = [tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK];

export const TilbakekrevingVedtakImpl = ({
  submitCallback,
  readOnly,
  resultat,
  konsekvensAvBehandling,
  perioder,
  getKodeverknavn,
}) => (
  <FadingPanel>
    <Undertittel>
      <FormattedMessage id="Behandlingspunkt.Vedtak" />
    </Undertittel>
    <VerticalSpacer twentyPx />
    <Row>
      <Column xs="2">
        <Undertekst>
          <FormattedMessage id="TilbakekrevingVedtak.Resultat" />
        </Undertekst>
        <Normaltekst>
          {getKodeverknavn(resultat)}
        </Normaltekst>
      </Column>
      <Column xs="3">
        <Undertekst>
          <FormattedMessage id="TilbakekrevingVedtak.Konsekvens" />
        </Undertekst>
        <Normaltekst>
          {konsekvensAvBehandling}
        </Normaltekst>
      </Column>
    </Row>
    <VerticalSpacer sixteenPx />
    <TilbakekrevingVedtakPeriodeTabell perioder={perioder} getKodeverknavn={getKodeverknavn} />
    <VerticalSpacer sixteenPx />
    <TilbakekrevingVedtakForm
      submitCallback={submitCallback}
      readOnly={readOnly}
    />
  </FadingPanel>
);

TilbakekrevingVedtakImpl.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  resultat: kodeverkObjektPropType.isRequired,
  konsekvensAvBehandling: PropTypes.string.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const beregningsresultat = getBeregningsresultat(state);
  return {
    perioder: beregningsresultat.beregningResultatPerioder,
    resultat: beregningsresultat.vedtakResultatType,
    konsekvensAvBehandling: beregningsresultat.behandlingKonsekvens,
  };
};

const TilbakekrevingVedtak = connect(mapStateToProps)(injectKodeverk(getAlleTilbakekrevingKodeverk)(TilbakekrevingVedtakImpl));

TilbakekrevingVedtak.supports = apCodes => vedtakAksjonspunkter.some(ap => apCodes.includes(ap));

export default TilbakekrevingVedtak;
