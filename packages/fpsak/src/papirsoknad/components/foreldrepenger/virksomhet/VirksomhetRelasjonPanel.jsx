import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import ElementWrapper from 'sharedComponents/ElementWrapper';
import { RadioGroupField, RadioOption } from 'form/Fields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import PropTypes from 'prop-types';

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
  <ElementWrapper>
    <Undertekst><FormattedMessage id="Registrering.VirksomhetRelasjonPanel.Relation" /></Undertekst>
    <VerticalSpacer fourPx />
    <RadioGroupField name="familieEllerVennerTilknyttetNaringen" direction="vertical" readOnly={readOnly}>
      <RadioOption key="Ja" label={<FormattedMessage id="Registrering.VirksomhetRelasjonPanel.Yes" />} value />
      <RadioOption key="Nei" label={<FormattedMessage id="Registrering.VirksomhetRelasjonPanel.No" />} value={false} />
    </RadioGroupField>
  </ElementWrapper>
);

VirksomhetRelasjonPanel.propTypes = {
  readOnly: PropTypes.bool,
};


VirksomhetRelasjonPanel.defaultProps = {
  readOnly: true,
};

export default VirksomhetRelasjonPanel;
