import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import classnames from 'classnames/bind';
import { Normaltekst } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';

import { ISO_DATE_FORMAT, calcDays } from '@fpsak-frontend/utils';
import {
  FlexContainer, FlexRow, FlexColumn, Image,
} from '@fpsak-frontend/shared-components';
import overlapp from '@fpsak-frontend/assets/images/overlapp.svg';
import tomPeriode from '@fpsak-frontend/assets/images/tom_periode.svg';
import UttakPeriodeType from './UttakPeriodeType';
import UttakPeriodeInnhold from './UttakPeriodeInnhold';

import styles from './uttakPeriode.less';

const classNames = classnames.bind(styles);

const renderTomPeriode = () => (
  <div className={styles.periodeIconWrapper}>
    <Image src={tomPeriode} altCode="UttakInfoPanel.PeriodenharTommeDagerFremTilNestePeriode" />
    <Normaltekst><FormattedMessage id="UttakInfoPanel.TomPeriode" /></Normaltekst>
  </div>
);

const renderOverlappendePeriode = () => (
  <div className={styles.periodeIconWrapper}>
    <Image src={overlapp} altCode="UttakInfoPanel.PeriodenErOverlappende" />
    <Normaltekst><FormattedMessage id="UttakInfoPanel.OverlappendePeriode" /></Normaltekst>
  </div>
);

const renderValidationGraphic = (perioder, index, isLastIndex) => {
  if (!isLastIndex) {
    const periode = perioder[index];
    const nextPeriode = perioder[index + 1];
    const diff = calcDays(periode.tom, nextPeriode.fom, ISO_DATE_FORMAT);

    if (moment(periode.tom) >= moment(nextPeriode.fom)) {
      return renderOverlappendePeriode();
    }

    if (moment(periode.tom) < moment(nextPeriode.fom) && diff > 2) {
      return renderTomPeriode();
    }
  }

  return null;
};

const getClassName = (periode, readOnly) => {
  if (periode.oppholdÅrsak && periode.oppholdÅrsak.kode !== '-') {
    return classNames('oppholdPeriodeContainer', { active: !periode.bekreftet && !readOnly });
  }
  return classNames('periodeContainer', { active: !periode.bekreftet && !readOnly });
};

const UttakPeriode = ({
  fields,
  openSlettPeriodeModalCallback,
  updatePeriode,
  editPeriode,
  cancelEditPeriode,
  isAnyFormOpen,
  isNyPeriodeFormOpen,
  readOnly,
  perioder,
  inntektsmeldingInfo,
  endringsdato,
  farSøkerFør6Uker,
  meta,
}) => (
  <div>
    {meta.error && <AlertStripe className={styles.fullWidth} type="feil">{meta.error}</AlertStripe>}
    {meta.warning && <AlertStripe className={styles.fullWidth} type="info">{meta.warning}</AlertStripe>}

    <FlexContainer fluid wrap>
      {fields.map((fieldId, index, field) => {
        const periode = field.get(index);
        const harEndringsdatoSomErFørFørsteUttaksperiode = endringsdato ? moment(periode.fom).isAfter(endringsdato) : false;
        return (
          <React.Fragment key={fieldId}>
            <FlexRow>
              <FlexColumn className={styles.fullWidth}>
                {index === 0 && harEndringsdatoSomErFørFørsteUttaksperiode && renderTomPeriode()}
                <div className={getClassName(periode, readOnly)}>
                  <UttakPeriodeType
                    bekreftet={periode.bekreftet}
                    tilDato={periode.tom}
                    fraDato={periode.fom}
                    openForm={periode.openForm}
                    uttakPeriodeType={periode.uttakPeriodeType}
                    id={periode.id}
                    arbeidstidprosent={periode.arbeidstidsprosent}
                    arbeidsgiver={periode.arbeidsgiver}
                    utsettelseArsak={periode.utsettelseÅrsak}
                    overforingArsak={periode.overføringÅrsak}
                    isFromSøknad={periode.isFromSøknad}
                    erSelvstendig={periode.erSelvstendig}
                    erFrilanser={periode.erFrilanser}
                    openSlettPeriodeModalCallback={openSlettPeriodeModalCallback}
                    editPeriode={editPeriode}
                    isAnyFormOpen={isAnyFormOpen}
                    isNyPeriodeFormOpen={isNyPeriodeFormOpen}
                    readOnly={readOnly}
                    flerbarnsdager={periode.flerbarnsdager}
                    samtidigUttak={periode.samtidigUttak}
                    samtidigUttaksprosent={periode.samtidigUttaksprosent}
                    oppholdArsak={periode.oppholdÅrsak}
                  />
                  <UttakPeriodeInnhold
                    fieldId={fieldId}
                    bekreftet={periode.bekreftet}
                    utsettelseArsak={periode.utsettelseÅrsak}
                    openForm={periode.openForm}
                    arbeidstidprosent={periode.arbeidstidsprosent}
                    id={periode.id}
                    tilDato={periode.tom}
                    fraDato={periode.fom}
                    begrunnelse={periode.begrunnelse}
                    uttakPeriodeType={periode.uttakPeriodeType}
                    overforingArsak={periode.overføringÅrsak}
                    arbeidsgiver={periode.arbeidsgiver}
                    updatePeriode={updatePeriode}
                    cancelEditPeriode={cancelEditPeriode}
                    readOnly={readOnly}
                    inntektsmeldingInfo={inntektsmeldingInfo[index]}
                    farSøkerFør6Uker={farSøkerFør6Uker}
                  />
                </div>
                {perioder.length === fields.length
                  && renderValidationGraphic(perioder, index, index === (fields.length - 1))}
              </FlexColumn>
            </FlexRow>
          </React.Fragment>
        );
      })}
    </FlexContainer>
  </div>
);

UttakPeriode.propTypes = {
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  openSlettPeriodeModalCallback: PropTypes.func.isRequired,
  updatePeriode: PropTypes.func.isRequired,
  editPeriode: PropTypes.func.isRequired,
  cancelEditPeriode: PropTypes.func.isRequired,
  isAnyFormOpen: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isNyPeriodeFormOpen: PropTypes.bool.isRequired,
  inntektsmeldingInfo: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.shape())).isRequired,
  endringsdato: PropTypes.string,
  farSøkerFør6Uker: PropTypes.bool,
};

UttakPeriode.defaultProps = {
  endringsdato: undefined,
  farSøkerFør6Uker: false,
};

export default UttakPeriode;
