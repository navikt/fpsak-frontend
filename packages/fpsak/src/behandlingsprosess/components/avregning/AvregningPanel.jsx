import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Undertittel } from 'nav-frontend-typografi';
import FadingPanel from '@fpsak-frontend/shared-components/FadingPanel';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import {
  getPersonopplysning,
  getBehandlingResultatstruktur,
  getSoknad,
} from 'behandling/behandlingSelectors';
import { Row } from 'nav-frontend-grid';
import Summary from './Summary';


export const AvregningPanelImpl = () => (
  <FadingPanel>
    <Undertittel>
      <FormattedMessage id="Avregning.Title" />
    </Undertittel>
    <VerticalSpacer twentyPx />
    <div>
      <Row>
        <Summary />
      </Row>
    </div>
  </FadingPanel>
);


const mapStateToProps = (state) => {
  const person = getPersonopplysning(state);
  const beregningsresultat = getBehandlingResultatstruktur(state);
  const soknad = getSoknad(state);
  return {
    hovedsokerKjonn: person ? person.navBrukerKjonn.kode : undefined,
    medsokerKjonn: person.annenPart ? person.annenPart.navBrukerKjonn.kode : undefined,
    soknadDato: soknad.mottattDato,
    beregningsresultatMedUttaksplan: beregningsresultat,
  };
};

const AvregningPanel = connect(mapStateToProps)(injectIntl(AvregningPanelImpl));

AvregningPanel.supports = bp => bp === behandlingspunktCodes.AVREGNING;

export default AvregningPanel;
