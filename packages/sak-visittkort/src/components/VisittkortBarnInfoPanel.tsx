import React, { FunctionComponent } from 'react';

import soknadType from '@fpsak-frontend/kodeverk/src/soknadType';
import { FamilieHendelseSamling } from '@fpsak-frontend/types';
import {
  FlexColumn, FlexContainer, FlexRow, Image,
} from '@fpsak-frontend/shared-components';
import barnevognImage from '@fpsak-frontend/assets/images/barnevogn.svg';

import VisittkortBarnInfoFodselPanel from './VisittkortBarnInfoFodselPanel';
import VisittkortBarnInfoOmsorgPanel from './VisittkortBarnInfoOmsorgPanel';

import styles from './visittkortBarnInfoPanel.less';

interface OwnProps {
  familieHendelse: FamilieHendelseSamling;
}

const VisittkortBarnInfoPanel: FunctionComponent<OwnProps> = ({
  familieHendelse,
}) => {
  const erFodselSoknad = familieHendelse.oppgitt.soknadType.kode === soknadType.FODSEL;

  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn className={styles.image}>
            <Image src={barnevognImage} />
          </FlexColumn>
          {erFodselSoknad && <VisittkortBarnInfoFodselPanel familieHendelse={familieHendelse} />}
          {!erFodselSoknad && <VisittkortBarnInfoOmsorgPanel familieHendelse={familieHendelse} />}
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

export default VisittkortBarnInfoPanel;
