import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import utsettelseArsakCodes from '@fpsak-frontend/kodeverk/src/utsettelseArsakCodes';
import overforingArsakCodes from '@fpsak-frontend/kodeverk/src/overforingArsakCodes';
import FerieOgArbeidsPeriode from './perioder/FerieOgArbeidsPeriode';
import SykdomOgSkadePeriode from './perioder/SykdomOgSkadePeriode';
import InnleggelsePeriode from './perioder/InnleggelsePeriode';
import ForeldreAnsvarPeriode from './perioder/ForeldreAnsvarPeriode';

import styles from './uttakPeriodeInnhold.less';

export const renderPeriode = (
  fieldId,
  id,
  updatePeriode,
  cancelEditPeriode,
  arbeidstidprosent,
  readOnly,
  fraDato,
  tilDato,
  utsettelseArsak,
  overforingArsak,
  inntektsmeldingInfo,
  bekreftet,
  uttakPeriodeType,
  arbeidsgiver,
  behandlingStatusKode,
  farSøkerFør6Uker,
  behandlingId,
  behandlingVersjon,
  gjeldendeFamiliehendelse,
  vilkarForSykdomExists,
  getKodeverknavn,
  sisteUttakdatoFørsteSeksUker,
) => {
  const utsettelseSwitch = utsettelseArsak ? utsettelseArsak.kode : utsettelseArsakCodes.UDEFINERT;
  const overforingSwitch = overforingArsak ? overforingArsak.kode : overforingArsakCodes.UDEFINERT;
  const farHarSøktFørsteSeksUkerOgPeriodeFomErInnenfor = farSøkerFør6Uker && moment(fraDato).isBefore(sisteUttakdatoFørsteSeksUker);

  switch (utsettelseSwitch) {
    case utsettelseArsakCodes.ARBEID:
    case utsettelseArsakCodes.LOVBESTEMT_FERIE:
      return (
        <FerieOgArbeidsPeriode
          fieldId={fieldId}
          id={id}
          updatePeriode={updatePeriode}
          cancelEditPeriode={cancelEditPeriode}
          readOnly={readOnly}
          arbeidstidprosent={arbeidstidprosent}
          fraDato={fraDato}
          tilDato={tilDato}
          inntektsmeldingInfo={inntektsmeldingInfo}
          bekreftet={bekreftet}
          uttakPeriodeType={uttakPeriodeType}
          arbeidsgiver={arbeidsgiver}
          behandlingStatusKode={behandlingStatusKode}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          getKodeverknavn={getKodeverknavn}
        />
      );
    case utsettelseArsakCodes.SYKDOM:
      return (
        <SykdomOgSkadePeriode
          fieldId={fieldId}
          id={id}
          updatePeriode={updatePeriode}
          cancelEditPeriode={cancelEditPeriode}
          readOnly={readOnly}
          fraDato={fraDato}
          tilDato={tilDato}
          overforingArsak={overforingArsak}
          utsettelseArsak={utsettelseArsak}
          bekreftet={bekreftet}
          behandlingStatusKode={behandlingStatusKode}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          gjeldendeFamiliehendelse={gjeldendeFamiliehendelse}
          vilkarForSykdomExists={vilkarForSykdomExists}
        />
      );
    case utsettelseArsakCodes.INSTITUSJONSOPPHOLD_SØKER:
    case utsettelseArsakCodes.INSTITUSJONSOPPHOLD_BARNET:
      return (
        <InnleggelsePeriode
          fieldId={fieldId}
          id={id}
          updatePeriode={updatePeriode}
          cancelEditPeriode={cancelEditPeriode}
          overforingArsak={overforingArsak}
          readOnly={readOnly}
          fraDato={fraDato}
          tilDato={tilDato}
          bekreftet={bekreftet}
          behandlingStatusKode={behandlingStatusKode}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      );
    case utsettelseArsakCodes.UDEFINERT:
      if (overforingSwitch === overforingArsakCodes.SYKDOM_ANNEN_FORELDER || farHarSøktFørsteSeksUkerOgPeriodeFomErInnenfor) {
        return (
          <SykdomOgSkadePeriode
            fieldId={fieldId}
            id={id}
            updatePeriode={updatePeriode}
            cancelEditPeriode={cancelEditPeriode}
            readOnly={readOnly}
            fraDato={fraDato}
            tilDato={tilDato}
            utsettelseArsak={utsettelseArsak}
            overforingArsak={overforingArsak}
            bekreftet={bekreftet}
            behandlingStatusKode={behandlingStatusKode}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            gjeldendeFamiliehendelse={gjeldendeFamiliehendelse}
            vilkarForSykdomExists={vilkarForSykdomExists}
          />
        );
      }

      if (overforingSwitch === overforingArsakCodes.IKKE_RETT_ANNEN_FORELDER
        || overforingSwitch === overforingArsakCodes.ALENEOMSORG) {
        return (
          <ForeldreAnsvarPeriode
            fieldId={fieldId}
            id={id}
            updatePeriode={updatePeriode}
            cancelEditPeriode={cancelEditPeriode}
            overforingArsak={overforingArsak}
            readOnly={readOnly}
            fraDato={fraDato}
            tilDato={tilDato}
            bekreftet={bekreftet}
            behandlingStatusKode={behandlingStatusKode}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        );
      }

      if (overforingSwitch === overforingArsakCodes.INSTITUSJONSOPPHOLD_ANNEN_FORELDER) {
        return (
          <InnleggelsePeriode
            fieldId={fieldId}
            id={id}
            updatePeriode={updatePeriode}
            cancelEditPeriode={cancelEditPeriode}
            overforingArsak={overforingArsak}
            readOnly={readOnly}
            fraDato={fraDato}
            tilDato={tilDato}
            bekreftet={bekreftet}
            behandlingStatusKode={behandlingStatusKode}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
          />
        );
      }

      return (
        <FerieOgArbeidsPeriode
          fieldId={fieldId}
          id={id}
          updatePeriode={updatePeriode}
          cancelEditPeriode={cancelEditPeriode}
          readOnly={readOnly}
          arbeidstidprosent={arbeidstidprosent}
          fraDato={fraDato}
          tilDato={tilDato}
          inntektsmeldingInfo={inntektsmeldingInfo}
          bekreftet={bekreftet}
          uttakPeriodeType={uttakPeriodeType}
          arbeidsgiver={arbeidsgiver}
          behandlingStatusKode={behandlingStatusKode}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          getKodeverknavn={getKodeverknavn}
        />
      );
    default:
      return null;
  }
};

