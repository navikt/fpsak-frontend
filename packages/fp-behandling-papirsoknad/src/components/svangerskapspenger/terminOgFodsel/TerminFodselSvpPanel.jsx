import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { injectIntl } from 'react-intl';
import { Fieldset } from 'nav-frontend-skjema';

import { BorderBox } from '@fpsak-frontend/shared-components';
import { DatepickerField } from '@fpsak-frontend/form';
import {
  dateBeforeOrEqualToToday,
  hasValidDate,
  required,
} from '@fpsak-frontend/utils';

/*
 * TerminFodselSvpPanel
 *
 * Form som brukes for registrere termin og fødsel i papirsøknad.
 */
const TerminFodselSvpPanel = ({
  readOnly,
  intl,
}) => (
  <BorderBox>
    <Fieldset legend={intl.formatMessage({ id: 'TerminFodselSvpPanel.TerminOgFodsel' })}>
      <Row>
        <Column xs="2">
          <DatepickerField
            name="termindato"
            label={{ id: 'TerminFodselSvpPanel.Termindato' }}
            readOnly={readOnly}
            validate={[required, hasValidDate]}
          />
        </Column>
        <Column xs="3">
          <DatepickerField
            name="foedselsDato"
            label={{ id: 'TerminFodselSvpPanel.Fodselsdato' }}
            readOnly={readOnly}
            validate={[hasValidDate, dateBeforeOrEqualToToday]}
          />
        </Column>
      </Row>
    </Fieldset>
  </BorderBox>
);

TerminFodselSvpPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(TerminFodselSvpPanel);
