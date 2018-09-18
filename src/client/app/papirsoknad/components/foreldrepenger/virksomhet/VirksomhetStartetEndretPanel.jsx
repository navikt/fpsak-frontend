import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import PropTypes from 'prop-types';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';

import ArrowBox from 'sharedComponents/ArrowBox';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { hasValidDate, hasValidInteger, required } from 'utils/validation/validators';
import {
  CheckboxField, InputField, RadioGroupField, RadioOption,
} from 'form/Fields';
import DatepickerField from 'form/fields/DatepickerField';
import TextAreaField from 'form/fields/TextAreaField';

/**
 * VirksomhetStartetEndretPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av
 * papirsøknad dersom søknad gjelder foreldrepenger og saksbehandler skal legge til ny virksomhet for
 * søker.
 */
export const VirksomhetStartetEndretPanel = ({
  readOnly,
  varigEndretEllerStartetSisteFireAr,
}) => (
  <ElementWrapper>
    <Undertekst><FormattedMessage id="Registrering.VirksomhetStartetPanel.NewlyStartedOrChanged" /></Undertekst>
    <VerticalSpacer fourPx />
    <RadioGroupField name="varigEndretEllerStartetSisteFireAr" readOnly={readOnly}>
      <RadioOption key="Ja" label={<FormattedMessage id="Registrering.VirksomhetStartetPanel.Yes" />} value />
      <RadioOption key="Nei" label={<FormattedMessage id="Registrering.VirksomhetStartetPanel.No" />} value={false} />
    </RadioGroupField>
    {varigEndretEllerStartetSisteFireAr
    && (
    <Row>
      <Column xs="6">
        <ArrowBox>
          <Undertekst><FormattedMessage id="Registrering.VirksomhetStartetPanel.Reason" /></Undertekst>
          <VerticalSpacer fourPx />
          <CheckboxField name="harVarigEndring" label={<FormattedMessage id="Registrering.VirksomhetStartetPanel.HarVarigEndring" />} />
          <CheckboxField name="erNyoppstartet" label={<FormattedMessage id="Registrering.VirksomhetStartetPanel.ErNyoppstartet" />} />
          <TextAreaField
            name="beskrivelseAvEndring"
            label={<FormattedMessage id="Registrering.VirksomhetStartetPanel.VirksomhetEndretBeskrivelse" />}
          />
          <DatepickerField
            name="varigEndringGjeldendeFom"
            readOnly={readOnly}
            validate={[hasValidDate, required]}
            label={<FormattedMessage id="Registrering.VirksomhetStartetPanel.VarigEndringGjeldendeFom" />}
          />
          <InputField
            name="inntekt"
            label={<FormattedMessage id="Registrering.VirksomhetStartetPanel.Inntekt" />}
            readOnly={readOnly}
            validate={[hasValidInteger, required]}
            parse={(value) => {
              const parsedValue = parseInt(value, 10);
              return Number.isNaN(parsedValue) ? value : parsedValue;
            }}
            bredde="S"
          />
        </ArrowBox>
      </Column>
    </Row>
    )
    }
    <VerticalSpacer eightPx />
  </ElementWrapper>

);

VirksomhetStartetEndretPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  varigEndretEllerStartetSisteFireAr: PropTypes.bool,
};

VirksomhetStartetEndretPanel.defaultProps = {
  varigEndretEllerStartetSisteFireAr: false,
};

const mapStateToProps = (state, initialProps) => ({
  varigEndretEllerStartetSisteFireAr: formValueSelector(initialProps.form)(state, 'varigEndretEllerStartetSisteFireAr'),
});

export default connect(mapStateToProps)(VirksomhetStartetEndretPanel);
