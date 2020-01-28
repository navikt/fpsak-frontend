import React, { FunctionComponent, useMemo } from 'react';
import classnames from 'classnames/bind';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import Aksjonspunkt from '../types/aksjonspunktTsType';
import Kodeverk from '../types/kodeverkTsType';

import styles from './margMarkering.less';

const classNames = classnames.bind(styles);

interface OwnProps {
  behandlingStatus: Kodeverk;
  aksjonspunkter: Aksjonspunkt[];
  isReadOnly: boolean;
  visAksjonspunktMarkering?: boolean;
  children: any;
}

const MargMarkering: FunctionComponent<OwnProps> = ({
  behandlingStatus,
  aksjonspunkter,
  isReadOnly,
  visAksjonspunktMarkering = true,
  children,
}) => {
  if (aksjonspunkter.length === 0) {
    return (
      <div className={styles.prosesspunkt}>
        {children}
      </div>
    );
  }

  const ikkeAkseptertAvBeslutter = behandlingStatus.kode === BehandlingStatus.BEHANDLING_UTREDES
    && aksjonspunkter[0].toTrinnsBehandling && aksjonspunkter[0].toTrinnsBehandlingGodkjent === false;

  const harApnentAksjonspunktSomKanLoses = useMemo(() => aksjonspunkter.some((ap) => isAksjonspunktOpen(ap.status.kode) && ap.kanLoses), [aksjonspunkter]);
  const visAksjonspunkt = visAksjonspunktMarkering && harApnentAksjonspunktSomKanLoses && !isReadOnly;

  return (
    <div className={classNames('prosesspunkt', { ikkeAkseptertAvBeslutter, visAksjonspunkt })}>
      {children}
    </div>
  );
};

export default MargMarkering;
