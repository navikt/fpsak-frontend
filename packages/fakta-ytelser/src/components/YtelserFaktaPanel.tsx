import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import { InntektArbeidYtelse, Kodeverk } from '@fpsak-frontend/types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import PersonYtelserTable from './PersonYtelserTable';

interface OwnProps {
  inntektArbeidYtelse: InntektArbeidYtelse;
  relatertYtelseTyper: Kodeverk[];
  relatertYtelseStatus: Kodeverk[];
}

const YtelserFaktaPanel: FunctionComponent<OwnProps> = ({
  inntektArbeidYtelse,
  relatertYtelseTyper,
  relatertYtelseStatus,
}) => (
  <>
    <Undertittel><FormattedMessage id="YtelserFaktaPanel.SokersYtelser" /></Undertittel>
    <VerticalSpacer eightPx />
    <PersonYtelserTable
      ytelser={inntektArbeidYtelse.relatertTilgrensendeYtelserForSoker}
      relatertYtelseTyper={relatertYtelseTyper}
      relatertYtelseStatus={relatertYtelseStatus}
    />
    {(inntektArbeidYtelse.relatertTilgrensendeYtelserForAnnenForelder && inntektArbeidYtelse.relatertTilgrensendeYtelserForAnnenForelder.length > 0) && (
      <>
        <VerticalSpacer fourtyPx />
        <Undertittel><FormattedMessage id="YtelserFaktaPanel.AnnenPartsYtelser" /></Undertittel>
        <VerticalSpacer eightPx />
        <PersonYtelserTable
          ytelser={inntektArbeidYtelse.relatertTilgrensendeYtelserForAnnenForelder}
          relatertYtelseTyper={relatertYtelseTyper}
          relatertYtelseStatus={relatertYtelseStatus}
        />
      </>
    )}
  </>
);

export default YtelserFaktaPanel;
