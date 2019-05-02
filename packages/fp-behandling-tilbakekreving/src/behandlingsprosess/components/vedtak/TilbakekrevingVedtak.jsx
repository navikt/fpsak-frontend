import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import {
  FadingPanel, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import tilbakekrevingAksjonspunktCodes from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingAksjonspunktCodes';
import TilbakekrevingVedtakPeriodeTabell from './TilbakekrevingVedtakPeriodeTabell';
import TilbakekrevingVedtakForm from './TilbakekrevingVedtakForm';

const vedtakAksjonspunkter = [tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK];

export const TilbakekrevingVedtakImpl = ({
  submitCallback,
  readOnly,
  readOnlySubmitButton,
  resultat,
  konsekvensAvBehandling,
  perioder,
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
          {resultat}
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
    <TilbakekrevingVedtakPeriodeTabell perioder={perioder} />
    <VerticalSpacer sixteenPx />
    <TilbakekrevingVedtakForm
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
    />
  </FadingPanel>
);

TilbakekrevingVedtakImpl.propTypes = {
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  resultat: PropTypes.string.isRequired,
  konsekvensAvBehandling: PropTypes.string.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()),
};

// FIXME (TOR) Ta i bruk data fra backend
const mapStateToProps = () => ({
  perioder: [{
    fomDato: '2019-10-10',
    tomDato: '2019-12-10',
    feilUtbetaltBelop: 15430,
    vurdering: 'Simpel uaktsomhet',
    andelAvBelop: 100,
    belopSomTilbakekreves: 15430,
  }, {
      fomDato: '2019-05-10',
      tomDato: '2019-06-10',
      feilUtbetaltBelop: 14000,
      vurdering: 'Simpel uaktsomhet',
      andelAvBelop: 50,
      belopSomTilbakekreves: 7000,
    },
  ],
  resultat: 'Delvis tilbakebetaling',
  konsekvensAvBehandling: 'Revurdering med vedtak 20.05.2018',
});

const TilbakekrevingVedtak = connect(mapStateToProps)(TilbakekrevingVedtakImpl);

TilbakekrevingVedtak.supports = apCodes => vedtakAksjonspunkter.some(ap => apCodes.includes(ap));

export default TilbakekrevingVedtak;
