import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
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
          fraDato={fraDato}
          tilDato={tilDato}
          inntektsmeldingInfo={inntektsmeldingInfo}
          bekreftet={bekreftet}
          uttakPeriodeType={uttakPeriodeType}
          arbeidsgiver={arbeidsgiver}
          behandlingStatusKode={behandlingStatusKode}
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
        />
      );
    case utsettelseArsakCodes.UDEFINERT:
      if (overforingArsak.kode === overforingArsakCodes.SYKDOM_ANNEN_FORELDER || farSøkerFør6Uker) {
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
          />
        );
      }

      if (overforingArsak.kode === overforingArsakCodes.IKKE_RETT_ANNEN_FORELDER
        || overforingArsak.kode === overforingArsakCodes.ALENEOMSORG) {
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
            readOnly={readOnly}
            fraDato={fraDato}
            tilDato={tilDato}
            bekreftet={bekreftet}
            behandlingStatusKode={behandlingStatusKode}
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
  farSøkerFør6Uker: PropTypes.bool.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
};

UttakPeriodeInnhold.defaultProps = {
  arbeidstidprosent: null,
  inntektsmeldingInfo: [],
  arbeidsgiver: {},
};

const mapStateToProps = state => ({
  behandlingStatusKode: behandlingSelectors.getBehandlingStatus(state).kode,
});

export default connect(mapStateToProps)(UttakPeriodeInnhold);
