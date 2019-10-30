import React from 'react';
import { injectIntl } from 'react-intl';

import ikkeOppfyltUrl from '@fpsak-frontend/assets/images/ikke_oppfylt.svg';
import oppfyltUrl from '@fpsak-frontend/assets/images/oppfylt.svg';
import uavklartUrl from '@fpsak-frontend/assets/images/uavklart.svg';

import PropTypes from 'prop-types';
import { LegendBox } from '@fpsak-frontend/tidslinje';
import fodselUrl from '@fpsak-frontend/assets/images/fodsel.svg';
import soknadUrl from '@fpsak-frontend/assets/images/soknad.svg';
import revurderingUrl from '@fpsak-frontend/assets/images/endringstidspunkt.svg';
import gradertImage from '@fpsak-frontend/assets/images/periode_gradert.svg';
import manueltAvklart from '@fpsak-frontend/assets/images/periode_manuelt_avklart.svg';

const UttakTidslinjeHjelpetekster = ({ intl }) => {
  const { formatMessage } = intl;
  const legends = [
    {
      src: oppfyltUrl,
      text: formatMessage({ id: 'Timeline.OppfyltPeriode' }),
    },
    {
      src: fodselUrl,
      text: formatMessage({ id: 'Timeline.TidspunktFamiliehendelse' }),
    },
    {
      src: ikkeOppfyltUrl,
      text: formatMessage({ id: 'Timeline.IkkeOppfyltPeriode' }),
    },
    {
      src: soknadUrl,
      text: formatMessage({ id: 'Timeline.TidspunktMotakSoknad' }),
    },
    {
      src: uavklartUrl,
      text: formatMessage({ id: 'Timeline.IkkeAvklartPeriode' }),
    },
    {
      src: revurderingUrl,
      text: formatMessage({ id: 'Timeline.TidspunktRevurdering' }),
    },
    {
      src: gradertImage,
      text: formatMessage({ id: 'Timeline.GradertPeriode' }),
    },
    {
      src: manueltAvklart,
      text: formatMessage({ id: 'Timeline.ManueltAvklart' }),
    },
  ];
  return <LegendBox legends={legends} />;
};

UttakTidslinjeHjelpetekster.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(UttakTidslinjeHjelpetekster);
