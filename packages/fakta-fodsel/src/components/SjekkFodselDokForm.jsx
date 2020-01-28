import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { FieldArray, formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { Column } from 'nav-frontend-grid';

import {
  isFieldEdited, behandlingForm, behandlingFormValueSelector, FaktaGruppe, FaktaBegrunnelseTextField,
} from '@fpsak-frontend/fp-felles';
import { ArrowBox, ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import FodselSammenligningIndex from '@fpsak-frontend/prosess-fakta-fodsel-sammenligning';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import avklartBarnFieldArray from './AvklartBarnFieldArray';

import styles from './SjekkFodselDokForm.less';

export const AVKLARTE_BARN_FORM_NAME_PREFIX = 'avklartBarn';

export const avklarteBarnFieldArrayName = 'avklartBarn';

const createNewChildren = (antallBarnFraSoknad) => {
  let antallBarn = antallBarnFraSoknad;
  if (antallBarn === 0 || !antallBarn) {
    antallBarn = 1;
  }
  const childrenArray = [];
  while (antallBarn > 0) {
    childrenArray.push({ fodselsdato: '', isBarnDodt: false, dodsDato: '' });
    antallBarn -= 1;
  }
  return childrenArray;
};

/**
 * FodselInfoPanel
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av manglende fødsel (Fødselsvilkåret).
 */
export const SjekkFodselDokForm = ({
  readOnly,
  dokumentasjonForeliggerIsEdited,
  dokumentasjonForeligger,
  dirty,
  initialValues,
  submittable,
  avklartBarn,
  behandlingTypeKode,
  termindato,
  vedtaksDatoSomSvangerskapsuke,
  soknad,
  soknadOriginalBehandling,
  familiehendelseOriginalBehandling,
  alleMerknaderFraBeslutter,
}) => (
  <ElementWrapper>
    <FodselSammenligningIndex
      behandlingsTypeKode={behandlingTypeKode}
      avklartBarn={avklartBarn}
      termindato={termindato}
      vedtaksDatoSomSvangerskapsuke={vedtaksDatoSomSvangerskapsuke}
      soknad={soknad}
      soknadOriginalBehandling={soknadOriginalBehandling}
      familiehendelseOriginalBehandling={familiehendelseOriginalBehandling}
    />
    <FaktaGruppe
      aksjonspunktCode={aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL}
      titleCode="SjekkFodselDokForm.DokumentasjonAvFodsel"
      merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL]}
    >
      <div className={styles.horizontalForm}>
        <RadioGroupField name="dokumentasjonForeligger" validate={[required]} readOnly={readOnly} isEdited={dokumentasjonForeliggerIsEdited}>
          <RadioOption label={<FormattedMessage id="SjekkFodselDokForm.DokumentasjonForeligger" />} value />
          <RadioOption label={<FormattedMessage id="SjekkFodselDokForm.DokumentasjonForeliggerIkke" />} value={false} />
        </RadioGroupField>
      </div>

      {dokumentasjonForeligger
      && (
        <div className={styles.clearfix}>
          <Column xs="12">
            <ArrowBox>
              <FormattedMessage id="SjekkFodselDokForm.FyllInnDokumenterteOpplysninger" />
              <FieldArray
                name={avklarteBarnFieldArrayName}
                component={avklartBarnFieldArray}
                readOnly={readOnly}
                avklartBarn={avklartBarn}
              />
            </ArrowBox>
          </Column>
        </div>
      )}
    </FaktaGruppe>
    <VerticalSpacer sixteenPx />
    <FaktaBegrunnelseTextField isDirty={dirty} isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse={!!initialValues.begrunnelse} />
  </ElementWrapper>
);

SjekkFodselDokForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  dokumentasjonForeligger: PropTypes.bool,
  avklartBarn: PropTypes.arrayOf(PropTypes.shape()),
  dokumentasjonForeliggerIsEdited: PropTypes.bool,
  submittable: PropTypes.bool.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  ...formPropTypes,
};

SjekkFodselDokForm.defaultProps = {
  dokumentasjonForeligger: undefined,
  dokumentasjonForeliggerIsEdited: false,
  avklartBarn: [],
};


