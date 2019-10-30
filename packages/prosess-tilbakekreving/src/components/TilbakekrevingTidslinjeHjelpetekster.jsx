import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import ikkeOppfyltUrl from '@fpsak-frontend/assets/images/ikke_oppfylt.svg';
import oppfyltUrl from '@fpsak-frontend/assets/images/oppfylt.svg';
import uavklartUrl from '@fpsak-frontend/assets/images/uavklart.svg';
import { LegendBox } from '@fpsak-frontend/tidslinje';

const TilbakekrevingTidslinjeHjelpetekster = ({ intl }) => {
  const legends = [
    {
      src: oppfyltUrl,
      text: intl.formatMessage({ id: 'Timeline.BelopTilbakereves' }),
    },
    {
      src: ikkeOppfyltUrl,
      text: intl.formatMessage({ id: 'Timeline.IngenTilbakekreving' }),
    },
    {
      src: uavklartUrl,
      text: intl.formatMessage({ id: 'Timeline.IkkeAvklartPeriode' }),
    },
  ];
  return <LegendBox legends={legends} />;
};
TilbakekrevingTidslinjeHjelpetekster.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(TilbakekrevingTidslinjeHjelpetekster);
