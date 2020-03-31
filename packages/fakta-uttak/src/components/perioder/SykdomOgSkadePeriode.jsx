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
  ArrowBox, FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import {
  RadioGroupField, RadioOption, TextAreaField, behandlingForm, behandlingFormValueSelector, getBehandlingFormSyncErrors,
} from '@fpsak-frontend/form';
import {
  hasValidPeriod, hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';

import PerioderKnapper from './PerioderKnapper';
import DokumentertePerioderPeriodePicker from './DokumentertePerioderPeriodePicker';

import styles from './periodeTyper.less';

const minLength3 = minLength(3);
const maxLength4000 = maxLength(4000);

const finnTextTilRadio1 = (erHeimevern, erNavTiltak) => {
  if (erHeimevern) {
    return 'SykdomOgSkadePeriode.HeimevernetErDok';
  }
  return erNavTiltak ? 'SykdomOgSkadePeriode.TiltakIRegiNavErDok' : 'UttakInfoPanel.SykdomSkadenDokumentertAngiAvklartPeriode';
};

const finnTextTilRadio2 = (erHeimevern, erNavTiltak) => {
  if (erHeimevern) {
    return 'SykdomOgSkadePeriode.HeimevernetErIkkeDok';
  }
  return erNavTiltak ? 'SykdomOgSkadePeriode.TiltakIRegiNavErIkkeDok' : 'UttakInfoPanel.SykdomSkadenIkkeDokumentert';
};


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
  erHeimevern,
  erNavTiltak,
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
            DOMName={`resultat_${id}`}
            bredde="M"
            validate={[required]}
            readOnly={readOnly}
            isEdited={isEdited}
          >
            <RadioOption
              label={{ id: finnTextTilRadio1(erHeimevern, erNavTiltak) }}
              value={uttakPeriodeVurdering.PERIODE_OK}
              style={inlineStyle.radioOption}
            />
            <RadioOption
              label={{ id: finnTextTilRadio2(erHeimevern, erNavTiltak) }}
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
  utsettelseArsak: PropTypes.shape(),
  overforingArsak: PropTypes.shape(),
  formSyncErrors: PropTypes.shape(),
  behandlingStatusKode: PropTypes.string,
  erHeimevern: PropTypes.bool,
  erNavTiltak: PropTypes.bool,
};

SykdomOgSkadePeriode.defaultProps = {
  dokumentertePerioder: [{}],
  formSyncErrors: {},
  resultat: undefined,
  behandlingStatusKode: undefined,
  utsettelseArsak: undefined,
  overforingArsak: undefined,
  erHeimevern: false,
  erNavTiltak: false,
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

  if (overforingArsak && overforingArsak.kode === overforingArsakCodes.SYKDOM_ANNEN_FORELDER
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
  (state, ownProps) => behandlingFormValueSelector(
    'UttakFaktaForm',
    ownProps.behandlingId,
    ownProps.behandlingVersjon,
  )(state, `${ownProps.fieldId}.begrunnelse`),
  (state, ownProps) => behandlingFormValueSelector(
    'UttakFaktaForm',
    ownProps.behandlingId,
    ownProps.behandlingVersjon,
  )(state, `${ownProps.fieldId}.resultat`),
  (state, ownProps) => behandlingFormValueSelector(
    'UttakFaktaForm',
    ownProps.behandlingId,
    ownProps.behandlingVersjon,
  )(state, `${ownProps.fieldId}.dokumentertePerioder`),
  (_state, ownProps) => ownProps.id],
(begrunnelse, initialResultat, initialDokumentertePerioder, id) => ({
  begrunnelse,
  id,
  resultat: initialResultat ? initialResultat.kode : undefined,
  dokumentertePerioder: initialDokumentertePerioder !== undefined ? initialDokumentertePerioder : [],
}));

const mapStateToPropsFactory = (_initialState, initialOwnProps) => {
  const {
    behandlingId,
    behandlingVersjon,
    gjeldendeFamiliehendelse,
    vilkarForSykdomExists,
  } = initialOwnProps;
  const formName = `sykdomOgSkadeForm-${initialOwnProps.id}`;
  const familiehendelse = gjeldendeFamiliehendelse;
  const validate = (values) => validateSykdomOgSkadeForm(values, familiehendelse, initialOwnProps.utsettelseArsak,
    initialOwnProps.overforingArsak, vilkarForSykdomExists);
  const onSubmit = (values) => initialOwnProps.updatePeriode((values));

  return (state, ownProps) => ({
    onSubmit,
    validate,
    formSyncErrors: getBehandlingFormSyncErrors(formName, behandlingId, behandlingVersjon)(state),
    dokumentertePerioder: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'dokumentertePerioder'),
    resultat: behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'resultat'),
    initialValues: buildInitialValues(state, ownProps),
    updated: behandlingFormValueSelector('UttakFaktaForm', behandlingId, behandlingVersjon)(state, `${ownProps.fieldId}.updated`),
    bekreftet: behandlingFormValueSelector('UttakFaktaForm', behandlingId, behandlingVersjon)(state, `${ownProps.fieldId}.bekreftet`),
    form: formName,
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  enableReinitialize: true,
})(SykdomOgSkadePeriode));
