import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Column, Row } from 'nav-frontend-grid';

import { getEditedStatus } from 'behandling/behandlingSelectors';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { DatepickerField, InputField } from 'form/Fields';
import { hasValidDate, required } from 'utils/validation/validators';
import FaktaGruppe from 'fakta/components/FaktaGruppe';

/**
 * OmsorgsovertakelseFaktaPanel
 */
const OmsorgsovertakelseFaktaPanelImpl = ({
  readOnly,
  erAksjonspunktForeldreansvar,
  omsorgsovertakelseDatoIsEdited,
  antallBarnIsEdited,
}) => (
  <FaktaGruppe
    aksjonspunktCode={aksjonspunktCodes.OMSORGSOVERTAKELSE}
    titleCode={erAksjonspunktForeldreansvar ? 'OmsorgOgForeldreansvarFaktaForm.ForeldreansvarInfo' : 'OmsorgOgForeldreansvarFaktaForm.OmsorgInfo'}
  >
    <Row>
      <Column xs={erAksjonspunktForeldreansvar ? '4' : '8'}>
        <DatepickerField
          name="omsorgsovertakelseDato"
          label={{ id: 'OmsorgOgForeldreansvarFaktaForm.OmsorgsovertakelseDate' }}
          validate={[required, hasValidDate]}
          readOnly={readOnly}
          isEdited={omsorgsovertakelseDatoIsEdited}
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
        )
      }
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
          isEdited={antallBarnIsEdited}
        />
      </Column>
    </Row>
  </FaktaGruppe>
);

OmsorgsovertakelseFaktaPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  erAksjonspunktForeldreansvar: PropTypes.bool.isRequired,
  omsorgsovertakelseDatoIsEdited: PropTypes.bool,
  antallBarnIsEdited: PropTypes.bool,
};

OmsorgsovertakelseFaktaPanelImpl.defaultProps = {
  omsorgsovertakelseDatoIsEdited: false,
  antallBarnIsEdited: false,
};

const mapStateToProps = state => ({
  omsorgsovertakelseDatoIsEdited: getEditedStatus(state).omsorgsovertakelseDato,
  antallBarnIsEdited: getEditedStatus(state).antallBarnOmsorgOgForeldreansvar,
});

const OmsorgsovertakelseFaktaPanel = connect(mapStateToProps)(OmsorgsovertakelseFaktaPanelImpl);

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