const addIsBarnDodt = (avklarteBarn) => {
  const avklarteBarnMedDodFlagg = [];
  avklarteBarn.forEach((barn, index) => {
    avklarteBarnMedDodFlagg.push(barn);
    if (barn.dodsdato) {
      avklarteBarnMedDodFlagg[index].isBarnDodt = true;
    }
  });
  return avklarteBarnMedDodFlagg;
};

const allaBarn = (avklarteBarn) => {
  const komplettBarn = [];
  avklarteBarn.forEach((barn, index) => {
    komplettBarn.push(barn);
    if (!barn.isBarnDodt) {
      komplettBarn[index].dodsdato = null;
    }
  });
  return komplettBarn;
};

export const buildInitialValues = createSelector([
  (state, ownProps) => ownProps.gjeldendeFamiliehendelse,
  (state, ownProps) => ownProps.aksjonspunkt,
  (state, ownProps) => ownProps.soknad.antallBarn],
(familiehendelse, aksjonspunkt, soknadAntallBarn) => ({
  dokumentasjonForeligger: familiehendelse.dokumentasjonForeligger !== null
    ? familiehendelse.dokumentasjonForeligger : undefined,
  brukAntallBarnITps: familiehendelse.brukAntallBarnFraTps !== null
    ? familiehendelse.brukAntallBarnFraTps : undefined,
  avklartBarn: (familiehendelse.avklartBarn && familiehendelse.avklartBarn.length > 0)
    ? addIsBarnDodt(familiehendelse.avklartBarn) : createNewChildren(soknadAntallBarn || 0),
  ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkt),
}));

const getEditedStatus = createSelector(
  [(state, ownProps) => ownProps.soknad,
    (state, ownProps) => ownProps.gjeldendeFamiliehendelse,
    (state, ownProps) => ownProps.personopplysninger],
  (soknad, familiehendelse, personopplysning) => (
    isFieldEdited(soknad || {}, familiehendelse || {}, personopplysning || {})
  ),
);

const getAntallBarn = (brukAntallBarnITps, antallBarnLagret, antallBarnFraSoknad, antallBarnFraTps) => {
  if (antallBarnFraTps === 0) {
    return antallBarnLagret;
  }
  return brukAntallBarnITps ? antallBarnFraTps : antallBarnFraSoknad;
};

const transformValues = (values, antallBarnFraSoknad, antallBarnFraTps, fodselInfo) => ({
  kode: aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
  fodselsdato: values.fodselsdato,
  antallBarnFodt: values.dokumentasjonForeligger
    ? getAntallBarn(values.brukAntallBarnITps, values.antallBarnFodt, antallBarnFraSoknad, antallBarnFraTps) : undefined,
  dokumentasjonForeligger: values.dokumentasjonForeligger,
  uidentifiserteBarn: allaBarn(values.avklartBarn),
  brukAntallBarnITps: fodselInfo && !!fodselInfo.length ? values.brukAntallBarnITps : false,
  ...FaktaBegrunnelseTextField.transformValues(values),
});

export const sjekkFodselDokForm = 'SjekkFodselDokForm';

const mapStateToPropsFactory = (initialState, staticOwnProps) => {
  const fodselInfo = staticOwnProps.gjeldendeFamiliehendelse.avklartBarn;
  const onSubmit = (values) => staticOwnProps.submitHandler(transformValues(values,
    staticOwnProps.soknad.antallBarn, staticOwnProps.avklartBarn.length, fodselInfo));
  return (state, ownProps) => {
    const {
      behandlingId, behandlingVersjon, behandlingType, gjeldendeFamiliehendelse,
    } = ownProps;
    return {
      onSubmit,
      initialValues: buildInitialValues(state, ownProps),
      fodselInfo,
      avklartBarn: behandlingFormValueSelector(sjekkFodselDokForm, behandlingId, behandlingVersjon)(state, 'avklartBarn'),
      dokumentasjonForeliggerIsEdited: getEditedStatus(state, ownProps).dokumentasjonForeligger,
      dokumentasjonForeligger: behandlingFormValueSelector(sjekkFodselDokForm, behandlingId, behandlingVersjon)(state, 'dokumentasjonForeligger'),
      behandlingTypeKode: behandlingType.kode,
      termindato: gjeldendeFamiliehendelse.termindato,
      vedtaksDatoSomSvangerskapsuke: gjeldendeFamiliehendelse.vedtaksDatoSomSvangerskapsuke,
    };
  };
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: sjekkFodselDokForm,
})(SjekkFodselDokForm));
