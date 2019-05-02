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
  VerticalSpacer, ArrowBox,
} from '@fpsak-frontend/shared-components';
import {
  getEditedStatus, getFamiliehendelseGjeldende, getBehandlingType, getBarnFraTpsRelatertTilSoknad, getAksjonspunkter, getSoknadAntallBarn,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingFormValueSelector, behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FodselSammenligningPanel from 'behandlingForstegangOgRevurdering/src/components/fodselSammenligning/FodselSammenligningPanel';
import {
  required, hasValidDate, minValue, maxValue, hasValidInteger, dateBeforeOrEqualToToday,
} from '@fpsak-frontend/utils';
import {
  RadioGroupField, RadioOption, InputField, DatepickerField,
} from '@fpsak-frontend/form';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import avklartBarnFieldArray from './AvklartBarnFieldArray';
import styles from './SjekkFodselDokForm.less';

// TODO: Remove after PFP-574
const minValue1 = minValue(1);
const maxValue9 = maxValue(9);

export const AVKLARTE_BARN_FORM_NAME_PREFIX = 'avklartBarn';

export const avklarteBarnFieldArrayName = 'avklartBarn';

const createNewChildren = (antallBarnFraSoknad) => {
  let antallBarn = antallBarnFraSoknad;
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
  fodselInfo,
  dokumentasjonForeligger,
  behandlingsType,
  dirty,
  initialValues,
  submittable,
  avklartBarn,
}) => {
  if (avklartBarn === []) {
    createNewChildren(1);
  }
  return (
    <>
      <FodselSammenligningPanel />
      <FaktaGruppe
        aksjonspunktCode={aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL}
        titleCode="SjekkFodselDokForm.DokumentasjonAvFodsel"
      >
        <div className={styles.horizontalForm}>
        xxx1
          <RadioGroupField name="dokumentasjonForeligger" validate={[required]} readOnly={readOnly} isEdited={dokumentasjonForeliggerIsEdited}>
            <RadioOption label={<FormattedMessage id="SjekkFodselDokForm.DokumentasjonForeligger" />} value />
            <RadioOption label={<FormattedMessage id="SjekkFodselDokForm.DokumentasjonForeliggerIkke" />} value={false} />
          </RadioGroupField>
        </div>
        {fodselInfo && !!fodselInfo.length && dokumentasjonForeligger
      && (
        <div className={styles.clearfix}>
        xxx2
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
        xxx3
          <Column xs="12">
            <ArrowBox>
              {<FormattedMessage id="SjekkFodselDokForm.FyllInnDokumenterteOpplysninger" />}
              {!avklartBarn
              && (
              <div className={styles.fodselRow}>
              xxx4
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
    </>
  );
};

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

export const buildInitialValues = createSelector([getFamiliehendelseGjeldende, getAksjonspunkter, getSoknadAntallBarn],
  (familiehendelse, aksjonspunkter, soknadAntallBarn) => ({
    dokumentasjonForeligger: familiehendelse.dokumentasjonForeligger !== null
      ? familiehendelse.dokumentasjonForeligger : undefined,
    brukAntallBarnITps: familiehendelse.brukAntallBarnFraTps !== null
      ? familiehendelse.brukAntallBarnFraTps : undefined,
    avklartBarn: familiehendelse.avklartBarn ? addIsBarnDodt(familiehendelse.avklartBarn) : createNewChildren(soknadAntallBarn),
    ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL)),
  }));


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
// fødselinfo riktig?
const mapStateToProps = (state, ownProps) => {
  const fodselInfo = getBarnFraTpsRelatertTilSoknad(state);
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
