import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import styles from './margMarkering.less';

const classNames = classnames.bind(styles);

const MargMarkering = ({
  behandlingStatus,
  aksjonspunkter,
  isReadOnly,
  children,
}) => {
  if (aksjonspunkter.length === 0) {
    return children;
  }
  const ikkeAkseptertAvBeslutter = behandlingStatus.kode === BehandlingStatus.BEHANDLING_UTREDES
    && aksjonspunkter[0].toTrinnsBehandling && aksjonspunkter[0].toTrinnsBehandlingGodkjent === false;

  const harApneAksjonspunkterSomIkkeErForeslaVedtak = useMemo(() => aksjonspunkter
    .filter((ap) => ap.definisjon.kode !== aksjonspunktCodes.FORESLA_VEDTAK)
    .some((ap) => isAksjonspunktOpen(ap.status.kode)), [aksjonspunkter]);
  const erAksjonspunktLosbart = useMemo(() => aksjonspunkter.some((ap) => ap.kanLoses), [aksjonspunkter]);
  const visAksjonspunkt = harApneAksjonspunkterSomIkkeErForeslaVedtak && erAksjonspunktLosbart && !isReadOnly;

  return (
    <div className={classNames('prosesspunkt', { ikkeAkseptertAvBeslutter, visAksjonspunkt })}>
      {children}
    </div>
  );
};

MargMarkering.propTypes = {
  behandlingStatus: kodeverkObjektPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export default MargMarkering;
