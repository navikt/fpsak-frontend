import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createSelector } from 'reselect';
import { Undertekst } from 'nav-frontend-typografi';

import oppholdArsakType from '@fpsak-frontend/kodeverk/src/oppholdArsakType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import uttakPeriodeVurdering from '@fpsak-frontend/kodeverk/src/uttakPeriodeVurdering';
import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidPeriod, hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';

import {
  behandlingFormForstegangOgRevurdering,
  behandlingFormValueSelector,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import InntektsmeldingInfo from '../components/InntektsmeldingInfo';
import EndreSoknadsperiode from '../components/EndreSoknadsperiode';
import PerioderKnapper from './PerioderKnapper';
import styles from './periodeTyper.less';

const minLength3 = minLength(3);
const maxLength4000 = maxLength(4000);

export const FerieOgArbeidsPeriode = ({
  resultat,
  id,
  cancelEditPeriode,
  updated,
  bekreftet,
  arbeidstidprosent,
  readOnly,
  inntektsmeldingInfo,
  arbeidsgiver,
  uttakPeriodeType,
  behandlingStatusKode,
  skalViseResultat,
  førsteUttaksdato,
  originalResultat,
  skalViseInntektmeldingInfo,
  oppholdArsak,
  ...formProps
}) => {
  const isEdited = resultat === uttakPeriodeVurdering.PERIODE_OK_ENDRET
  && readOnly && behandlingStatusKode === behandlingStatus.FATTER_VEDTAK;

  const inlineStyle = {
    radioOption: {
      height: resultat === uttakPeriodeVurdering.PERIODE_OK_ENDRET && !readOnly ? 260 : 'auto',
    },
  };

  const withGradering = arbeidstidprosent !== null && arbeidstidprosent !== undefined && arbeidstidprosent > 0;
  const periodeOkDisabled = !bekreftet || originalResultat.kode !== uttakPeriodeVurdering.PERIODE_OK;

  return (
    <div>
      {skalViseResultat
    && (
      <>
        <FlexContainer>
          <FlexRow wrap>
            <FlexColumn className={styles.fieldColumn}>
              <Undertekst><FormattedMessage id="UttakInfoPanel.FastsettResultat" /></Undertekst>
              <VerticalSpacer fourPx />
              <RadioGroupField
                direction="vertical"
                name="resultat"
                DOMName={`resultat_${id}`}
                bredde="M"
                isEdited={isEdited}
                validate={[required]}
                readOnly={readOnly}
              >
                <RadioOption
                  label={{ id: 'UttakInfoPanel.PeriodenErOk' }}
                  value={uttakPeriodeVurdering.PERIODE_OK}
                  disabled={periodeOkDisabled}
                />
                <RadioOption
                  label={{ id: 'UttakInfoPanel.EndreSoknadsperioden' }}
                  value={uttakPeriodeVurdering.PERIODE_OK_ENDRET}
                  style={inlineStyle.radioOption}
                />
                <RadioOption
                  label={{ id: 'UttakInfoPanel.PeriodenKanIkkeAvklares' }}
                  value={uttakPeriodeVurdering.PERIODE_KAN_IKKE_AVKLARES}
                />
              </RadioGroupField>
              {resultat === uttakPeriodeVurdering.PERIODE_OK_ENDRET && !readOnly
            && (
              <div className={styles.endreSoknadsperiode}>
                <EndreSoknadsperiode oppholdArsak={oppholdArsak} withGradering={withGradering} førsteUttaksdato={førsteUttaksdato} />
              </div>
            )}
              <VerticalSpacer twentyPx />
              <div className={styles.textAreaStyle}>
                <TextAreaField
                  name="begrunnelse"
                  label={{ id: 'UttakInfoPanel.BegrunnEndringene' }}
                  readOnly={readOnly}
                  validate={[required,
                    minLength3,
                    maxLength4000,
                    hasValidText,
                  ]}
                  maxLength={4000}
                />
              </div>
            </FlexColumn>
            {skalViseInntektmeldingInfo && (
            <FlexColumn className={styles.fieldColumn}>
              <InntektsmeldingInfo
                inntektsmeldingInfo={inntektsmeldingInfo}
                uttakPeriodeType={uttakPeriodeType}
                arbeidsgiver={arbeidsgiver}
              />
            </FlexColumn>
            )}
          </FlexRow>
        </FlexContainer>
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
      </>
    )}
    </div>
  );
};

FerieOgArbeidsPeriode.propTypes = {
  resultat: PropTypes.string,
  updatePeriode: PropTypes.func.isRequired,
  cancelEditPeriode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  updated: PropTypes.bool.isRequired,
  bekreftet: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  arbeidstidprosent: PropTypes.number,
  inntektsmeldingInfo: PropTypes.arrayOf(PropTypes.shape()),
  uttakPeriodeType: PropTypes.shape().isRequired,
  arbeidsgiver: PropTypes.shape(),
  skalViseResultat: PropTypes.bool.isRequired,
  oppholdArsak: PropTypes.shape(),
  behandlingStatusKode: PropTypes.string,
  førsteUttaksdato: PropTypes.string,
  originalResultat: PropTypes.shape().isRequired,
  skalViseInntektmeldingInfo: PropTypes.bool.isRequired,
};

FerieOgArbeidsPeriode.defaultProps = {
  inntektsmeldingInfo: [],
  arbeidstidprosent: null,
  resultat: undefined,
  arbeidsgiver: {},
  oppholdArsak: undefined,
  behandlingStatusKode: undefined,
  førsteUttaksdato: undefined,
};

const validateForm = ({ nyFom, nyTom }) => {
  const errors = {};

  const invalid = required(nyFom) || hasValidPeriod(nyFom, nyTom);

  if (invalid) {
    errors.nyFom = invalid;
  }

  return errors;
};

const buildInitialValues = createSelector([
  (state, ownProps) => behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.begrunnelse`),
  (state, ownProps) => behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.saksebehandlersBegrunnelse`),
  (state, ownProps) => behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.oppholdÅrsak`),
  (state, ownProps) => behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.resultat`),
  (state, ownProps) => ownProps],
