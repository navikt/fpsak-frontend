import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Undertekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import oppholdArsakType from 'kodeverk/oppholdArsakType';
import FlexColumn from 'sharedComponents/flexGrid/FlexColumn';
import FlexRow from 'sharedComponents/flexGrid/FlexRow';
import FlexContainer from 'sharedComponents/flexGrid/FlexContainer';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingFpsak/behandlingForm';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import uttakPeriodeVurdering from 'kodeverk/uttakPeriodeVurdering';
import { RadioOption, RadioGroupField, TextAreaField } from 'form/Fields';
import {
  required, maxLength, minLength, hasValidPeriod, hasValidText,
} from 'utils/validation/validators';
import InntektsmeldingInfo from '../components/InntektsmeldingInfo';
import EndreSoknadsperiode from '../components/EndreSoknadsperiode';
import PerioderKnapper from './PerioderKnapper';
import styles from './periodeTyper.less';

const minLength3 = minLength(3);
const maxLength4000 = maxLength(4000);

const ElementWrapper = ({ children }) => children;

export const FerieOgArbeidsPeriode = ({
  resultat,
  id,
  cancelEditPeriode,
  updated,
  bekreftet,
  arbeidstidprosent,
  readOnly,
  inntektsmeldingInfo,
  fraDato,
  tilDato,
  fieldId,
  arbeidsgiver,
  uttakPeriodeType,
  skalViseResultat,
  oppholdArsak,
  ...formProps
}) => {
  const inlineStyle = {
    radioOption: {
      height: resultat === uttakPeriodeVurdering.PERIODE_OK_ENDRET && !readOnly ? 250 : 'auto',
    },
  };

  const withGradering = arbeidstidprosent !== null && arbeidstidprosent !== undefined && arbeidstidprosent > 0;

  return (
    <div>
      {skalViseResultat
    && (
    <ElementWrapper>
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
              validate={[required]}
              readOnly={readOnly}
            >
              <RadioOption
                label={{ id: 'UttakInfoPanel.PeriodenErOk' }}
                value={uttakPeriodeVurdering.PERIODE_OK}
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
                <EndreSoknadsperiode oppholdArsak={oppholdArsak} withGradering={withGradering} />
              </div>
            )
            }
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
          <FlexColumn className={styles.fieldColumn}>
            <InntektsmeldingInfo
              inntektsmeldingInfo={inntektsmeldingInfo}
              fraDato={fraDato}
              tilDato={tilDato}
              uttakPeriodeType={uttakPeriodeType}
              arbeidsprosentFraSøknad={arbeidstidprosent}
              bekreftet={bekreftet}
              arbeidsgiver={arbeidsgiver}
            />
          </FlexColumn>
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
    </ElementWrapper>
    )
}
    </div>
  );
};

FerieOgArbeidsPeriode.propTypes = {
  fieldId: PropTypes.string.isRequired,
  resultat: PropTypes.string,
  updatePeriode: PropTypes.func.isRequired,
  cancelEditPeriode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  updated: PropTypes.bool.isRequired,
  bekreftet: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  arbeidstidprosent: PropTypes.number,
  inntektsmeldingInfo: PropTypes.arrayOf(PropTypes.shape()),
  fraDato: PropTypes.string.isRequired,
  tilDato: PropTypes.string.isRequired,
  uttakPeriodeType: PropTypes.shape().isRequired,
  arbeidsgiver: PropTypes.shape(),
  skalViseResultat: PropTypes.bool.isRequired,
  oppholdArsak: PropTypes.shape(),
};

FerieOgArbeidsPeriode.defaultProps = {
  inntektsmeldingInfo: [],
  arbeidstidprosent: null,
  resultat: undefined,
  arbeidsgiver: {},
  oppholdArsak: undefined,
};

const validateForm = ({ nyFom, nyTom }) => {
  const errors = {};

  const invalid = required(nyFom) || hasValidPeriod(nyFom, nyTom);

  if (invalid) {
    errors.nyFom = invalid;
  }

  return errors;
};

const mapToStateToProps = (state, ownProps) => {
  const formName = `arbeidOgFerieForm-${ownProps.id}`;
  const resultat = behandlingFormValueSelector(formName)(state, 'resultat');
  const initialResultat = behandlingFormValueSelector('UttakInfoPanel')(state, `${ownProps.fieldId}.resultat`);
  const begrunnelse = behandlingFormValueSelector('UttakInfoPanel')(state, `${ownProps.fieldId}.begrunnelse`);
  const saksebehandlersBegrunnelse = behandlingFormValueSelector('UttakInfoPanel')(state, `${ownProps.fieldId}.saksebehandlersBegrunnelse`);
  const oppholdArsak = behandlingFormValueSelector('UttakInfoPanel')(state, `${ownProps.fieldId}.oppholdÅrsak`);
  let initialResultatValue = initialResultat ? initialResultat.kode : undefined;
  if (oppholdArsak && oppholdArsak.kode !== oppholdArsakType.UDEFINERT && !begrunnelse) {
    initialResultatValue = undefined;
  }
  const skalViseResultat = !(ownProps.readOnly && oppholdArsak && oppholdArsak.kode !== oppholdArsakType.UDEFINERT && !begrunnelse);
  const { bekreftet } = ownProps;

  return {
    resultat,
    bekreftet,
    skalViseResultat,
    oppholdArsak,
    initialValues: {
      begrunnelse: begrunnelse || saksebehandlersBegrunnelse,
      id: ownProps.id,
      resultat: initialResultatValue,
      nyTom: ownProps.tilDato,
      nyFom: ownProps.fraDato,
      nyArbeidstidsprosent: ownProps.arbeidstidprosent,
      kontoType: ownProps.uttakPeriodeType.kode,
      oppholdArsak: oppholdArsak ? oppholdArsak.kode : '',
    },
    updated: behandlingFormValueSelector('UttakInfoPanel')(state, `${ownProps.fieldId}.updated`),
    form: formName,
    onSubmit: values => ownProps.updatePeriode(values),
  };
};

export default connect(mapToStateToProps)(behandlingForm({
  enableReinitialize: true,
  validate: validateForm,
})(FerieOgArbeidsPeriode));
