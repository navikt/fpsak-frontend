import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { formPropTypes, FieldArray } from 'redux-form';
import { createSelector } from 'reselect';

import { Row, Column } from 'nav-frontend-grid';

import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import {
  RadioGroupField, RadioOption,
 DatepickerField, InputField,
} from '@fpsak-frontend/form';
import {
  VerticalSpacer, ElementWrapper, ArrowBox,
} from '@fpsak-frontend/shared-components';

import {
  required, hasValidDate,
} from '@fpsak-frontend/utils';
import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';
import FodselSammenligningPanel from 'behandlingForstegangOgRevurdering/src/components/fodselSammenligning/FodselSammenligningPanel';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  getEditedStatus, getSoknad, getFamiliehendelseGjeldende, getAksjonspunkter, getSoknadAntallBarn,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import {
 alleBarn, addIsBarnDodt, createNewChildren, avklarteBarnFieldArrayName,
} from './SjekkFodselDokForm';
import avklartBarnFieldArray from './AvklartBarnFieldArray';

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
  avklartBarn,
  dirty,
  initialValues,
  submittable,
}) => (
  <ElementWrapper>
    <FodselSammenligningPanel />
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
                  <div className={styles.horizontalForm}>
                    <DatepickerField
                      name="termindato"
                      label={{ id: `${prematurukerDokFormName}.Termindato` }}
                      validate={[required, hasValidDate]}
                      readOnly={readOnly}
                      isEdited={isTerminDatoEdited}
                    />
                    <div className={styles.marginLeft}>
                      <FieldArray
                        name={avklarteBarnFieldArrayName}
                        component={avklartBarnFieldArray}
                        readOnly={readOnly}
                        avklartBarn={avklartBarn}
                      />
                    </div>
                  </div>
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
  dokumentasjonForeligger: PropTypes.bool,
  isDokumentasjonForeliggerEdited: PropTypes.bool,
  isTerminDatoEdited: PropTypes.bool,
  avklartBarn: PropTypes.arrayOf(PropTypes.shape()),
  submittable: PropTypes.bool.isRequired,
  ...formPropTypes,
};

PrematurukerDokForm.defaultProps = {
  isTerminDatoEdited: false,
  isDokumentasjonForeliggerEdited: false,
  isAntallBarnEdited: false,
  avklartBarn: [],
};

export const buildInitialValues = createSelector([getSoknad, getFamiliehendelseGjeldende, getAksjonspunkter, getSoknadAntallBarn],
  (soknad, familiehendelse, aksjonspunkter, soknadAntallBarn) => {
    const antallBarn = soknad.antallBarn ? soknad.antallBarn : NaN;

    return {
      termindato: familiehendelse.termindato ? familiehendelse.termindato : soknad.termindato,
      avklartBarn: (familiehendelse.avklartBarn && familiehendelse.avklartBarn.length > 0)
        ? addIsBarnDodt(familiehendelse.avklartBarn) : createNewChildren(soknadAntallBarn || 0),
      dokumentasjonForeligger: familiehendelse.dokumentasjonForeligger !== null
        ? familiehendelse.dokumentasjonForeligger : undefined,
      ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_TERMIN_VED_TIDLIG_FØDSEL)),
    };
});

const transformValues = values => ({
  kode: aksjonspunktCodes.VURDER_TERMIN_VED_TIDLIG_FØDSEL,
  dokumentasjonForeligger: values.dokumentasjonForeligger,
  termindato: values.termindato,
  dødsdato: values.dødsdato,
  uidentifiserteBarn: alleBarn(values.avklartBarn),
  ...FaktaBegrunnelseTextField.transformValues(values),
});


const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = values => ownProps.submitHandler(transformValues(values));

  return state => ({
      onSubmit,
      initialValues: buildInitialValues(state),
      isTerminDatoEdited: getEditedStatus(state).termindato,
      isDokumentasjonForeliggerEdited: getEditedStatus(state).dokumentasjonForeligger,
      isOverridden: getFamiliehendelseGjeldende(state).erOverstyrt,
      avklartBarn: behandlingFormValueSelector(prematurukerDokFormName)(state, 'avklartBarn'),
      dokumentasjonForeligger: behandlingFormValueSelector(prematurukerDokFormName)(state, 'dokumentasjonForeligger'),
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: prematurukerDokFormName,
})(PrematurukerDokForm));
