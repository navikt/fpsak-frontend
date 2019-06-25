import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';

import { Row, Column } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import {
  RadioGroupField, RadioOption,
 DatepickerField, InputField,
} from '@fpsak-frontend/form';
import {
  DateLabel, VerticalSpacer, ElementWrapper, ArrowBox,
} from '@fpsak-frontend/shared-components';

import {
  required, hasValidDate, minValue, maxValue, hasValidInteger,
} from '@fpsak-frontend/utils';
import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  getEditedStatus, getSoknad, getFamiliehendelseGjeldende, getAksjonspunkter,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';

import styles from './prematurukerDokForm.less';

export const prematurukerDokFormName = 'PrematurukerDokForm';

/**
 * PrematurukerDokForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av termindato ved for tidlig fødsel (Fødselsvilkåret).
 */
export const PrematurukerDokForm = ({
  readOnly,
  isTerminDatoEdited,
  dokumentasjonForeligger,
  isDokumentasjonForeliggerEdited,
  dirty,
  initialValues,
  isOverridden,
  submittable,
}) => (
  <ElementWrapper>
    <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.VURDER_TERMIN_VED_TIDLIG_FØDSEL} titleCode="PrematurukerDokForm.ApplicationInformation">
      <Row>
        <Column xs="12">
          <div className={styles.horizontalForm}>
            <RadioGroupField name="dokumentasjonForeligger" validate={[required]} readOnly={readOnly} isEdited={isDokumentasjonForeliggerEdited}>
              <RadioOption label={<FormattedMessage id="PrematurukerDokForm.DokumentasjonForeligger" />} value />
              <RadioOption label={<FormattedMessage id="PrematurukerDokForm.DokumentasjonForeliggerIkke" />} value={false} />
            </RadioGroupField>
          </div>
        </Column>
        <Column>
          {dokumentasjonForeligger && (
            <div>
              <Column xs="12">
                <ArrowBox>
                  {<FormattedMessage id="PrematurukerDokForm.FyllInnDokumenterteOpplysninger" />}
                  <DatepickerField
                    name="termindato"
                    label={{ id: `${prematurukerDokFormName}.Termindato` }}
                    validate={[required, hasValidDate]}
                    readOnly={readOnly}
                    isEdited={isTerminDatoEdited}
                  />
                </ArrowBox>
              </Column>
            </div>
          )}

        </Column>
      </Row>
    </FaktaGruppe>
    <VerticalSpacer sixteenPx />
    <FaktaBegrunnelseTextField isDirty={dirty} isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse={!!initialValues.begrunnelse} />
  </ElementWrapper>
);

PrematurukerDokForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  dokumentasjonForeligger: PropTypes.bool.isRequired,
  isDokumentasjonForeliggerEdited: PropTypes.bool,
  isTerminDatoEdited: PropTypes.bool,
  isOverridden: PropTypes.bool,
  submittable: PropTypes.bool.isRequired,
  ...formPropTypes,
};

PrematurukerDokForm.defaultProps = {
  isTerminDatoEdited: false,
  isOverridden: false,
  isDokumentasjonForeliggerEdited: false,
};

export const buildInitialValues = createSelector([getSoknad, getFamiliehendelseGjeldende, getAksjonspunkter], (soknad, familiehendelse, aksjonspunkter) => ({
    termindato: familiehendelse.termindato ? familiehendelse.termindato : soknad.termindato,
    dokumentasjonForeligger: familiehendelse.dokumentasjonForeligger !== null
      ? familiehendelse.dokumentasjonForeligger : undefined,
    ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_TERMIN_VED_TIDLIG_FØDSEL)),
  }));

const transformValues = values => ({
  kode: aksjonspunktCodes.VURDER_TERMIN_VED_TIDLIG_FØDSEL,
  dokumentasjonForeligger: values.dokumentasjonForeligger,
  termindato: values.termindato,
  ...FaktaBegrunnelseTextField.transformValues(values),
});


const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = values => ownProps.submitHandler(transformValues(values));

  return (state) => {
    const termindato = behandlingFormValueSelector(prematurukerDokFormName)(state, 'termindato');

    return {
      onSubmit,
      initialValues: buildInitialValues(state),
      isTerminDatoEdited: getEditedStatus(state).termindato,
      isDokumentasjonForeliggerEdited: getEditedStatus(state).dokumentasjonForeligger,
      isOverridden: getFamiliehendelseGjeldende(state).erOverstyrt,
      dokumentasjonForeligger: behandlingFormValueSelector(prematurukerDokFormName)(state, 'dokumentasjonForeligger'),
    };
  };
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: prematurukerDokFormName,
})(PrematurukerDokForm));
