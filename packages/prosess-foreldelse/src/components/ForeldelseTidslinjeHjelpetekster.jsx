import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import ikkeOppfyltUrl from '@fpsak-frontend/assets/images/ikke_oppfylt.svg';
import oppfyltUrl from '@fpsak-frontend/assets/images/oppfylt.svg';
import uavklartUrl from '@fpsak-frontend/assets/images/uavklart.svg';
import { LegendBox } from '@fpsak-frontend/tidslinje';

const ForeldelseTidslinjeHjelpetekster = ({ intl }) => {
  const legends = [
    {
      src: oppfyltUrl,
      text: intl.formatMessage({ id: 'Timeline.OppfyltPeriode' }),
    },
    {
      src: ikkeOppfyltUrl,
      text: intl.formatMessage({ id: 'Timeline.IkkeOppfyltPeriode' }),
    },
    {
      src: uavklartUrl,
      text: intl.formatMessage({ id: 'Timeline.IkkeAvklartPeriode' }),
    },
  ];
  return <LegendBox legends={legends} />;
};
ForeldelseTidslinjeHjelpetekster.propTypes = {
  intl: PropTypes.shape().isRequired,
};
export default injectIntl(ForeldelseTidslinjeHjelpetekster);
