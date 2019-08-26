import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Container } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { injectKodeverk } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { required } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';

import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import { getEditedStatus } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';

import styles from './mannAdoptererAleneFaktaForm.less';

/**
 * MannAdoptererAleneFaktaForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for vurdering av om mann adopterer alene.
 */
export const MannAdoptererAleneFaktaFormImpl = ({
  farSokerType,
  readOnly,
  mannAdoptererAleneIsEdited,
  getKodeverknavn,
}) => (
  <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE} titleCode="MannAdoptererAleneFaktaForm.ApplicationInformation">
    <Container className={styles.container}>
      <Undertekst><FormattedMessage id="MannAdoptererAleneFaktaForm.Opplysninger" /></Undertekst>
      <VerticalSpacer fourPx />
      {farSokerType
        && <Normaltekst>{getKodeverknavn(farSokerType)}</Normaltekst>
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
  getKodeverknavn: PropTypes.func.isRequired,
};

MannAdoptererAleneFaktaFormImpl.defaultProps = {
  farSokerType: {},
  mannAdoptererAleneIsEdited: false,
};

const MannAdoptererAleneFaktaForm = connect(state => ({
  mannAdoptererAleneIsEdited: getEditedStatus(state).mannAdoptererAlene,
  ...behandlingFormValueSelector('AdopsjonInfoPanel')(state, 'farSokerType'),
}))(injectKodeverk(getAlleKodeverk)(MannAdoptererAleneFaktaFormImpl));

MannAdoptererAleneFaktaForm.buildInitialValues = (soknad, familiehendelse) => ({
  mannAdoptererAlene: familiehendelse ? familiehendelse.mannAdoptererAlene : undefined,
  farSokerType: soknad.farSokerType,
});

MannAdoptererAleneFaktaForm.transformValues = values => ({
  kode: aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE,
  mannAdoptererAlene: values.mannAdoptererAlene,
});

export default MannAdoptererAleneFaktaForm;
