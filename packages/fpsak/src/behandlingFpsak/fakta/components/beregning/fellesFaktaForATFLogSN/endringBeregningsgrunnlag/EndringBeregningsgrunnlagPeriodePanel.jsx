import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';
import { formatCurrencyNoKr } from '@fpsak-frontend/utils';
import classnames from 'classnames/bind';
import RenderEndringBGFieldArray from './RenderEndringBGFieldArray';
import { createEndringHeadingForDate, renderDateHeading } from './EndretBeregningsgrunnlagUtils';
import {
  settAndelIArbeid, setGenerellAndelsinfo, setArbeidsforholdInitialValues, settFastsattBelop, settReadOnlyBelop,
} from '../BgFordelingUtils';


import styles from './endringBeregningsgrunnlagPeriodePanel.less';


const classNames = classnames.bind(styles);


/**
 * EndringBeregningsgrunnlagPeriodePanel
 *
 * Presentasjonskomponent. Viser ekspanderbart panel for perioder i nytt/endret beregningsgrunnlag
 */

const EndringBeregningsgrunnlagPeriodePanelImpl = ({
  readOnly,
  endringBGFieldArrayName,
  fom,
  harPeriodeAarsakGraderingEllerRefusjon,
  isAksjonspunktClosed,
  open,
  showPanel,
  heading,
  formName,
}) => (
  <EkspanderbartpanelPure
    className={readOnly ? styles.statusOk : classNames(`endringBeregningsgrunnlagPeriode--${fom}`)}
    tittel={heading}
    apen={open}
    onClick={() => showPanel(fom)}
  >
    <FieldArray
      name={endringBGFieldArrayName}
      component={RenderEndringBGFieldArray}
      readOnly={readOnly}
      periodeUtenAarsak={!harPeriodeAarsakGraderingEllerRefusjon}
      isAksjonspunktClosed={isAksjonspunktClosed}
      formName={formName}
    />
  </EkspanderbartpanelPure>
);

EndringBeregningsgrunnlagPeriodePanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  endringBGFieldArrayName: PropTypes.string.isRequired,
  fom: PropTypes.string.isRequired,
  open: PropTypes.bool,
  harPeriodeAarsakGraderingEllerRefusjon: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  showPanel: PropTypes.func.isRequired,
  heading: PropTypes.element.isRequired,
  formName: PropTypes.string,
};

EndringBeregningsgrunnlagPeriodePanelImpl.defaultProps = {
  open: null,
  formName: undefined,
};


EndringBeregningsgrunnlagPeriodePanelImpl.validate = (values, fastsattIForstePeriode,
  skalRedigereInntekt) => RenderEndringBGFieldArray.validate(values, fastsattIForstePeriode, skalRedigereInntekt);

EndringBeregningsgrunnlagPeriodePanelImpl.buildInitialValues = (periode, readOnly) => {
  if (!periode || !periode.endringBeregningsgrunnlagAndeler) {
    return {};
  }
  return (
    periode.endringBeregningsgrunnlagAndeler.map(andel => ({
      ...setGenerellAndelsinfo(andel),
      ...setArbeidsforholdInitialValues(andel),
      andelIArbeid: settAndelIArbeid(andel.andelIArbeid),
      fordelingForrigeBehandling: andel.fordelingForrigeBehandling || andel.fordelingForrigeBehandling === 0
        ? formatCurrencyNoKr(andel.fordelingForrigeBehandling) : '',
      fastsattBeløp: settFastsattBelop(andel.beregnetPrMnd, andel.fastsattForrige, andel.fastsattAvSaksbehandler),
      readOnlyBelop: settReadOnlyBelop(readOnly, andel.fordelingForrigeBehandling,
        andel.beregnetPrMnd, andel.snittIBeregningsperiodenPrMnd),
      skalRedigereInntekt: periode.harPeriodeAarsakGraderingEllerRefusjon,
      snittIBeregningsperiodenPrMnd: andel.snittIBeregningsperiodenPrMnd,
      refusjonskrav: andel.refusjonskrav !== null && andel.refusjonskrav !== undefined ? formatCurrencyNoKr(andel.refusjonskrav) : '',
      skalKunneEndreRefusjon: periode.skalKunneEndreRefusjon && !andel.lagtTilAvSaksbehandler
      && andel.refusjonskravFraInntektsmelding ? periode.skalKunneEndreRefusjon : false,
      belopFraInntektsmelding: andel.belopFraInntektsmelding,
      harPeriodeAarsakGraderingEllerRefusjon: periode.harPeriodeAarsakGraderingEllerRefusjon,
      refusjonskravFraInntektsmelding: andel.refusjonskravFraInntektsmelding,
    }))
  );
};

const mapStateToProps = (state, props) => {
  if (props.skalHaEndretInformasjonIHeader) {
    return ({
      heading: createEndringHeadingForDate(state, props.fom, props.tom, renderDateHeading(props.fom, props.tom),
        props.harPeriodeAarsakGraderingEllerRefusjon, props.formName),
    });
  }
  return ({
    heading: renderDateHeading(props.fom, props.tom),
  });
};

export default connect(mapStateToProps)(EndringBeregningsgrunnlagPeriodePanelImpl);
