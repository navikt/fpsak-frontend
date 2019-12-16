import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import { ArrowBox, ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { InputField, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';

/**
 * VirksomhetRegnskapPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av
 * papirsøknad dersom søknad gjelder foreldrepenger og saksbehandler skal legge til ny virksomhet for
 * søker.
 */
export const VirksomhetRegnskapPanel = ({
  harRegnskapsforer,
  readOnly,
}) => (
  <ElementWrapper>
    <Undertekst><FormattedMessage id="Registrering.VirksomhetRegnskapPanel.Accountant" /></Undertekst>
    <VerticalSpacer fourPx />
    <RadioGroupField name="harRegnskapsforer" readOnly={readOnly}>
      <RadioOption key="Ja" label={<FormattedMessage id="Registrering.VirksomhetRegnskapPanel.Yes" />} value />
      <RadioOption key="Nei" label={<FormattedMessage id="Registrering.VirksomhetRegnskapPanel.No" />} value={false} />
    </RadioGroupField>
    {harRegnskapsforer
    && (
    <ElementWrapper>
      <Row>
        <Column xs="6">
          <ArrowBox>
            <InputField
              name="navnRegnskapsforer"
              readOnly={readOnly}
              validate={[required]}
              label={<FormattedMessage id="Registrering.VirksomhetRegnskapPanel.AccountantName" />}
            />
            <InputField
              name="tlfRegnskapsforer"
              readOnly={readOnly}
              validate={[required]}
              label={<FormattedMessage id="Registrering.VirksomhetRegnskapPanel.AccountantPhone" />}
            />
          </ArrowBox>
        </Column>
      </Row>
      <VerticalSpacer sixteenPx />
    </ElementWrapper>
    )}
  </ElementWrapper>

);

const mapStateToProps = (state, initialProps) => ({
  harRegnskapsforer: formValueSelector(initialProps.form)(state, 'harRegnskapsforer'),
});

VirksomhetRegnskapPanel.propTypes = {
  harRegnskapsforer: PropTypes.bool,
  readOnly: PropTypes.bool,
};


VirksomhetRegnskapPanel.defaultProps = {
  readOnly: true,
  harRegnskapsforer: false,
};

export default connect(mapStateToProps)(VirksomhetRegnskapPanel);
