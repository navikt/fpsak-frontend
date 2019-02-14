import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { formPropTypes, FieldArray } from 'redux-form';
import { createSelector } from 'reselect';
import { Undertekst } from 'nav-frontend-typografi';
import { Column } from 'nav-frontend-grid';

import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import {
  ElementWrapper, VerticalSpacer, ArrowBox,
} from '@fpsak-frontend/shared-components';
import {
  getEditedStatus, getFamiliehendelse, getBehandlingType, getBarnFraTpsRelatertTilSoknad,
  getPersonopplysning, getAksjonspunkter, getSoknadAntallBarn,
} from 'behandlingFpsak/src/behandlingSelectors';
import { behandlingFormValueSelector, behandlingForm } from 'behandlingFpsak/src/behandlingForm';
import FodselSammenligningPanel from 'behandlingFpsak/src/components/fodselSammenligning/FodselSammenligningPanel';
import {
  required, hasValidDate, minValue, maxValue, hasValidInteger, dateBeforeOrEqualToToday,
} from '@fpsak-frontend/utils';
import {
  RadioGroupField, RadioOption, InputField, DatepickerField,
} from '@fpsak-frontend/form';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import FaktaGruppe from 'behandlingFpsak/src/fakta/components/FaktaGruppe';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import avklartBarnFieldArray from './AvklartBarnFieldArray';
import styles from './SjekkFodselDokForm.less';

// TODO: Remove after PFP-574
const minValue1 = minValue(1);
const maxValue9 = maxValue(9);

export const AVKLARTE_BARN_FORM_NAME_PREFIX = 'avklartBarn';

export const avklarteBarnFieldArrayName = 'avklartBarn';

/**
 * FodselInfoPanel
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av manglende fødsel (Fødselsvilkåret).
 */
export const SjekkFodselDokForm = ({
  readOnly,
  dokumentasjonForeliggerIsEdited,
  fodselInfo,
  dokumentasjonForeligger,
  behandlingsType,
  dirty,
  initialValues,
  submittable,
  avklartBarn,
}) => (
  <ElementWrapper>
    <FodselSammenligningPanel />
    <FaktaGruppe
      aksjonspunktCode={aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL}
      titleCode="SjekkFodselDokForm.DokumentasjonAvFodsel"
    >
      <div className={styles.horizontalForm}>
        <RadioGroupField name="dokumentasjonForeligger" validate={[required]} readOnly={readOnly} isEdited={dokumentasjonForeliggerIsEdited}>
          <RadioOption label={<FormattedMessage id="SjekkFodselDokForm.DokumentasjonForeligger" />} value />
          <RadioOption label={<FormattedMessage id="SjekkFodselDokForm.DokumentasjonForeliggerIkke" />} value={false} />
        </RadioGroupField>
      </div>
      {fodselInfo && !!fodselInfo.length && dokumentasjonForeligger
      && (
        <div className={styles.clearfix}>
          <Column xs="6">
            <ArrowBox>
              <Undertekst>{<FormattedMessage id="SjekkFodselDokForm.FastsettAntallBarn" />}</Undertekst>
              <div className={styles.horizontalForm}>
                <RadioGroupField name="brukAntallBarnITps" validate={[required]} readOnly={readOnly}>
                  <RadioOption
                    label={behandlingsType.kode !== behandlingType.REVURDERING
                      ? <FormattedMessage id="SjekkFodselDokForm.BrukAntallISoknad" />
                      : <FormattedMessage id="SjekkFodselDokForm.BrukAntallIYtelsesvedtaket" />}
                    value={false}
                  />
                  <RadioOption label={<FormattedMessage id="SjekkFodselDokForm.BrukAntallITPS" />} value />
                </RadioGroupField>
              </div>
            </ArrowBox>
          </Column>
        </div>
      )
      }
      {(!fodselInfo || !fodselInfo.length) && dokumentasjonForeligger
      && (
        <div className={styles.clearfix}>
          <Column xs="12">
            <ArrowBox>
              {<FormattedMessage id="SjekkFodselDokForm.FyllInnDokumenterteOpplysninger" />}
              {!avklartBarn
              && (
              <div className={styles.fodselRow}>
                <Column xs="5" className={styles.datePickerField}>
                  <DatepickerField
                    name="fodselsdato"
                    label={<FormattedMessage id="SjekkFodselDokForm.Fodselsdato" />}
                    validate={[required, hasValidDate, dateBeforeOrEqualToToday]}
                    readOnly={readOnly}
                  />
                </Column>
                <Column xs="1" />
                <Column xs="6">
                  <InputField
                    name="antallBarnFodt"
                    label={<FormattedMessage id="SjekkFodselDokForm.AntallBarnFodt" />}
                    parse={(value) => {
                      const parsedValue = parseInt(value, 10);
                      return Number.isNaN(parsedValue) ? value : parsedValue;
                    }}
                    validate={[required, hasValidInteger, minValue1, maxValue9]}
                    readOnly={readOnly}
                    bredde="XS"
                    className={styles.revurderingInput}
                  />
                </Column>
              </div>
              )
              }
              {avklartBarn && (
                <FieldArray
                  name={avklarteBarnFieldArrayName}
                  component={avklartBarnFieldArray}
                  readOnly={readOnly}
                  avklartBarn={avklartBarn}
                />
              )
              }
            </ArrowBox>
          </Column>
        </div>
      )
      }
    </FaktaGruppe>
    <VerticalSpacer sixteenPx />
    <FaktaBegrunnelseTextField isDirty={dirty} isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse={!!initialValues.begrunnelse} />
  </ElementWrapper>
);

SjekkFodselDokForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  dokumentasjonForeligger: PropTypes.bool,
  fodselInfo: PropTypes.arrayOf(PropTypes.shape()),
  behandlingsType: PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  }),
  avklartBarn: PropTypes.arrayOf(PropTypes.shape()),
  dokumentasjonForeliggerIsEdited: PropTypes.bool,
  submittable: PropTypes.bool.isRequired,
  ...formPropTypes,
};

SjekkFodselDokForm.defaultProps = {
  dokumentasjonForeligger: undefined,
  fodselInfo: [],
  dokumentasjonForeliggerIsEdited: false,
  behandlingsType: {
    kode: '',
    navn: '',
  },
  avklartBarn: undefined,
};

const createNewChildren = (antallBarnFraSoknad) => {
  let antallBarn = antallBarnFraSoknad;
  const childrenArray = [];
  while (antallBarn > 0) {
    childrenArray.push({ fodselsdato: '', barnDod: false, dodsDato: '' });
    antallBarn -= 1;
  }
  return childrenArray;
};
/*
export const buildInitialValues = createSelector([getFamiliehendelse, getAksjonspunkter], (familiehendelse, aksjonspunkter) => ({
  fodselsdato: familiehendelse.fodselsdato ? familiehendelse.fodselsdato : null,
  antallBarnFodt: familiehendelse.antallBarnFodsel ? familiehendelse.antallBarnFodsel : null,
  dokumentasjonForeligger: familiehendelse.dokumentasjonForeligger !== null
    ? familiehendelse.dokumentasjonForeligger : undefined,
  brukAntallBarnITps: familiehendelse.brukAntallBarnFraTps !== null
    ? familiehendelse.brukAntallBarnFraTps : undefined,
  ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL)),
})); */

export const buildInitialValues = createSelector([getFamiliehendelse, getAksjonspunkter, getSoknadAntallBarn],
  (familiehendelse, aksjonspunkter, soknadAntallBarn) => {
    if (familiehendelse.avklartBarn && familiehendelse.avklartBarn !== null) {
      return ({
        dokumentasjonForeligger: familiehendelse.dokumentasjonForeligger !== null
          ? familiehendelse.dokumentasjonForeligger : undefined,
        brukAntallBarnITps: familiehendelse.brukAntallBarnFraTps !== null
          ? familiehendelse.brukAntallBarnFraTps : undefined,
        avklartBarn: familiehendelse.avklartBarn ? familiehendelse.avklartBarn : createNewChildren(soknadAntallBarn),
        ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL)),
      });
    }
    // TODO: remove when 574 is in place
    return ({
      fodselsdato: familiehendelse.fodselsdato ? familiehendelse.fodselsdato : null,
      antallBarnFodt: familiehendelse.antallBarnFodsel ? familiehendelse.antallBarnFodsel : null,
      dokumentasjonForeligger: familiehendelse.dokumentasjonForeligger !== null
        ? familiehendelse.dokumentasjonForeligger : undefined,
      brukAntallBarnITps: familiehendelse.brukAntallBarnFraTps !== null
        ? familiehendelse.brukAntallBarnFraTps : undefined,
      ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL)),
    });
  });


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
  uidentifiserteBarn: values.avklartBarn,
  brukAntallBarnITps: fodselInfo && !!fodselInfo.length ? values.brukAntallBarnITps : false,
  ...FaktaBegrunnelseTextField.transformValues(values),
});

export const sjekkFodselDokForm = 'SjekkFodselDokForm';

const mapStateToProps = (state, ownProps) => {
  const fodselInfo = getPersonopplysning(state).barnFraTpsRelatertTilSoknad;
  return {
    initialValues: buildInitialValues(state),
    onSubmit: values => ownProps.submitHandler(transformValues(values,
      getSoknadAntallBarn(state), getBarnFraTpsRelatertTilSoknad(state).length, fodselInfo)),
    fodselInfo,
    avklartBarn: behandlingFormValueSelector(sjekkFodselDokForm)(state, 'avklartBarn'),
    dokumentasjonForeliggerIsEdited: getEditedStatus(state).dokumentasjonForeligger,
    dokumentasjonForeligger: behandlingFormValueSelector(sjekkFodselDokForm)(state, 'dokumentasjonForeligger'),
    behandlingsType: getBehandlingType(state),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: sjekkFodselDokForm,
})(SjekkFodselDokForm));
