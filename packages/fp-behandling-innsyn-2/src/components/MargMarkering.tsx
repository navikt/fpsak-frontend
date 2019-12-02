import React, { ReactNode, FunctionComponent, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { aksjonspunktPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import { Aksjonspunkt } from '../types/aksjonspunktTsType';
import { Kodeverk } from '../types/kodeverkTsType';

import styles from './margMarkering.less';

const classNames = classnames.bind(styles);

type MargMarkeringProps = Readonly<{
  behandlingStatus: Kodeverk;
  aksjonspunkter: [Aksjonspunkt];
  isReadOnly: boolean;
  children: ReactNode;
}>;

const MargMarkering: FunctionComponent<MargMarkeringProps> = ({
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
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
};

export default MargMarkering;
