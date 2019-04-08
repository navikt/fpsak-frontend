import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import {
  VerticalSpacer, ArrowBox,
} from '@fpsak-frontend/shared-components';

const UaktsomhetGradForsettPanel = () => (
  <div>
    <ArrowBox alignOffset={20}>
      <Undertekst>
        <FormattedMessage id="UaktsomhetGradFormPanel.Andel" />
      </Undertekst>
      <Normaltekst>100 %</Normaltekst>
      <VerticalSpacer eightPx />
      <Normaltekst>
        <FormattedMessage id="UaktsomhetGradFormPanel.Renter" />
      </Normaltekst>
    </ArrowBox>
  </div>
);

export default UaktsomhetGradForsettPanel;
