import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Container } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { connect } from 'react-redux';

import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { RadioGroupField, RadioOption } from 'form/Fields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import { required } from 'utils/validation/validators';
import { getEditedStatus } from 'behandling/behandlingSelectors';

import styles from './ektefelleFaktaForm.less';

/**
 * EktefelleFaktaForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for vurdering av om det er ektefelles barn som adopteres.
 */
export const EktefelleFaktaForm = ({
  readOnly,
  ektefellesBarnIsEdited,
}) => (
  <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN} titleCode="EktefelleFaktaForm.ApplicationInformation">
    <Container className={styles.container}>
      <Normaltekst><FormattedMessage id="EktefelleFaktaForm.EktefellesBarn" /></Normaltekst>
      <VerticalSpacer twentyPx />
      <hr className={styles.hr} />
      <RadioGroupField name="ektefellesBarn" validate={[required]} bredde="XL" readOnly={readOnly} isEdited={ektefellesBarnIsEdited}>
        <RadioOption value={false} label={{ id: 'EktefelleFaktaForm.ErIkkeValg' }} />
        <RadioOption value label={{ id: 'EktefelleFaktaForm.ErValg' }} />
      </RadioGroupField>
    </Container>
  </FaktaGruppe>
);

EktefelleFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  ektefellesBarnIsEdited: PropTypes.bool,
};

EktefelleFaktaForm.defaultProps = {
  ektefellesBarnIsEdited: false,
};

EktefelleFaktaForm.buildInitialValues = familiehendelse => ({
  ektefellesBarn: familiehendelse && familiehendelse.ektefellesBarn !== null
    ? familiehendelse.ektefellesBarn
    : undefined,
});

EktefelleFaktaForm.transformValues = values => ({
  kode: aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN,
  ektefellesBarn: values.ektefellesBarn,
});

const mapStateToProps = state => ({
  ektefellesBarnIsEdited: getEditedStatus(state).ektefellesBarn,
});

export default connect(mapStateToProps)(EktefelleFaktaForm);
