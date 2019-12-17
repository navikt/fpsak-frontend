import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Container } from 'nav-frontend-grid';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';

import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import EngangsstonadPapirsoknadIndex from '@fpsak-frontend/papirsoknad-es';
import ForeldrepengerPapirsoknadIndex from '@fpsak-frontend/papirsoknad-fp';
import SvangerskapspengerPapirsoknadIndex from '@fpsak-frontend/papirsoknad-svp';

import SoknadTypePickerForm from './SoknadTypePickerForm';

import styles from './registrerPapirsoknad.less';

/**
 * RegisterPapirsoknad
 *
 * Presentasjonskomponent. Har ansvar for å sette opp ReduxForm-skjemaet for registrering av papirsøknad for engangsstønad eller foreldrepenger.
 * Komponenten tilpasser skjemaet til valgt søknadstype (engagnsstønad eller foreldrepenger), valgt søknadtema (fødsel, adopsjon eller omsorg)
 * og valgt foreldretype (mor, far/medmor eller tredjepart). Komponenten inneholder logikk for å reinitialisere deler av
 * skjemaet ved bytte av søknadstype.
 */
export const RegistrerPapirsoknad = ({
  onSubmitUfullstendigsoknad,
  submitPapirsoknad,
  readOnly,
}) => {
  const [soknadData, setSoknadData] = useState();
  return (
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
        />
        {soknadData && soknadData.getFagsakYtelseType() === fagsakYtelseType.ENGANGSSTONAD && (
          <EngangsstonadPapirsoknadIndex
            onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
            onSubmit={submitPapirsoknad}
            readOnly={readOnly}
            soknadData={soknadData}
          />
        )}
        {soknadData && soknadData.getFagsakYtelseType() === fagsakYtelseType.FORELDREPENGER && (
          <ForeldrepengerPapirsoknadIndex
            onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
            onSubmit={submitPapirsoknad}
            readOnly={readOnly}
            soknadData={soknadData}
          />
        )}
        {soknadData && soknadData.getFagsakYtelseType() === fagsakYtelseType.SVANGERSKAPSPENGER && (
          <SvangerskapspengerPapirsoknadIndex
            onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
            submitCallback={submitPapirsoknad}
            readOnly={readOnly}
            soknadData={soknadData}
          />
        )}
      </Container>
    </Panel>
  )
}

RegistrerPapirsoknad.propTypes = {
  /** Egen submit-handler som brukes dersom det indikeres at søknaden er ufullstendig */
  onSubmitUfullstendigsoknad: PropTypes.func.isRequired,
  /** Skjemaverdier hentet fra reduxForm */
  readOnly: PropTypes.bool.isRequired,
  submitPapirsoknad: PropTypes.func.isRequired,
};

export default RegistrerPapirsoknad;
