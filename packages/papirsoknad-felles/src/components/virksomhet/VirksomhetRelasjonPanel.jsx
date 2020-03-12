import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';

/**
 * VirksomhetRelasjonPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av
 * papirsøknad dersom søknad gjelder foreldrepenger og saksbehandler skal legge til ny virksomhet for
 * søker.
 */
export const VirksomhetRelasjonPanel = ({
  readOnly,
}) => (
  <>
    <Undertekst><FormattedMessage id="Registrering.VirksomhetRelasjonPanel.Relation" /></Undertekst>
    <VerticalSpacer fourPx />
    <RadioGroupField name="familieEllerVennerTilknyttetNaringen" direction="vertical" readOnly={readOnly}>
      <RadioOption key="Ja" label={<FormattedMessage id="Registrering.VirksomhetRelasjonPanel.Yes" />} value />
      <RadioOption key="Nei" label={<FormattedMessage id="Registrering.VirksomhetRelasjonPanel.No" />} value={false} />
    </RadioGroupField>
  </>
);

VirksomhetRelasjonPanel.propTypes = {
  readOnly: PropTypes.bool,
};


VirksomhetRelasjonPanel.defaultProps = {
  readOnly: true,
};

export default VirksomhetRelasjonPanel;
