import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';
import { isEmpty } from 'utils/arrayUtils';
import classnames from 'classnames/bind';
import { formatCurrencyNoKr } from 'utils/currencyUtils';
import RenderBruttoBGFordelingFieldArray from './RenderBruttoBGFordelingFieldArray';
import { createEndringHeadingForDate, renderDateHeading } from '../endringBeregningsgrunnlag/EndretBeregningsgrunnlagUtils';
import {
  settAndelIArbeid, setArbeidsforholdInitialValues, settFastsattBelop, setGenerellAndelsinfo,
} from '../BgFordelingUtils';
import {
  validateAndelFields, validateSumFastsattBelop, validateUlikeAndeler,
} from '../ValidateAndelerUtils';

import styles from './fordelingAvBruttoBgIKombinasjon.less';

const classNames = classnames.bind(styles);

/**
 * FordelingAvBruttoBgIKombinasjon
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for avklaring av beregningsgrunnlag ved tilstøtende ytelse
 * i kombinasjon med endret beregningsgrunnlag.
 */

export const FordelingAvBruttoBgIKombinasjonImpl = ({
  readOnly,
  fieldArrayName,
  showPanel,
  fom,
  open,
  heading,
  endringBGPeriode,
  formName,
}) => (
  <div>
    <EkspanderbartpanelPure
      className={readOnly ? styles.statusOk : classNames(`bruttoBGFordelingKombinasjon--${fom}`)}
      tittel={heading}
      apen={open}
      onClick={() => showPanel(fom)}
    >
      <FieldArray
        name={fieldArrayName}
        component={RenderBruttoBGFordelingFieldArray}
        readOnly={readOnly}
        endringBGPeriode={endringBGPeriode}
        formName={formName}
      />
    </EkspanderbartpanelPure>
  </div>
);

FordelingAvBruttoBgIKombinasjonImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  showPanel: PropTypes.func.isRequired,
  fom: PropTypes.string.isRequired,
  fieldArrayName: PropTypes.string.isRequired,
  open: PropTypes.bool,
  heading: PropTypes.element.isRequired,
  endringBGPeriode: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  formName: PropTypes.string.isRequired,
};

FordelingAvBruttoBgIKombinasjonImpl.defaultProps = {
  open: null,
};


export const setFordelingForrigeYtelse = (tilstotendeYtelseAndeler, andel) => {
  const andelerFraTY = tilstotendeYtelseAndeler
    .filter(({ andelsnr }) => andel.andelsnr === andelsnr);
  if (andelerFraTY.length > 0) {
    return andelerFraTY[0].lagtTilAvSaksbehandler === true ? '' : formatCurrencyNoKr(andelerFraTY[0].fordelingForrigeYtelse);
  }
  return 0;
};

FordelingAvBruttoBgIKombinasjonImpl.validate = (values, sumFordelingForstePeriode) => {
  const arrayErrors = values.map(andelFieldValues => validateAndelFields(andelFieldValues));
  if (arrayErrors.some(errors => errors !== null)) {
    return arrayErrors;
  }
  if (isEmpty(values)) {
    return null;
  }
  const ulikeAndelerError = validateUlikeAndeler(values);
  if (ulikeAndelerError) {
    return { _error: ulikeAndelerError };
  }
  const fastsattBelopError = validateSumFastsattBelop(values, sumFordelingForstePeriode);
  if (fastsattBelopError) {
    return { _error: fastsattBelopError };
  }
  return null;
};

FordelingAvBruttoBgIKombinasjonImpl.buildInitialValues = (endretBGPeriode, tilstotendeYtelse) => {
  if (!tilstotendeYtelse || !tilstotendeYtelse.tilstøtendeYtelseAndeler) {
    return {};
  }
  if (!endretBGPeriode || !endretBGPeriode.endringBeregningsgrunnlagAndeler) {
    return {};
  }
  return (
    endretBGPeriode.endringBeregningsgrunnlagAndeler.map(andel => ({
      ...setGenerellAndelsinfo(andel),
      ...setArbeidsforholdInitialValues(andel),
      skalKunneEndreRefusjon: endretBGPeriode.skalKunneEndreRefusjon ? endretBGPeriode.skalKunneEndreRefusjon : false,
      fordelingForrigeYtelse: setFordelingForrigeYtelse(tilstotendeYtelse.tilstøtendeYtelseAndeler, andel),
      fastsattBeløp: settFastsattBelop(endretBGPeriode.harPeriodeAarsakGraderingEllerRefusjon,
        andel.beregnetPrAar, andel.fastsattForrigePrAar, andel.fordelingForrigeBehandlingPrAar, andel.fastsattAvSaksbehandler),
      refusjonskrav: andel.refusjonskrav ? formatCurrencyNoKr(andel.refusjonskrav * 12) : '0',
      andelIArbeid: settAndelIArbeid(andel.andelIArbeid),
      refusjonskravFraInntektsmelding: andel.refusjonskravFraInntektsmelding !== null
        ? andel.refusjonskravFraInntektsmelding * 12 : null,
      belopFraInntektsmelding: andel.belopFraInntektsmelding !== null
        ? andel.belopFraInntektsmelding * 12 : null,
    }))
  );
};


const mapStateToProps = (state, props) => ({
  heading: createEndringHeadingForDate(state, props.endringBGPeriode.fom, props.endringBGPeriode.tom,
    renderDateHeading(props.endringBGPeriode.fom, props.endringBGPeriode.tom), true),
});


export default connect(mapStateToProps)(FordelingAvBruttoBgIKombinasjonImpl);
