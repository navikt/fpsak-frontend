import React from 'react';
import PropTypes from 'prop-types';
import { FormSection } from 'redux-form';
import { Column, Row } from 'nav-frontend-grid';

import OppholdINorgePanel from 'papirsoknad/components/commonPanels/OppholdINorgePanel';
import RettigheterPanel from 'papirsoknad/components/commonPanels/rettigheter/RettigheterPanel';
import TilleggsopplysningerPanel from 'papirsoknad/components/commonPanels/TilleggsopplysningerPanel';
import AnnenForelderPanel from 'papirsoknad/components/commonPanels/AnnenForelderPanel';
import OmsorgOgAdopsjonPanel from 'papirsoknad/components/commonPanels/omsorgOgAdopsjon/OmsorgOgAdopsjonPanel';
import SoknadData from 'papirsoknad/SoknadData';


const ANNEN_FORELDER_FORM_NAME_PREFIX = 'annenForelder';
const OMSORG_FORM_NAME_PREFIX = 'omsorg';

/*
 * RegistreringAdopsjonOgOmsorgGrid
 *
 * Form som brukes vid adopsjon for tilleggsopplysninger. Containerkomponent for AnnenForelderForm
 *
 */
const RegistreringAdopsjonOgOmsorgGrid = ({
  readOnly, form, soknadData,
}) => (
  <Row>
    <Column xs="6">
      <RettigheterPanel readOnly={readOnly} soknadData={soknadData} />
      <OppholdINorgePanel form={form} readOnly={readOnly} soknadData={soknadData} />
      <TilleggsopplysningerPanel readOnly={readOnly} />
    </Column>
    <Column xs="6">
      <FormSection name={OMSORG_FORM_NAME_PREFIX}>
        <OmsorgOgAdopsjonPanel
          form={form}
          namePrefix={OMSORG_FORM_NAME_PREFIX}
          readOnly={readOnly}
          familieHendelseType={soknadData.getFamilieHendelseType()}
        />
      </FormSection>
      <FormSection name={ANNEN_FORELDER_FORM_NAME_PREFIX}>
        <AnnenForelderPanel namePrefix={ANNEN_FORELDER_FORM_NAME_PREFIX} form={form} readOnly={readOnly} />
      </FormSection>
    </Column>
  </Row>
);

RegistreringAdopsjonOgOmsorgGrid.propTypes = {
  form: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  soknadData: PropTypes.instanceOf(SoknadData).isRequired,
};

RegistreringAdopsjonOgOmsorgGrid.defaultProps = {
  readOnly: true,
};

RegistreringAdopsjonOgOmsorgGrid.initialValues = {
  [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.initialValues,
  ...OppholdINorgePanel.initialValues,
};

RegistreringAdopsjonOgOmsorgGrid.validate = (values, sokerPersonnummer) => ({
  ...OppholdINorgePanel.validate(values),
  [OMSORG_FORM_NAME_PREFIX]: OmsorgOgAdopsjonPanel.validate(values[OMSORG_FORM_NAME_PREFIX], values.rettigheter, values.foedselsDato),
  [ANNEN_FORELDER_FORM_NAME_PREFIX]: AnnenForelderPanel.validate(sokerPersonnummer, values[ANNEN_FORELDER_FORM_NAME_PREFIX]),
});

export default RegistreringAdopsjonOgOmsorgGrid;
