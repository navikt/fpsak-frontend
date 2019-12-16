import React from 'react';
import PropTypes from 'prop-types';
import { FormSection } from 'redux-form';
import { Column, Row } from 'nav-frontend-grid';

import foreldreType from '@fpsak-frontend/kodeverk/src/foreldreType';
import {
  SoknadData, OppholdINorgePanel, RettigheterPanel, TilleggsopplysningerPanel, AnnenForelderPanel, OmsorgOgAdopsjonPanel, TerminFodselDatoPanel,
} from '@fpsak-frontend/papirsoknad-felles';

/*
 * RegistreringFodselForm
 *
 * Form som brukes for registrering av fodsel.
 *
 */
const annenForelderFormNamePrefix = 'annenForelder';
const OMSORG_FORM_NAME_PREFIX = 'omsorg';

const RegistreringFodselGrid = ({
  readOnly,
  form,
  soknadData,
  alleKodeverk,
}) => (
  <Row>
    <Column xs="6">
      { soknadData.getForeldreType() !== foreldreType.MOR
        && <RettigheterPanel readOnly={readOnly} soknadData={soknadData} />}
      <OppholdINorgePanel form={form} readOnly={readOnly} soknadData={soknadData} alleKodeverk={alleKodeverk} />
      <TilleggsopplysningerPanel readOnly={readOnly} />
    </Column>
    <Column xs="6">
      { soknadData.getForeldreType() !== foreldreType.MOR
        && (
        <FormSection name={OMSORG_FORM_NAME_PREFIX}>
          <OmsorgOgAdopsjonPanel
            form={form}
            namePrefix={OMSORG_FORM_NAME_PREFIX}
            readOnly={readOnly}
            familieHendelseType={soknadData.getFamilieHendelseType()}
            isForeldrepengerFagsak={false}
          />
        </FormSection>
        )}
      <TerminFodselDatoPanel readOnly={readOnly} form={form} />
      <FormSection name={annenForelderFormNamePrefix}>
        <AnnenForelderPanel
          soknadData={soknadData}
          namePrefix={annenForelderFormNamePrefix}
          form={form}
          readOnly={readOnly}
          alleKodeverk={alleKodeverk}
        />
      </FormSection>
    </Column>
  </Row>
);

RegistreringFodselGrid.propTypes = {
  form: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

RegistreringFodselGrid.defaultProps = {
  readOnly: true,
};

RegistreringFodselGrid.initialValues = {
  ...OppholdINorgePanel.initialValues,
  [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.initialValues,
};

RegistreringFodselGrid.validate = (values, sokerPersonnummer) => ({
  ...OppholdINorgePanel.validate(values),
  ...TerminFodselDatoPanel.validate(values),
  [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.validate(values[OMSORG_FORM_NAME_PREFIX], values.rettigheter, values.foedselsDato),
  [annenForelderFormNamePrefix]: AnnenForelderPanel.validate(sokerPersonnummer, values[annenForelderFormNamePrefix]),
});

export default RegistreringFodselGrid;
