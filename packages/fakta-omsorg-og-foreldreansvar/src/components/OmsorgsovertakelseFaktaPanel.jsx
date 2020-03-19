import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { DatepickerField, InputField } from '@fpsak-frontend/form';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import { FaktaGruppe } from '@fpsak-frontend/shared-components';

/**
 * OmsorgsovertakelseFaktaPanel
 */
const OmsorgsovertakelseFaktaPanel = ({
  readOnly,
  erAksjonspunktForeldreansvar,
  editedStatus,
  alleMerknaderFraBeslutter,
}) => (
  <FaktaGruppe
    aksjonspunktCode={aksjonspunktCodes.OMSORGSOVERTAKELSE}
    titleCode={erAksjonspunktForeldreansvar ? 'OmsorgOgForeldreansvarFaktaForm.ForeldreansvarInfo' : 'OmsorgOgForeldreansvarFaktaForm.OmsorgInfo'}
    merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.OMSORGSOVERTAKELSE]}
  >
    <Row>
      <Column xs={erAksjonspunktForeldreansvar ? '4' : '8'}>
        <DatepickerField
          name="omsorgsovertakelseDato"
          label={{ id: 'OmsorgOgForeldreansvarFaktaForm.OmsorgsovertakelseDate' }}
          validate={[required, hasValidDate]}
          readOnly={readOnly}
          isEdited={editedStatus.omsorgsovertakelseDato}
        />
      </Column>
      {erAksjonspunktForeldreansvar
        && (
        <Column xs="4">
          <DatepickerField
            name="foreldreansvarDato"
            label={{ id: 'OmsorgOgForeldreansvarFaktaForm.ForeldreansvarDato' }}
            validate={[required, hasValidDate]}
            readOnly={readOnly}
          />
        </Column>
        )}
      <Column xs="4">
        <InputField
          name="antallBarn"
          label={{ id: 'OmsorgOgForeldreansvarFaktaForm.NrOfChildren' }}
          bredde="XS"
          parse={(value) => {
            const parsedValue = parseInt(value, 10);
            return Number.isNaN(parsedValue) ? value : parsedValue;
          }}
          readOnly={readOnly}
          isEdited={editedStatus.antallBarnOmsorgOgForeldreansvar}
        />
      </Column>
    </Row>
  </FaktaGruppe>
);

OmsorgsovertakelseFaktaPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erAksjonspunktForeldreansvar: PropTypes.bool.isRequired,
  editedStatus: PropTypes.shape({
    omsorgsovertakelseDato: PropTypes.bool.isRequired,
    antallBarnOmsorgOgForeldreansvar: PropTypes.bool.isRequired,
  }).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
};

const getAntallBarn = (soknad, familiehendelse) => {
  const antallBarn = soknad.antallBarn ? soknad.antallBarn : NaN;
  return familiehendelse.antallBarnTilBeregning ? familiehendelse.antallBarnTilBeregning : antallBarn;
};

OmsorgsovertakelseFaktaPanel.buildInitialValues = (soknad, familiehendelse) => ({
  omsorgsovertakelseDato: familiehendelse && familiehendelse.omsorgsovertakelseDato ? familiehendelse.omsorgsovertakelseDato : soknad.omsorgsovertakelseDato,
  foreldreansvarDato: familiehendelse.foreldreansvarDato,
  antallBarn: getAntallBarn(soknad, familiehendelse),
});

export default OmsorgsovertakelseFaktaPanel;
