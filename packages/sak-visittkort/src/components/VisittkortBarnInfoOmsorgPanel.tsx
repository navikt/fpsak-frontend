import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { FamilieHendelseSamling } from '@fpsak-frontend/types';
import { FlexColumn } from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

import styles from './visittkortBarnInfoOmsorgPanel.less';

interface OwnProps {
  familieHendelse: FamilieHendelseSamling;
}

const VisittkortBarnInfoOmsorgPanel: FunctionComponent<OwnProps> = ({
  familieHendelse,
}) => {
  const { oppgitt, gjeldende } = familieHendelse;

  const omsorgovertakelseDato = gjeldende.omsorgsovertakelseDato ? gjeldende.omsorgsovertakelseDato : oppgitt.omsorgsovertakelseDato;

  let antall = gjeldende.antallBarnTilBeregning ? gjeldende.antallBarnTilBeregning : oppgitt.antallBarnTilBeregning;
  const erForeldreansvar = !!antall;

  if (!antall) {
    antall = gjeldende.adopsjonFodelsedatoer ? Object.keys(gjeldende.adopsjonFodelsedatoer).length : Object.keys(oppgitt.adopsjonFodelsedatoer).length;
  }

  const foreldreansvarTekstkode = antall === 1 ? 'VisittkortBarnInfoOmsorgPanel.Foreldreansvar' : 'VisittkortBarnInfoOmsorgPanel.ForeldreansvarAntallBarn';
  const adopsjonTekstkode = antall === 1 ? 'VisittkortBarnInfoOmsorgPanel.Adopsjon' : 'VisittkortBarnInfoOmsorgPanel.AdopsjonAntallBarn';

  return (
    <FlexColumn className={styles.text}>
      <Normaltekst>
        <FormattedMessage
          id={erForeldreansvar ? foreldreansvarTekstkode : adopsjonTekstkode}
          values={{ antall, dato: moment(omsorgovertakelseDato).format(DDMMYYYY_DATE_FORMAT) }}
        />
      </Normaltekst>
    </FlexColumn>
  );
};

export default VisittkortBarnInfoOmsorgPanel;
