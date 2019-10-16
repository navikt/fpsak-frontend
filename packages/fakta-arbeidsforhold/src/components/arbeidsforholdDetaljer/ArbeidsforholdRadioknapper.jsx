import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';

import {
  dateAfterOrEqual, hasValidDate, required, dateIsBefore,
} from '@fpsak-frontend/utils';
import { DatepickerField, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { ArrowBox } from '@fpsak-frontend/shared-components';

import arbeidsforholdPropType from '../../propTypes/arbeidsforholdPropType';
import aktivtArbeidsforholdHandling from '../../kodeverk/aktivtArbeidsforholdHandling';
import arbeidsforholdHandling from '../../kodeverk/arbeidsforholdHandling';
import arbeidsforholdKilder from '../../kodeverk/arbeidsforholdKilder';
import BehandlingFormFieldCleaner from '../../util/BehandlingFormFieldCleaner';

// ----------------------------------------------------------------------------------
// VARIABLES
// ----------------------------------------------------------------------------------

// TODO (TOR) Bør heller senda med boolsk indikator fra backend enn å ha hardkoda streng her
const AA_REGISTERET = 'aa-registeret';

// ----------------------------------------------------------------------------------
// METHODS
// ----------------------------------------------------------------------------------

const arbeidsforholdTomDatoPickerErrorMsg = (dato) => ([{ id: 'PersonArbeidsforholdDetailForm.DateNotAfterOrEqual' }, { dato }]);
const dateMustBeBeforeSkjaeringstidspunkt = (dato) => ([{ id: 'PersonArbeidsforholdDetailForm.DateNotBeforeSkjaeringstidspunkt' }, { dato }]);

const isKildeAaRegisteret = (arbeidsforhold) => arbeidsforhold.kilde && arbeidsforhold.kilde.navn.toLowerCase() === AA_REGISTERET;

const skalDisableOverstyrTom = (arbeidsforhold) => {
  const erTomDatoLikEllerEtterSkjaeringstidspunkt = moment(arbeidsforhold.tomDato).isSameOrAfter(arbeidsforhold.skjaeringstidspunkt);
  return erTomDatoLikEllerEtterSkjaeringstidspunkt && !arbeidsforhold.brukMedJustertPeriode;
};

const kanSetteOverstyrtTom = (hasReceivedInntekstmelding, arbeidsforhold) => (isKildeAaRegisteret(arbeidsforhold)
  && !hasReceivedInntekstmelding)
  || arbeidsforhold.brukMedJustertPeriode;

const skalViseInntektIkkeMedTilBeregningsgrunnlagetValgmulighet = (arbeidsforhold, hasReceivedInntektsmelding) => {
  const fomDatoFoerStp = moment(arbeidsforhold.fomDato).isBefore(arbeidsforhold.skjaeringstidspunkt);
  const tomDatoIkkeSattEllerEtterStp = (arbeidsforhold.tomDato === undefined || arbeidsforhold.tomDato === null)
    || moment(arbeidsforhold.tomDato).isAfter(arbeidsforhold.skjaeringstidspunkt);
  return fomDatoFoerStp && tomDatoIkkeSattEllerEtterStp && !hasReceivedInntektsmelding;
};

const erFlerePermisjoner = (arbeidsforhold) => arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length > 1;

const utledRadioOptionForArbeidsforholdSomIkkeErAktive = (
  arbeidsforhold,
  hasReceivedInntektsmelding,
  arbeidsforholdHandlingVerdi,
  formName,
  readOnly,
  behandlingId,
  behandlingVersjon,
) => {
  if (arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length > 0) {
    return (
      <RadioOption
        label={{ id: 'PersonArbeidsforholdDetailForm.SokerErIPermisjon' }}
        value={arbeidsforholdHandling.SOKER_ER_I_PERMISJON}
        disabled={erFlerePermisjoner(arbeidsforhold)}
      />
    );
  }
  if (kanSetteOverstyrtTom(hasReceivedInntektsmelding, arbeidsforhold)) {
    return (
      <RadioOption
        label={{ id: 'PersonArbeidsforholdDetailForm.ArbeidsforholdetErIkkeAktivt' }}
        value={arbeidsforholdHandling.OVERSTYR_TOM}
        disabled={skalDisableOverstyrTom(arbeidsforhold)}
        manualHideChildren
      >
        <BehandlingFormFieldCleaner formName={formName} fieldNames={['overstyrtTom']} behandlingId={behandlingId} behandlingVersjon={behandlingVersjon}>
          { arbeidsforholdHandlingVerdi === arbeidsforholdHandling.OVERSTYR_TOM && (
            <ArrowBox>
              <DatepickerField
                name="overstyrtTom"
                label={<FormattedMessage id="PersonArbeidsforholdDetailForm.ArbeidsforholdetAktivTomDato" />}
                validate={[
                  required,
                  hasValidDate,
                  dateAfterOrEqual(arbeidsforhold.fomDato, arbeidsforholdTomDatoPickerErrorMsg),
                  dateIsBefore(arbeidsforhold.skjaeringstidspunkt, dateMustBeBeforeSkjaeringstidspunkt),
                ]}
                readOnly={readOnly}
              />
            </ArrowBox>
          )}
        </BehandlingFormFieldCleaner>
      </RadioOption>
    );
  }
  return (
    <RadioOption
      label={{ id: 'PersonArbeidsforholdDetailForm.FjernArbeidsforholdet' }}
      value={arbeidsforholdHandling.FJERN_ARBEIDSFORHOLD}
      disabled={isKildeAaRegisteret(arbeidsforhold) || arbeidsforhold.lagtTilAvSaksbehandler === true}
    />
  );
};

const utledAktivtArbeidsforholdLabel = (arbeidsforhold) => {
  if (arbeidsforhold.permisjoner && arbeidsforhold.permisjoner.length > 0) {
    return 'PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivtOgHarPermisjonMenSoekerErIkkePermisjon';
  }
  if (arbeidsforhold.kilde.navn === arbeidsforholdKilder.INNTEKTSMELDING) {
    return 'PersonArbeidsforholdDetailForm.OppdaterArbeidsforhold';
  }
  return 'PersonArbeidsforholdDetailForm.ArbeidsforholdErAktivt';
};

const skalViseRadioOptionsForAktivtArbeidsforholdHandlinger = (hasReceivedInntektsmelding, arbeidsforholdHandlingVerdi) => {
  if (arbeidsforholdHandlingVerdi !== arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD) {
    return false;
  }
  return hasReceivedInntektsmelding === false;
};

/**
 * Component: ArbeidsforholdRadioknapper
 * Ansvarlig for å håndtere visning av RadioKnapper for arbeidsforhold
 * som står i aksjonspunktet 5080 i fakta om arbeidsforhold.
 */
const ArbeidsforholdRadioknapper = ({
  readOnly,
  formName,
  hasReceivedInntektsmelding,
  arbeidsforhold,
  aktivtArbeidsforholdTillatUtenIM,
  arbeidsforholdHandlingVerdi,
  behandlingId,
  behandlingVersjon,
}) => (
  <RadioGroupField
    name="arbeidsforholdHandlingField"
    validate={[required]}
    direction="vertical"
    readOnly={readOnly}
  >
    <RadioOption
      label={{ id: utledAktivtArbeidsforholdLabel(arbeidsforhold) }}
      value={arbeidsforholdHandling.AKTIVT_ARBEIDSFORHOLD}
      manualHideChildren
    >
      <BehandlingFormFieldCleaner formName={formName} fieldNames={['aktivtArbeidsforholdHandlingField']}>
        { skalViseRadioOptionsForAktivtArbeidsforholdHandlinger(hasReceivedInntektsmelding, arbeidsforholdHandlingVerdi) && (
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
                  disabled={arbeidsforhold.lagtTilAvSaksbehandler === true}
                />
                { skalViseInntektIkkeMedTilBeregningsgrunnlagetValgmulighet(arbeidsforhold, hasReceivedInntektsmelding) && (
                  <RadioOption
                    label={{ id: 'PersonArbeidsforholdDetailForm.InntektIkkeMedIBeregningsgrunnlaget' }}
                    value={aktivtArbeidsforholdHandling.INNTEKT_IKKE_MED_I_BG}
                    disabled={arbeidsforhold.lagtTilAvSaksbehandler === true}
                  />
                )}
                <RadioOption
                  label={{ id: 'PersonArbeidsforholdDetailForm.BenyttAInntektIBeregningsgrunnlag' }}
                  value={aktivtArbeidsforholdHandling.BENYTT_A_INNTEKT_I_BG}
                  disabled={!aktivtArbeidsforholdTillatUtenIM}
                />
              </RadioGroupField>
            </Column>
          </Row>
        )}
      </BehandlingFormFieldCleaner>
    </RadioOption>
    { utledRadioOptionForArbeidsforholdSomIkkeErAktive(
      arbeidsforhold,
      hasReceivedInntektsmelding,
      arbeidsforholdHandlingVerdi,
      formName,
      readOnly,
      behandlingId,
      behandlingVersjon,
    )}
  </RadioGroupField>
);

ArbeidsforholdRadioknapper.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  hasReceivedInntektsmelding: PropTypes.bool.isRequired,
  arbeidsforhold: arbeidsforholdPropType.isRequired,
  aktivtArbeidsforholdTillatUtenIM: PropTypes.bool.isRequired,
  arbeidsforholdHandlingVerdi: PropTypes.string,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

ArbeidsforholdRadioknapper.defaultProps = {
  arbeidsforholdHandlingVerdi: undefined,
};

export default ArbeidsforholdRadioknapper;