export const UttakPeriodeInnhold = ({
  fieldId,
  utsettelseArsak,
  overforingArsak,
  id,
  updatePeriode,
  cancelEditPeriode,
  readOnly,
  arbeidstidprosent,
  fraDato,
  tilDato,
  inntektsmeldingInfo,
  bekreftet,
  openForm,
  uttakPeriodeType,
  arbeidsgiver,
  behandlingStatusKode,
  farSøkerFør6Uker,
  behandlingId,
  behandlingVersjon,
  familiehendelse,
  vilkarForSykdomExists,
  getKodeverknavn,
  sisteUttakdatoFørsteSeksUker,
}) => {
  const editable = !(!readOnly && openForm);

  return (
    <div className={styles.periodeInnhold}>
      <VerticalSpacer eightPx />
      {renderPeriode(
        fieldId,
        id,
        updatePeriode,
        cancelEditPeriode,
        arbeidstidprosent,
        editable,
        fraDato,
        tilDato,
        utsettelseArsak,
        overforingArsak,
        inntektsmeldingInfo,
        bekreftet,
        uttakPeriodeType,
        arbeidsgiver,
        behandlingStatusKode,
        farSøkerFør6Uker,
        behandlingId,
        behandlingVersjon,
        familiehendelse.gjeldende,
        vilkarForSykdomExists,
        getKodeverknavn,
        sisteUttakdatoFørsteSeksUker,
      )}
    </div>
  );
};

UttakPeriodeInnhold.propTypes = {
  fieldId: PropTypes.string.isRequired,
  utsettelseArsak: PropTypes.shape(),
  overforingArsak: PropTypes.shape(),
  updatePeriode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  cancelEditPeriode: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  fraDato: PropTypes.string.isRequired,
  tilDato: PropTypes.string.isRequired,
  bekreftet: PropTypes.bool.isRequired,
  openForm: PropTypes.bool.isRequired,
  uttakPeriodeType: PropTypes.shape().isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  farSøkerFør6Uker: PropTypes.bool.isRequired,
  familiehendelse: PropTypes.shape().isRequired,
  vilkarForSykdomExists: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  arbeidstidprosent: PropTypes.number,
  inntektsmeldingInfo: PropTypes.arrayOf(PropTypes.shape()),
  getKodeverknavn: PropTypes.func.isRequired,
  sisteUttakdatoFørsteSeksUker: PropTypes.shape().isRequired,
  arbeidsgiver: PropTypes.shape(),
};

UttakPeriodeInnhold.defaultProps = {
  arbeidstidprosent: null,
  inntektsmeldingInfo: [],
  arbeidsgiver: {},
  utsettelseArsak: undefined,
  overforingArsak: undefined,
};

export default UttakPeriodeInnhold;
