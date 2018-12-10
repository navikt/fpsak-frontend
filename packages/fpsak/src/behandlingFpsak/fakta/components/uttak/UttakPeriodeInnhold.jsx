import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getBehandlingStatus } from 'behandlingFpsak/behandlingSelectors';
import utsettelseArsakCodes from 'kodeverk/utsettelseArsakCodes';
import overforingArsakCodes from 'kodeverk/overforingArsakCodes';
import FerieOgArbeidsPeriode from './perioder/FerieOgArbeidsPeriode';
import SykdomOgSkadePeriode from './perioder/SykdomOgSkadePeriode';
import InnleggelsePeriode from './perioder/InnleggelsePeriode';

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
) => {
  switch (utsettelseArsak.kode) {
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
          utsettelseArsak={utsettelseArsak}
          fraDato={fraDato}
          tilDato={tilDato}
          inntektsmeldingInfo={inntektsmeldingInfo}
          bekreftet={bekreftet}
          uttakPeriodeType={uttakPeriodeType}
          arbeidsgiver={arbeidsgiver}
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
          inntektsmeldingInfo={inntektsmeldingInfo}
          utsettelseArsak={utsettelseArsak}
          overforingArsak={overforingArsak}
          bekreftet={bekreftet}
          arbeidsgiver={arbeidsgiver}
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
          inntektsmeldingInfo={inntektsmeldingInfo}
          readOnly={readOnly}
          fraDato={fraDato}
          tilDato={tilDato}
          bekreftet={bekreftet}
          arbeidsgiver={arbeidsgiver}
        />
      );
    case utsettelseArsakCodes.UDEFINERT:
      if (overforingArsak.kode === overforingArsakCodes.SYKDOM_ANNEN_FORELDER) {
        return (
          <SykdomOgSkadePeriode
            fieldId={fieldId}
            id={id}
            updatePeriode={updatePeriode}
            cancelEditPeriode={cancelEditPeriode}
            readOnly={readOnly}
            fraDato={fraDato}
            tilDato={tilDato}
            inntektsmeldingInfo={inntektsmeldingInfo}
            utsettelseArsak={utsettelseArsak}
            overforingArsak={overforingArsak}
            bekreftet={bekreftet}
            arbeidsgiver={arbeidsgiver}
          />
        );
      }

      if (overforingArsak.kode === overforingArsakCodes.INSTITUSJONSOPPHOLD_ANNEN_FORELDER) {
        return (
          <InnleggelsePeriode
            fieldId={fieldId}
            id={id}
            updatePeriode={updatePeriode}
            cancelEditPeriode={cancelEditPeriode}
            overforingArsak={overforingArsak}
            inntektsmeldingInfo={inntektsmeldingInfo}
            readOnly={readOnly}
            fraDato={fraDato}
            tilDato={tilDato}
            bekreftet={bekreftet}
            arbeidsgiver={arbeidsgiver}
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
          utsettelseArsak={utsettelseArsak}
          inntektsmeldingInfo={inntektsmeldingInfo}
          bekreftet={bekreftet}
          uttakPeriodeType={uttakPeriodeType}
          arbeidsgiver={arbeidsgiver}
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
      )}
    </div>
  );
};

UttakPeriodeInnhold.propTypes = {
  fieldId: PropTypes.string.isRequired,
  utsettelseArsak: PropTypes.shape().isRequired,
  overforingArsak: PropTypes.shape().isRequired,
  updatePeriode: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  cancelEditPeriode: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  arbeidstidprosent: PropTypes.number,
  fraDato: PropTypes.string.isRequired,
  tilDato: PropTypes.string.isRequired,
  inntektsmeldingInfo: PropTypes.arrayOf(PropTypes.shape()),
  bekreftet: PropTypes.bool.isRequired,
  openForm: PropTypes.bool.isRequired,
  uttakPeriodeType: PropTypes.shape().isRequired,
  arbeidsgiver: PropTypes.shape(),
};

UttakPeriodeInnhold.defaultProps = {
  arbeidstidprosent: null,
  inntektsmeldingInfo: [],
  arbeidsgiver: {},
};

const mapStateToProps = state => ({
  behandlingStatusKode: getBehandlingStatus(state).kode,
});

export default connect(mapStateToProps)(UttakPeriodeInnhold);
