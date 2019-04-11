import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import {
  VerticalSpacer, ArrowBox,
} from '@fpsak-frontend/shared-components';

const AktsomhetGradForsettFormPanel = () => (
  <div>
    <ArrowBox alignOffset={20}>
      <Undertekst>
        <FormattedMessage id="AktsomhetGradForsettFormPanel.Andel" />
      </Undertekst>
      <Normaltekst>100 %</Normaltekst>
      <VerticalSpacer eightPx />
      <Normaltekst>
        <FormattedMessage id="AktsomhetGradForsettFormPanel.Renter" />
      </Normaltekst>
    </ArrowBox>
  </div>
);

export default AktsomhetGradForsettFormPanel;
