import React from 'react';
import PropTypes from 'prop-types';
import BehandlingFormFieldCleaner from 'behandlingForstegangOgRevurdering/src/BehandlingFormFieldCleaner';
import { dateAfterOrEqual, hasValidDate, required } from '@fpsak-frontend/utils';
import DatepickerField from '@fpsak-frontend/form/src/DatepickerField';
import moment from 'moment';
import RadioGroupField from '@fpsak-frontend/form/src/RadioGroupField';
import RadioOption from '@fpsak-frontend/form/src/RadioOption';
import { Column, Row } from 'nav-frontend-grid';
import ArrowBox from '@fpsak-frontend/shared-components/src/ArrowBox';
import { FormattedMessage } from 'react-intl';
import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';
import aktivtArbeidsforholdHandling from '@fpsak-frontend/kodeverk/src/aktivtArbeidsforholdHandling';

// ----------------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------------

// TODO (TOR) Bør heller senda med boolsk indikator fra backend enn å ha hardkoda streng her
const AA_REGISTERET = 'aa-registeret';

// ----------------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------------

const arbeidsforholdTomDatoPickerErrorMsg = dato => ([
  { id: 'PersonArbeidsforholdDetailForm.DateNotAfterOrEqual' },
  { dato },
]);

const isKildeAaRegisteret = arbeidsforhold => arbeidsforhold.kilde && arbeidsforhold.kilde.navn.toLowerCase() === AA_REGISTERET;

const skalDisableArbeidsforholdIkkeAktivt = (arbeidsforhold) => {
  const erTomDatoLikEllerEtterSkjaeringstidspunkt = moment(arbeidsforhold.tomDato).isSameOrAfter(arbeidsforhold.skjaeringstidspunkt);
  return erTomDatoLikEllerEtterSkjaeringstidspunkt && !arbeidsforhold.brukMedJustertPeriode;
};

const skalKunneOverstyreArbeidsforholdTomDato = (hasReceivedInntekstmelding, arbeidsforhold) => (isKildeAaRegisteret(arbeidsforhold)
  && !hasReceivedInntekstmelding)
  || arbeidsforhold.brukMedJustertPeriode;

const skalViseInntektIkkeMedTilBeregningsgrunnlagetValgmulighet = (arbeidsforhold, hasReceivedInntektsmelding) => {
  const fomDatoFoerStp = moment(arbeidsforhold.fomDato).isBefore(arbeidsforhold.skjaeringstidspunkt);
  const tomDatoIkkeSattEllerEtterStp = (arbeidsforhold.tomDato === undefined || arbeidsforhold.tomDato === null)
    || moment(arbeidsforhold.tomDato).isAfter(arbeidsforhold.skjaeringstidspunkt);
  return fomDatoFoerStp && tomDatoIkkeSattEllerEtterStp && !hasReceivedInntektsmelding;
};

/**
 * Component: ArbeidsforholdRadioknapper
 */
const ArbeidsforholdRadioknapper = ({
  readOnly,
  formName,
  hasReceivedInntektsmelding,
  arbeidsforhold,
  skalKunneLeggeTilNyeArbeidsforhold,
  aktivtArbeidsforholdTillatUtenIM,
  skalBrukeUendretForhold,
}) => (
  <RadioGroupField
    name="brukUendretArbeidsforhold"
    validate={[required]}
    direction="vertical"
    readOnly={readOnly}
  >
    <RadioOption
      label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforhoildErAktivt' }}
      value
      manualHideChildren
    >
      <BehandlingFormFieldCleaner formName={formName} fieldNames={['aktivtArbeidsforholdHandlingField']}>
        {skalBrukeUendretForhold && !hasReceivedInntektsmelding && (
          <Row>
            <Column xs="1" />
            <Column xs="11">
              <RadioGroupField
                name="aktivtArbeidsforholdHandlingField"
                validate={[required]}
                direction="vertical"
                readOnly={readOnly}
              >
                <RadioOption
                  label={{ id: 'PersonArbeidsforholdDetailForm.AvslaYtelseManglendeOpplysninger' }}
                  value={aktivtArbeidsforholdHandling.AVSLA_YTELSE}
                />
                { skalViseInntektIkkeMedTilBeregningsgrunnlagetValgmulighet(arbeidsforhold, hasReceivedInntektsmelding) && (
                  <RadioOption
                    label={{ id: 'PersonArbeidsforholdDetailForm.InntektIkkeMedIBeregningsgrunnlaget' }}
                    value={aktivtArbeidsforholdHandling.INNTEKT_IKKE_MED_I_BG}
                  />
                )}
                <RadioOption
                  label={{ id: 'PersonArbeidsforholdDetailForm.FortsettBehandling' }}
                  value={aktivtArbeidsforholdHandling.FORTSETT_BEHANDLING}
                  disabled={!aktivtArbeidsforholdTillatUtenIM}
                />
              </RadioGroupField>
            </Column>
          </Row>
        )}
      </BehandlingFormFieldCleaner>
    </RadioOption>
    { skalKunneOverstyreArbeidsforholdTomDato(hasReceivedInntektsmelding, arbeidsforhold) && (
      <RadioOption
        label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt' }}
        value={false}
        disabled={skalDisableArbeidsforholdIkkeAktivt(arbeidsforhold)}
        manualHideChildren
      >
        <BehandlingFormFieldCleaner formName={formName} fieldNames={['overstyrtTom']}>
          { skalBrukeUendretForhold === false && (
            <ArrowBox>
              <DatepickerField
                name="overstyrtTom"
                label={<FormattedMessage id="PersonArbeidsforholdDetailForm.ArbeidsforholdetAktivTomDato" />}
                validate={[required, hasValidDate, dateAfterOrEqual(arbeidsforhold.fomDato, arbeidsforholdTomDatoPickerErrorMsg)]}
                readOnly={readOnly}
              />
            </ArrowBox>
          )}
        </BehandlingFormFieldCleaner>
      </RadioOption>
    )}
    { !skalKunneOverstyreArbeidsforholdTomDato(hasReceivedInntektsmelding, arbeidsforhold) && (
      <RadioOption
        label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdIkkeRelevant' }}
        value={false}
        disabled={isKildeAaRegisteret(arbeidsforhold) || skalKunneLeggeTilNyeArbeidsforhold}
      />
    )}
  </RadioGroupField>
);

ArbeidsforholdRadioknapper.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  hasReceivedInntektsmelding: PropTypes.bool.isRequired,
  arbeidsforhold: arbeidsforholdPropType.isRequired,
  skalKunneLeggeTilNyeArbeidsforhold: PropTypes.bool.isRequired,
  aktivtArbeidsforholdTillatUtenIM: PropTypes.bool.isRequired,
  skalBrukeUendretForhold: PropTypes.bool,
};

ArbeidsforholdRadioknapper.defaultProps = {
  skalBrukeUendretForhold: undefined,
};

export default ArbeidsforholdRadioknapper;
