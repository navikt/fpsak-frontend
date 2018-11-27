import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Container } from 'nav-frontend-grid';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';

import SoknadData from 'papirsoknad/SoknadData';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import EngangsstonadForm from './engangsstonad/EngangsstonadForm';
import ForeldrepengerForm from './foreldrepenger/ForeldrepengerForm';
import EndringForeldrepengerForm from './foreldrepenger/EndringForeldrepengerForm';
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
  setSoknadData,
  readOnly,
  soknadData,
}) => (
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
      {soknadData !== null && soknadData.getFagsakYtelseType() === fagsakYtelseType.ENGANGSSTONAD
        && (
        <EngangsstonadForm
          onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
          onSubmit={submitPapirsoknad}
          readOnly={readOnly}
          soknadData={soknadData}
        />
        )
      }
      {soknadData !== null && soknadData.getFagsakYtelseType() === fagsakYtelseType.FORELDREPENGER
        && (
        <ForeldrepengerForm
          onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
          onSubmit={submitPapirsoknad}
          readOnly={readOnly}
          soknadData={soknadData}
        />
        )
      }
      {soknadData !== null && soknadData.getFagsakYtelseType() === fagsakYtelseType.ENDRING_FORELDREPENGER
        && (
        <EndringForeldrepengerForm
          onSubmitUfullstendigsoknad={onSubmitUfullstendigsoknad}
          onSubmit={submitPapirsoknad}
          readOnly={readOnly}
          soknadData={soknadData}
        />
        )
      }
    </Container>
  </Panel>
);

RegistrerPapirsoknad.propTypes = {
  /** Egen submit-handler som brukes dersom det indikeres at søknaden er ufullstendig */
  onSubmitUfullstendigsoknad: PropTypes.func.isRequired,
  /** Skjemaverdier hentet fra reduxForm */
  readOnly: PropTypes.bool.isRequired,
  submitPapirsoknad: PropTypes.func.isRequired,
  setSoknadData: PropTypes.func.isRequired,
  soknadData: PropTypes.instanceOf(SoknadData),
};

RegistrerPapirsoknad.defaultProps = {
  soknadData: null,
};

export default RegistrerPapirsoknad;
