import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import BorderBox from 'sharedComponents/BorderBox';
import { removeSpacesFromNumber } from 'utils/currencyUtils';
import { getEndringBeregningsgrunnlagPerioder } from 'behandling/behandlingSelectors';
import TilstotendeYtelseForm, { getAndelsnr } from './TilstøtendeYtelseForm';
import { fordelingAvBruttoBGFieldArrayName } from './FordelingAvBruttoBeregningsgrunnlagPanel';
import { createEndringHeadingForDate, renderDateHeadingWithPretext } from '../endringBeregningsgrunnlag/EndretBeregningsgrunnlagUtils';
import FordelingAvBruttoBgIKombinasjon from './FordelingAvBruttoBgIKombinasjon';

import styles from './tilstotendeYtelseOgEndretBeregningsgrunnlag.less';

const fieldArrayNamePrefix = 'TYOgEndringIKombinasjonPeriode';

export const getFieldNameKey = index => (fieldArrayNamePrefix + index);

const getPerioderMedAarsak = endringBGPerioder => endringBGPerioder
  .filter(({ harPeriodeAarsakGraderingEllerRefusjon }) => harPeriodeAarsakGraderingEllerRefusjon === true);


/**
 * TilstotendeYtelseOgEndretBeregningsgrunnlag
 *
 * Komponent som håndterer kombinasjoner av endring beregningsgrunnlag og tilstøtende ytelse
 */
export class TilstotendeYtelseOgEndretBeregningsgrunnlagImpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skalViseEndretBeregningsgrunnlag: false,
      openPanels: props.perioder.map(periode => periode.fom),
    };
    this.showPanel = this.showPanel.bind(this);
    this.oppdaterCallback = this.oppdaterCallback.bind(this);
    if (props.perioder.length === 0) {
      props.showTableCallback();
    }
    if (props.isAksjonspunktClosed) {
      props.showTableCallback();
      this.state = {
        ...this.state,
        skalViseEndretBeregningsgrunnlag: true,
      };
    }
  }


  componentDidMount() {
    const {
      perioder, showTableCallback,
    } = this.props;
    if (perioder.length === 0) {
      showTableCallback();
    }
  }

  componentDidUpdate() {
    const {
      perioder, showTableCallback,
    } = this.props;
    if (perioder.length === 0) {
      showTableCallback();
    }
  }

  showPanel(panelId) {
    const { openPanels } = this.state;
    if (openPanels.includes(panelId)) {
      this.setState({ openPanels: openPanels.filter(id => id !== panelId) });
    } else {
      openPanels.push(panelId);
      this.setState({ openPanels });
    }
  }


  oppdaterCallback() {
    const { showTableCallback } = this.props;
    showTableCallback();
    this.setState({
      skalViseEndretBeregningsgrunnlag: true,
    });
  }

  render() {
    const {
      oppdaterCallback,
      props: {
        readOnly,
        perioder,
        tilstotendeYtelsePeriodeHeader,
        formName,
      },
      state: {
        skalViseEndretBeregningsgrunnlag,
        openPanels,
      },
    } = this;
    return (
      <ElementWrapper>
        <TilstotendeYtelseForm
          readOnly={readOnly}
          periodeHeader={tilstotendeYtelsePeriodeHeader}
          skalViseKnapp={perioder.length > 0 && !skalViseEndretBeregningsgrunnlag}
          btnClickCallback={oppdaterCallback}
          formName={formName}
        />
        {skalViseEndretBeregningsgrunnlag
        && perioder.map((periode, index) => (
          <BorderBox className={styles.lessPadding} key={fieldArrayNamePrefix + periode.fom}>
            <VerticalSpacer eightPx />
            <FordelingAvBruttoBgIKombinasjon
              readOnly={readOnly}
              fieldArrayName={getFieldNameKey(index)}
              endringBGPeriode={periode}
              open={openPanels ? openPanels.filter(panel => panel === periode.fom).length > 0 : false}
              showPanel={this.showPanel}
              formName={formName}
            />
            <VerticalSpacer eightPx />
          </BorderBox>
        ))
        }
      </ElementWrapper>
    );
  }
}


TilstotendeYtelseOgEndretBeregningsgrunnlagImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  showTableCallback: PropTypes.func.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tilstotendeYtelsePeriodeHeader: PropTypes.element,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
};

TilstotendeYtelseOgEndretBeregningsgrunnlagImpl.defaultProps = {
  tilstotendeYtelsePeriodeHeader: undefined,
};

const getPerioderEtterForsteMedAarsak = endringBGPerioder => (endringBGPerioder.length > 1
  ? getPerioderMedAarsak(endringBGPerioder.slice(1, endringBGPerioder.length)) : []);

export const harPerioderMedAarsakEtterForstePeriode = endringBGPerioder => endringBGPerioder.length > 1
  && getPerioderEtterForsteMedAarsak(endringBGPerioder).length > 0;

