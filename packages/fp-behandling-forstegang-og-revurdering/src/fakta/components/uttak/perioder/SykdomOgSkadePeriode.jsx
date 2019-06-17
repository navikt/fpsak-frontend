import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FieldArray } from 'redux-form';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import overforingArsakCodes from '@fpsak-frontend/kodeverk/src/overforingArsakCodes';
import uttakPeriodeVurdering from '@fpsak-frontend/kodeverk/src/uttakPeriodeVurdering';
import {
  FlexContainer, FlexRow, FlexColumn, VerticalSpacer, ArrowBox,
} from '@fpsak-frontend/shared-components';
import { RadioOption, RadioGroupField, TextAreaField } from '@fpsak-frontend/form';
import {
  required, maxLength, minLength, hasValidPeriod, hasValidText,
} from '@fpsak-frontend/utils';

import { getFamiliehendelseGjeldende, doesVilkarForSykdomOppfyltExist } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormSyncErrors } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import PerioderKnapper from './PerioderKnapper';
import DokumentertePerioderPeriodePicker from './DokumentertePerioderPeriodePicker';

import styles from './periodeTyper.less';

const minLength3 = minLength(3);
const maxLength4000 = maxLength(4000);

// TODO slå sammen ForeldreAnsvarPeriode, SykdomOgSkadePeriode og InnleggelsePeriode

export const SykdomOgSkadePeriode = ({
  resultat,
  fraDato,
  tilDato,
  id,
  cancelEditPeriode,
  updated,
  bekreftet,
  readOnly,
  dokumentertePerioder,
  formSyncErrors,
  behandlingStatusKode,
  ...formProps
}) => {
  let errorHeight = 0;

  if (
    Object.keys(formSyncErrors).length !== 0
    && formProps.submitFailed
    && (formSyncErrors.dokumentertePerioder.length - 1) > 0) {
    formSyncErrors.dokumentertePerioder.forEach((error) => {
      errorHeight += error !== undefined && error.fom[0].id === 'ValidationMessage.NotEmpty' ? 30 : 52;
    });
  }

  const isEdited = resultat === uttakPeriodeVurdering.PERIODE_OK_ENDRET
  && readOnly && behandlingStatusKode === behandlingStatus.FATTER_VEDTAK;

  // const periodeOkDisabled = !bekreftet;

  const inlineheight = dokumentertePerioder
    && resultat === uttakPeriodeVurdering.PERIODE_OK
    && !readOnly
    ? (dokumentertePerioder.length * 58) + errorHeight + 170 : 'auto';

  const inlineStyle = {
    radioOption: {
      height: inlineheight,
    },
  };
  return (
    <FlexContainer wrap>
      {formProps.error}
      <FlexRow wrap>
        <FlexColumn className={styles.fieldColumn}>
          <Undertekst>
            <FormattedMessage id="UttakInfoPanel.FastsettResultat" />
          </Undertekst>
          <VerticalSpacer fourPx />
          <RadioGroupField
            direction="vertical"
            name="resultat"
            bredde="M"
            validate={[required]}
            readOnly={readOnly}
            isEdited={isEdited}
          >
            <RadioOption
              label={{ id: 'UttakInfoPanel.SykdomSkadenDokumentertAngiAvklartPeriode' }}
              value={uttakPeriodeVurdering.PERIODE_OK}
              style={inlineStyle.radioOption}
            />
            <RadioOption
              label={{ id: 'UttakInfoPanel.SykdomSkadenIkkeDokumentert' }}
              value={uttakPeriodeVurdering.PERIODE_KAN_IKKE_AVKLARES}
            />
          </RadioGroupField>
          {resultat === uttakPeriodeVurdering.PERIODE_OK && !readOnly && (
          <div className={styles.addPeriodeSykdom}>
            <ArrowBox>
              <FieldArray
                name="dokumentertePerioder"
                component={DokumentertePerioderPeriodePicker}
                props={{ fraDato, tilDato, readOnly }}
              />
            </ArrowBox>
          </div>
          )}
          <VerticalSpacer twentyPx />
          <div className={styles.textAreaStyle}>
            <TextAreaField
              name="begrunnelse"
              label={{ id: 'UttakInfoPanel.Vurdering' }}
              readOnly={readOnly}
              validate={[required, minLength3, maxLength4000, hasValidText]}
              textareaClass={styles.textAreaStyle}
              maxLength={4000}
            />
          </div>
        </FlexColumn>
      </FlexRow>
      <FlexRow>
        <FlexColumn>
          <PerioderKnapper
            resultat={resultat}
            updatePeriode={formProps.handleSubmit}
            resetPeriode={formProps.reset}
            updated={updated}
            bekreftet={bekreftet}
            cancelEditPeriode={cancelEditPeriode}
            id={id}
            readOnly={readOnly}
          />
        </FlexColumn>
      </FlexRow>
    </FlexContainer>
  );
};

