import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { FormattedMessage, intlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import {
  RadioGroupField, RadioOption, SelectField, InputField,
} from 'form/Fields';

import ArrowBox from 'sharedComponents/ArrowBox';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { required, hasValidInteger } from 'utils/validation/validators';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';

const countrySelectValues = countryCodes => countryCodes
  .map(({ kode, navn }) => <option value={kode} key={kode}>{navn}</option>);

/**
 * VirksomhetIdentifikasjonPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av
 * papirsøknad dersom søknad gjelder foreldrepenger og saksbehandler skal legge til ny virksomhet for
 * søker.
 */
export const VirksomhetIdentifikasjonPanel = ({
  virksomhetRegistrertINorge,
  readOnly,
  countryCodes,
  intl,
}) => {
  const sortedCountriesByName = countryCodes.slice().sort((a, b) => a.navn.localeCompare(b.navn));

  return (
    <ElementWrapper>
      <InputField
        name="navn"
        bredde="XL"
        validate={[required]}
        label={<FormattedMessage id="Registrering.VirksomhetIdentifikasjonPanel.Name" />}
        readOnly={readOnly}
      />
      <Undertekst><FormattedMessage id="Registrering.VirksomhetIdentifikasjonPanel.RegisteredInNorway" /></Undertekst>
      <VerticalSpacer fourPx />
      <RadioGroupField name="virksomhetRegistrertINorge" validate={[required]} readOnly={readOnly}>
        <RadioOption key="Ja" label={<FormattedMessage id="Registrering.VirksomhetIdentifikasjonPanel.Yes" />} value />
        <RadioOption key="Nei" label={<FormattedMessage id="Registrering.VirksomhetIdentifikasjonPanel.No" />} value={false} />
      </RadioGroupField>
      { virksomhetRegistrertINorge
      && (
      <ElementWrapper>
        <Row>
          <Column xs="5">
            <ArrowBox>
              <InputField
                name="organisasjonsnummer"
                readOnly={readOnly}
                validate={[required, hasValidInteger]}
                label={<FormattedMessage id="Registrering.VirksomhetIdentifikasjonPanel.OrganizationNumber" />}
              />
            </ArrowBox>
          </Column>
        </Row>
        <VerticalSpacer sixteenPx />
      </ElementWrapper>
      )
    }
      <Row>
        <Column xs="5">
          <SelectField
            name="landJobberFra"
            selectValues={countrySelectValues(sortedCountriesByName)}
            validate={[required]}
            label={intl.formatMessage({ id: 'Registrering.VirksomhetIdentifikasjonPanel.Country' })}
          />
        </Column>
      </Row>
    </ElementWrapper>
  );
};

VirksomhetIdentifikasjonPanel.propTypes = {
  intl: intlShape.isRequired,
  virksomhetRegistrertINorge: PropTypes.bool,
  readOnly: PropTypes.bool,
  countryCodes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

VirksomhetIdentifikasjonPanel.defaultProps = {
  virksomhetRegistrertINorge: false,
  readOnly: true,
};

const mapStateToProps = (state, initialProps) => ({
  virksomhetRegistrertINorge: formValueSelector(initialProps.form)(state, 'virksomhetRegistrertINorge'),
  countryCodes: getKodeverk(kodeverkTyper.LANDKODER)(state),
});

export default connect(mapStateToProps)(VirksomhetIdentifikasjonPanel);
