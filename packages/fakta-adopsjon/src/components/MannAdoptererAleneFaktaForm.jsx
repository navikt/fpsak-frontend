import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Container } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { required, getKodeverknavnFn } from '@fpsak-frontend/utils';
import { VerticalSpacer, FaktaGruppe } from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';

import styles from './mannAdoptererAleneFaktaForm.less';

/**
 * MannAdoptererAleneFaktaForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for vurdering av om mann adopterer alene.
 */
export const MannAdoptererAleneFaktaForm = ({
  farSokerType,
  readOnly,
  mannAdoptererAlene,
  alleKodeverk,
  alleMerknaderFraBeslutter,
}) => (
  <FaktaGruppe
    aksjonspunktCode={aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE}
    titleCode="MannAdoptererAleneFaktaForm.ApplicationInformation"
    merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE]}
  >
    <Container className={styles.container}>
      <Undertekst><FormattedMessage id="MannAdoptererAleneFaktaForm.Opplysninger" /></Undertekst>
      <VerticalSpacer fourPx />
      {farSokerType
        && <Normaltekst>{getKodeverknavnFn(alleKodeverk, kodeverkTyper)(farSokerType)}</Normaltekst>}
      <VerticalSpacer sixteenPx />
      <hr className={styles.hr} />
      <RadioGroupField name="mannAdoptererAlene" validate={[required]} bredde="XL" readOnly={readOnly} isEdited={mannAdoptererAlene}>
        <RadioOption label={{ id: 'MannAdoptererAleneFaktaForm.AdoptererAlene' }} value />
        <RadioOption label={{ id: 'MannAdoptererAleneFaktaForm.AdoptererIkkeAlene' }} value={false} />
      </RadioGroupField>
    </Container>
  </FaktaGruppe>
);

MannAdoptererAleneFaktaForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  farSokerType: kodeverkObjektPropType,
  alleKodeverk: PropTypes.shape().isRequired,
  mannAdoptererAlene: PropTypes.bool.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
};

MannAdoptererAleneFaktaForm.defaultProps = {
  farSokerType: undefined,
};

MannAdoptererAleneFaktaForm.buildInitialValues = (soknad, familiehendelse) => ({
  mannAdoptererAlene: familiehendelse ? familiehendelse.mannAdoptererAlene : undefined,
});

MannAdoptererAleneFaktaForm.transformValues = (values) => ({
  kode: aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE,
  mannAdoptererAlene: values.mannAdoptererAlene,
});

export default MannAdoptererAleneFaktaForm;