SykdomOgSkadePeriode.propTypes = {
  resultat: PropTypes.string,
  updatePeriode: PropTypes.func.isRequired,
  cancelEditPeriode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  updated: PropTypes.bool.isRequired,
  bekreftet: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  dokumentertePerioder: PropTypes.arrayOf(PropTypes.shape()),
  fraDato: PropTypes.string.isRequired,
  tilDato: PropTypes.string.isRequired,
  utsettelseArsak: PropTypes.shape().isRequired,
  overforingArsak: PropTypes.shape().isRequired,
  formSyncErrors: PropTypes.shape(),
  behandlingStatusKode: PropTypes.string,
};

SykdomOgSkadePeriode.defaultProps = {
  dokumentertePerioder: [{}],
  formSyncErrors: {},
  resultat: undefined,
  behandlingStatusKode: undefined,
};

const validateSykdomOgSkadeForm = (
  values,
  familieHendelse,
  utsettelseArsak,
  overforingArsak,
  vilkarForSykdomOppfyltExists,
) => {
  const errors = {};
  const morForSykVedFodsel = familieHendelse.morForSykVedFodsel
    ? [uttakPeriodeVurdering.PERIODE_OK, uttakPeriodeVurdering.PERIODE_OK_ENDRET]
    : [uttakPeriodeVurdering.PERIODE_KAN_IKKE_AVKLARES];

  if (overforingArsak.kode === overforingArsakCodes.SYKDOM_ANNEN_FORELDER
    && !morForSykVedFodsel.includes(values.resultat)
    && vilkarForSykdomOppfyltExists) {
    errors.resultat = values.resultat ? [{ id: 'UttakInfoPanel.IkkeDokumentertSykdom' }] : [{ id: 'UttakInfoPanel.DokumentertSykdom' }];
  }

  errors.dokumentertePerioder = [];
  if (values.dokumentertePerioder) {
    values.dokumentertePerioder.forEach((periode, index) => {
      const invalid = required(periode.fom) || hasValidPeriod(periode.fom, periode.tom);
      if (invalid) {
        errors.dokumentertePerioder[index] = {
          fom: invalid,
        };
      }
    });
  }
  return errors;
};

const buildInitialValues = createSelector([
  (state, ownProps) => behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.begrunnelse`),
  (state, ownProps) => behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.resultat`),
  (state, ownProps) => behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.dokumentertePerioder`),
  (state, ownProps) => ownProps.id],
  (begrunnelse, initialResultat, initialDokumentertePerioder, id) => ({
    begrunnelse,
    id,
    resultat: initialResultat ? initialResultat.kode : undefined,
    dokumentertePerioder: initialDokumentertePerioder !== undefined ? initialDokumentertePerioder : [],
  }));


const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const formName = `sykdomOgSkadeForm-${initialOwnProps.id}`;
  const familiehendelse = getFamiliehendelseGjeldende(initialState);
  const vilkarForSykdomExists = doesVilkarForSykdomOppfyltExist(initialState);
  const validate = values => validateSykdomOgSkadeForm(values, familiehendelse, initialOwnProps.utsettelseArsak,
    initialOwnProps.overforingArsak, vilkarForSykdomExists);
  const onSubmit = values => initialOwnProps.updatePeriode((values));

  return (state, ownProps) => ({
    onSubmit,
    validate,
    formSyncErrors: getBehandlingFormSyncErrors(formName)(state),
    dokumentertePerioder: behandlingFormValueSelector(formName)(state, 'dokumentertePerioder'),
    resultat: behandlingFormValueSelector(formName)(state, 'resultat'),
    initialValues: buildInitialValues(state, ownProps),
    updated: behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.updated`),
    bekreftet: behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.bekreftet`),
    form: formName,
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  enableReinitialize: true,
})(SykdomOgSkadePeriode));