TilstotendeYtelseOgEndretBeregningsgrunnlagImpl.buildInitialValues = (tilstotendeYtelse, endringBGPerioder) => {
  if (!tilstotendeYtelse) {
    return {};
  }
  if (!endringBGPerioder || endringBGPerioder.length === 0) {
    return {};
  }
  if (harPerioderMedAarsakEtterForstePeriode(endringBGPerioder)) {
    const initialValues = {};
    const perioderEtterForsteMedAarsak = getPerioderEtterForsteMedAarsak(endringBGPerioder);
    perioderEtterForsteMedAarsak.forEach((periode, index) => {
      initialValues[getFieldNameKey(index)] = FordelingAvBruttoBgIKombinasjon.buildInitialValues(periode, tilstotendeYtelse);
    });
    return ({
      ...initialValues,
      ...TilstotendeYtelseForm.buildInitialValues(tilstotendeYtelse, endringBGPerioder),
    });
  }
  return TilstotendeYtelseForm.buildInitialValues(tilstotendeYtelse, endringBGPerioder);
};

const summerFordeling = values => values.map(({ fastsattBeløp }) => (fastsattBeløp ? removeSpacesFromNumber(fastsattBeløp) : 0))
  .reduce((sum, fastsattBeløp) => sum + fastsattBeløp, 0);

TilstotendeYtelseOgEndretBeregningsgrunnlagImpl.validate = (values, endringBGPerioder) => {
  if (!values) {
    return null;
  }
  if (harPerioderMedAarsakEtterForstePeriode(endringBGPerioder)) {
    const tyValues = values[fordelingAvBruttoBGFieldArrayName];
    if (!tyValues) {
      return null;
    }
    const sumFordeling = summerFordeling(tyValues);
    const errors = {};
    for (let i = 0; i < getPerioderEtterForsteMedAarsak(endringBGPerioder).length; i += 1) {
      errors[getFieldNameKey(i)] = FordelingAvBruttoBgIKombinasjon.validate(values[getFieldNameKey(i)], sumFordeling);
    }
    return errors;
  }
  return null;
};

const getAndelFromFieldValue = (fieldValue, faktor) => ({
  andel: fieldValue.andel,
  andelsnr: getAndelsnr(fieldValue),
  arbeidsforholdId: fieldValue.arbeidsforholdId !== '' ? fieldValue.arbeidsforholdId : null,
  reduserendeFaktor: faktor,
  refusjonskravPrAar: fieldValue.skalKunneEndreRefusjon ? removeSpacesFromNumber(fieldValue.refusjonskrav) : null,
  fastsattBeløp: removeSpacesFromNumber(fieldValue.fastsattBeløp),
  inntektskategori: fieldValue.inntektskategori,
  nyAndel: fieldValue.nyAndel,
  lagtTilAvSaksbehandler: fieldValue.lagtTilAvSaksbehandler,
});


TilstotendeYtelseOgEndretBeregningsgrunnlagImpl.transformValues = (values, faktor, gjelderBesteberegning, endringBGPerioder) => {
  const perioder = [];
  const forstePeriode = {
    andeler: values[fordelingAvBruttoBGFieldArrayName].map(fieldValue => (getAndelFromFieldValue(fieldValue, faktor))),
    fom: endringBGPerioder[0].fom,
    tom: endringBGPerioder[0].tom,
  };
  perioder.push(forstePeriode);
  const perioderEtterForsteMedAarsak = getPerioderEtterForsteMedAarsak(endringBGPerioder);
  if (perioderEtterForsteMedAarsak.length > 0) {
    for (let i = 0; i < perioderEtterForsteMedAarsak.length; i += 1) {
      perioder.push({
        andeler: values[getFieldNameKey(i)].map(fieldValue => (getAndelFromFieldValue(fieldValue, faktor))),
        fom: perioderEtterForsteMedAarsak[i].fom,
        tom: perioderEtterForsteMedAarsak[i].tom,
      });
    }
  }
  return ({
    tilstotendeYtelseOgEndretBG: {
      perioder,
      gjelderBesteberegning,
    },
  });
};

const periodeHeaderDefault = <FormattedMessage id="BeregningInfoPanel.FordelingBG.FordelingAvBruttoBG" />;


const mapStateToProps = (state) => {
  const perioder = getEndringBeregningsgrunnlagPerioder(state);
  if (perioder.length === 0) {
    return {
      perioder,
    };
  }
  if (perioder.length === 1) {
    const tilstotendeYtelsePeriodeHeader = createEndringHeadingForDate(state, perioder[0].fom, perioder[0].tom,
      periodeHeaderDefault, perioder[0].harPeriodeAarsakGraderingEllerRefusjon);
    return {
      perioder: [],
      tilstotendeYtelsePeriodeHeader,
    };
  }
  const perioderMedAarsakEtterForste = getPerioderMedAarsak(perioder.slice(1, perioder.length));
  const tilstotendeYtelsePeriodeHeader = createEndringHeadingForDate(state, perioder[0].fom, perioder[0].tom,
    perioderMedAarsakEtterForste.length === 0 ? periodeHeaderDefault : renderDateHeadingWithPretext(perioder[0].fom, perioder[0].tom),
    perioder[0].harPeriodeAarsakGraderingEllerRefusjon);
  return {
    perioder: perioderMedAarsakEtterForste,
    tilstotendeYtelsePeriodeHeader,
  };
};

export default connect(mapStateToProps)(TilstotendeYtelseOgEndretBeregningsgrunnlagImpl);
