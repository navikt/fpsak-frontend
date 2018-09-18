import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Container } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { getEditedStatus } from 'behandling/behandlingSelectors';
import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { required } from 'utils/validation/validators';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { RadioGroupField, RadioOption } from 'form/Fields';
import FaktaGruppe from 'fakta/components/FaktaGruppe';

import styles from './mannAdoptererFaktaForm.less';

/**
 * MannAdoptererAleneFaktaForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for vurdering av om mann adopterer alene.
 */
const MannAdoptererAleneFaktaFormImpl = ({
  farSokerType,
  readOnly,
  mannAdoptererAleneIsEdited,
}) => (
  <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE} titleCode="MannAdoptererAleneFaktaForm.ApplicationInformation">
    <Container className={styles.container}>
      <Undertekst><FormattedMessage id="MannAdoptererAleneFaktaForm.Opplysninger" /></Undertekst>
      <VerticalSpacer fourPx />
      {farSokerType.navn
        && <Normaltekst>{farSokerType.navn}</Normaltekst>
      }
      <VerticalSpacer sixteenPx />
      <hr className={styles.hr} />
      <RadioGroupField name="mannAdoptererAlene" validate={[required]} bredde="XL" readOnly={readOnly} isEdited={mannAdoptererAleneIsEdited}>
        <RadioOption label={{ id: 'MannAdoptererAleneFaktaForm.AdoptererAlene' }} value />
        <RadioOption label={{ id: 'MannAdoptererAleneFaktaForm.AdoptererIkkeAlene' }} value={false} />
      </RadioGroupField>
    </Container>
  </FaktaGruppe>
);

MannAdoptererAleneFaktaFormImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  farSokerType: PropTypes.shape(),
  mannAdoptererAleneIsEdited: PropTypes.bool,
};

MannAdoptererAleneFaktaFormImpl.defaultProps = {
  farSokerType: {},
  mannAdoptererAleneIsEdited: false,
};

const MannAdoptererAleneFaktaForm = connect(state => ({
  mannAdoptererAleneIsEdited: getEditedStatus(state).mannAdoptererAlene,
  ...behandlingFormValueSelector('AdopsjonInfoPanel')(state, 'farSokerType'),
}))(MannAdoptererAleneFaktaFormImpl);

MannAdoptererAleneFaktaForm.buildInitialValues = (soknad, familiehendelse) => ({
  mannAdoptererAlene: familiehendelse ? familiehendelse.mannAdoptererAlene : undefined,
  farSokerType: soknad.farSokerType,
});

MannAdoptererAleneFaktaForm.transformValues = values => ({
  kode: aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE,
  mannAdoptererAlene: values.mannAdoptererAlene,
});

export default MannAdoptererAleneFaktaForm;
