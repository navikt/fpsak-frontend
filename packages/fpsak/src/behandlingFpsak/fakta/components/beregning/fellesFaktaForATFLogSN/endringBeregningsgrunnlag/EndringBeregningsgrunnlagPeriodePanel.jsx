import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import classnames from 'classnames/bind';
import RenderEndringBGFieldArray from './RenderEndringBGFieldArray';
import { createEndringHeadingForDate, renderDateHeading } from './EndretBeregningsgrunnlagUtils';
import {
  settAndelIArbeid, setGenerellAndelsinfo, setArbeidsforholdInitialValues, settFastsattBelop,
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
      readOnly={readOnly || !harPeriodeAarsakGraderingEllerRefusjon}
      periodeUtenAarsak={!harPeriodeAarsakGraderingEllerRefusjon}
      isAksjonspunktClosed={isAksjonspunktClosed}
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
};

EndringBeregningsgrunnlagPeriodePanelImpl.defaultProps = {
  open: null,
};


EndringBeregningsgrunnlagPeriodePanelImpl.validate = values => RenderEndringBGFieldArray.validate(values);

EndringBeregningsgrunnlagPeriodePanelImpl.buildInitialValues = (periode) => {
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
      fastsattBeløp: settFastsattBelop(periode.harPeriodeAarsakGraderingEllerRefusjon,
        andel.beregnetPrMnd, andel.fastsattForrige, andel.fordelingForrigeBehandling, andel.fastsattAvSaksbehandler),
      refusjonskrav: andel.refusjonskrav ? formatCurrencyNoKr(andel.refusjonskrav) : '0',
      skalKunneEndreRefusjon: periode.skalKunneEndreRefusjon ? periode.skalKunneEndreRefusjon : false,
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
        props.harPeriodeAarsakGraderingEllerRefusjon),
    });
  }
  return ({
    heading: renderDateHeading(props.fom, props.tom),
  });
};

export default connect(mapStateToProps)(EndringBeregningsgrunnlagPeriodePanelImpl);
