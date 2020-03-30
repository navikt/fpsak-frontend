import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Container } from 'nav-frontend-grid';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';

import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import EngangsstonadPapirsoknadIndex from '@fpsak-frontend/papirsoknad-es';
import ForeldrepengerPapirsoknadIndex from '@fpsak-frontend/papirsoknad-fp';
import SvangerskapspengerPapirsoknadIndex from '@fpsak-frontend/papirsoknad-svp';
import { SoknadData } from '@fpsak-frontend/papirsoknad-felles';
import { FagsakInfo } from '@fpsak-frontend/behandling-felles';
import { KodeverkMedNavn } from '@fpsak-frontend/types';

import SoknadTypePickerForm from './SoknadTypePickerForm';

import styles from './registrerPapirsoknadPanel.less';

interface OwnProps {
  fagsak: FagsakInfo;
  kodeverk: {[key: string]: KodeverkMedNavn[]};
  readOnly: boolean;
  setSoknadData: (SoknadData) => void;
  soknadData: SoknadData;
  lagreUfullstendig: () => Promise<any>;
  lagreFullstendig: (_formValues, _dispatch, values: {}) => Promise<any>;
}

const RegistrerPapirsoknadPanel: FunctionComponent<OwnProps> = ({
  fagsak,
  kodeverk,
  readOnly,
  setSoknadData,
  soknadData,
  lagreUfullstendig,
  lagreFullstendig,
}) => (
  <>
    <Panel className={styles.panelWithActionNeeded}>
      <Container fluid>
        <Undertittel><FormattedMessage id="Registrering.RegistrereSoknad" /></Undertittel>
        <VerticalSpacer sixteenPx />
        <AksjonspunktHelpText isAksjonspunktOpen={!readOnly}>
          {[<FormattedMessage key="regOpplysninger" id="Registrering.RegistrerAlleOpplysninger" />]}
        </AksjonspunktHelpText>
        <VerticalSpacer sixteenPx />
        <VerticalSpacer sixteenPx />
        <SoknadTypePickerForm
          setSoknadData={setSoknadData}
          soknadData={soknadData}
          fagsakYtelseType={fagsak.fagsakYtelseType}
          alleKodeverk={kodeverk}
        />
        {soknadData && soknadData.getFagsakYtelseType() === fagsakYtelseType.ENGANGSSTONAD && (
          <EngangsstonadPapirsoknadIndex
            onSubmitUfullstendigsoknad={lagreUfullstendig}
            onSubmit={lagreFullstendig}
            readOnly={readOnly}
            soknadData={soknadData}
            alleKodeverk={kodeverk}
            fagsakPerson={fagsak.fagsakPerson}
          />
        )}
        {soknadData && soknadData.getFagsakYtelseType() === fagsakYtelseType.FORELDREPENGER && (
          <ForeldrepengerPapirsoknadIndex
            onSubmitUfullstendigsoknad={lagreUfullstendig}
            onSubmit={lagreFullstendig}
            readOnly={readOnly}
            soknadData={soknadData}
            alleKodeverk={kodeverk}
            fagsakPerson={fagsak.fagsakPerson}
          />
        )}
        {soknadData && soknadData.getFagsakYtelseType() === fagsakYtelseType.SVANGERSKAPSPENGER && (
          <SvangerskapspengerPapirsoknadIndex
            onSubmitUfullstendigsoknad={lagreUfullstendig}
            onSubmit={lagreFullstendig}
            readOnly={readOnly}
            soknadData={soknadData}
            alleKodeverk={kodeverk}
            fagsakPerson={fagsak.fagsakPerson}
          />
        )}
      </Container>
    </Panel>
  </>
);

export default RegistrerPapirsoknadPanel;