(begrunnelse, saksebehandlersBegrunnelse, oppholdArsak, initialResultat, ownProps) => {
  let initialResultatValue = initialResultat ? initialResultat.kode : undefined;
  if (oppholdArsak && oppholdArsak.kode !== oppholdArsakType.UDEFINERT && !begrunnelse) {
    initialResultatValue = undefined;
  }
  return {
    begrunnelse: begrunnelse || saksebehandlersBegrunnelse,
    id: ownProps.id,
    resultat: initialResultatValue,
    nyTom: ownProps.tilDato,
    nyFom: ownProps.fraDato,
    nyArbeidstidsprosent: ownProps.arbeidstidprosent,
    kontoType: ownProps.uttakPeriodeType.kode,
    oppholdArsak: oppholdArsak ? oppholdArsak.kode : '',
  };
});

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const formName = `arbeidOgFerieForm-${initialOwnProps.id}`;
  const onSubmit = (values) => initialOwnProps.updatePeriode(values);

  return (state, ownProps) => {
    const resultat = behandlingFormValueSelector(formName)(state, 'resultat');
    const førsteUttaksdato = behandlingFormValueSelector('UttakFaktaForm')(state, 'førsteUttaksdato');
    const originalResultat = behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.originalResultat`) || {};
    const begrunnelse = behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.begrunnelse`);
    const oppholdArsak = behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.oppholdÅrsak`);

    // skal vise inntektsmeldinginfo for søknader mottatt før 4.juni og hvis 5070. https://jira.adeo.no/browse/PFP-7559
    const skalViseInntektmeldingInfo = false; // moment(getSoknad(state).mottattDato).isBefore('2019-06-04');

    const skalViseResultat = !(ownProps.readOnly && oppholdArsak && oppholdArsak.kode !== oppholdArsakType.UDEFINERT && !begrunnelse);
    const { bekreftet } = ownProps;

    return {
      onSubmit,
      resultat,
      bekreftet,
      skalViseResultat,
      oppholdArsak,
      førsteUttaksdato,
      originalResultat,
      skalViseInntektmeldingInfo,
      initialValues: buildInitialValues(state, ownProps),
      updated: behandlingFormValueSelector('UttakFaktaForm')(state, `${ownProps.fieldId}.updated`),
      form: formName,
    };
  };
};

export default connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({
  enableReinitialize: true,
  validate: validateForm,
})(FerieOgArbeidsPeriode));
