import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
 Systemtittel, Undertittel, Undertekst, Normaltekst,
} from 'nav-frontend-typografi';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import {
  FadingPanel, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';

import { getAlleTilbakekrevingKodeverk } from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import tilbakekrevingAksjonspunktCodes from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingAksjonspunktCodes';
import behandlingSelectors from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';
import TilbakekrevingVedtakForm from './TilbakekrevingVedtakForm';

const vedtakAksjonspunkter = [tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK];

export const TilbakekrevingVedtakImpl = ({
  submitCallback,
  readOnly,
  resultat,
  perioder,
  getKodeverknavn,
  isBehandlingHenlagt,
}) => (
  <FadingPanel>
    {isBehandlingHenlagt && (
      <Systemtittel><FormattedMessage id="TilbakekrevingVedtak.ErHenlagt" /></Systemtittel>
    )}
    {!isBehandlingHenlagt && (
      <>
        <Undertittel>
          <FormattedMessage id="Behandlingspunkt.Vedtak" />
        </Undertittel>
        <VerticalSpacer twentyPx />
        <Undertekst>
          <FormattedMessage id="TilbakekrevingVedtak.Resultat" />
        </Undertekst>
        <Normaltekst>
          {getKodeverknavn(resultat)}
        </Normaltekst>
        <VerticalSpacer sixteenPx />
        <TilbakekrevingVedtakPeriodeTabell perioder={perioder} getKodeverknavn={getKodeverknavn} />
        <VerticalSpacer sixteenPx />
        <TilbakekrevingVedtakForm
          submitCallback={submitCallback}
          readOnly={readOnly}
        />
      </>
    )}
  </FadingPanel>
);

TilbakekrevingVedtakImpl.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  resultat: kodeverkObjektPropType.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  isBehandlingHenlagt: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const beregningsresultat = behandlingSelectors.getBeregningsresultat(state);
  return {
    perioder: beregningsresultat.beregningResultatPerioder,
    resultat: beregningsresultat.vedtakResultatType,
  };
};

const TilbakekrevingVedtak = connect(mapStateToProps)(injectKodeverk(getAlleTilbakekrevingKodeverk)(TilbakekrevingVedtakImpl));

TilbakekrevingVedtak.supports = (apCodes, isBehandlingHenlagt) => isBehandlingHenlagt || vedtakAksjonspunkter.some(ap => apCodes.includes(ap));

export default TilbakekrevingVedtak;
