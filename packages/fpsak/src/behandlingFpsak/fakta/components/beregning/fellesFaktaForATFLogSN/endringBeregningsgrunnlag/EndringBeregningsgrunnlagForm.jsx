import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { removeSpacesFromNumber } from 'utils/currencyUtils';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import BorderBox from 'sharedComponents/BorderBox';
import EndringBeregningsgrunnlagPeriodePanel from './EndringBeregningsgrunnlagPeriodePanel';

import styles from './endringBeregningsgrunnlagForm.less';


const ElementWrapper = ({ children }) => children;

const endringBGFieldArrayNamePrefix = 'endringBGPeriode';

const getFieldNameKey = index => (endringBGFieldArrayNamePrefix + index);


/**
 * EndringBeregningsgrunnlagForm
 *
 * Container komponent.. Behandling av aksjonspunktet for fasetting av nytt/endret beregningsgrunnlag.
 */

export class EndringBeregningsgrunnlagForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openPanels: props.perioder.map(periode => periode.fom),
    };
    this.showPanel = this.showPanel.bind(this);
  }

  showPanel(fom) {
    const { openPanels } = this.state;
    if (openPanels.includes(fom)) {
      this.setState({ openPanels: openPanels.filter(panel => panel !== fom) });
    } else {
      openPanels.push(fom);
      this.setState({ openPanels });
    }
  }

  render() {
    const {
      readOnly,
      perioder,
      isAksjonspunktClosed,
      skalHaEndretInformasjonIHeader,
    } = this.props;
    const { openPanels } = this.state;
    return (
      <BorderBox className={styles.lessPadding}>
        {perioder.map((periode, index) => (
          <ElementWrapper key={endringBGFieldArrayNamePrefix + periode.fom}>
            <VerticalSpacer eightPx />
            <EndringBeregningsgrunnlagPeriodePanel
              readOnly={readOnly}
              endringBGFieldArrayName={getFieldNameKey(index)}
              fom={periode.fom}
              tom={periode.tom}
              open={openPanels ? openPanels.filter(panel => panel === periode.fom).length > 0 : false}
              harPeriodeAarsakGraderingEllerRefusjon={periode.harPeriodeAarsakGraderingEllerRefusjon}
              isAksjonspunktClosed={isAksjonspunktClosed}
              showPanel={this.showPanel}
              skalHaEndretInformasjonIHeader={skalHaEndretInformasjonIHeader}
            />
            <VerticalSpacer eightPx />
          </ElementWrapper>
        ))
        }
      </BorderBox>
    );
  }
}

EndringBeregningsgrunnlagForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  skalHaEndretInformasjonIHeader: PropTypes.bool,
};

EndringBeregningsgrunnlagForm.defaultProps = {
  skalHaEndretInformasjonIHeader: false,
};


EndringBeregningsgrunnlagForm.validate = (values, endringBGPerioder) => {
  const errors = {};
  if (endringBGPerioder) {
    for (let i = 0; i < endringBGPerioder.length; i += 1) {
      errors[getFieldNameKey(i)] = EndringBeregningsgrunnlagPeriodePanel.validate(values[getFieldNameKey(i)]);
    }
  }
  return errors;
};


EndringBeregningsgrunnlagForm.buildInitialValues = (endringBGPerioder) => {
  const initialValues = {};
  if (!endringBGPerioder) {
    return initialValues;
  }
  endringBGPerioder.forEach((periode, index) => {
    initialValues[getFieldNameKey(index)] = EndringBeregningsgrunnlagPeriodePanel.buildInitialValues(periode);
  });
  return initialValues;
};

const getAndelsnr = (andelValues) => {
  if (andelValues.nyAndel === true) {
    return andelValues.andel;
  }
  return andelValues.andelsnr;
};


EndringBeregningsgrunnlagForm.transformValues = (values, endringBGPerioder) => {
  const endringBeregningsgrunnlagPerioder = [];
  for (let index = 0; index < endringBGPerioder.length; index += 1) {
    if (endringBGPerioder[index].harPeriodeAarsakGraderingEllerRefusjon) {
      endringBeregningsgrunnlagPerioder.push({
        andeler: values[getFieldNameKey(index)].map(aktivitet => ({
          andel: aktivitet.andel,
          andelsnr: getAndelsnr(aktivitet),
          arbeidsforholdId: aktivitet.arbeidsforholdId !== '' ? aktivitet.arbeidsforholdId : null,
          nyAndel: aktivitet.nyAndel,
          lagtTilAvSaksbehandler: aktivitet.lagtTilAvSaksbehandler,
          fastsatteVerdier: {
            refusjon: aktivitet.skalKunneEndreRefusjon ? removeSpacesFromNumber(aktivitet.refusjonskrav) : null,
            fastsattBeløp: removeSpacesFromNumber(aktivitet.fastsattBeløp),
            inntektskategori: aktivitet.inntektskategori,
          },
        })),
        fom: endringBGPerioder[index].fom,
        tom: endringBGPerioder[index].tom,
      });
    }
  }
  return {
    fastsettEndringBeregningsgrunnlag: { endretBeregningsgrunnlagPerioder: endringBeregningsgrunnlagPerioder },
  };
};

export default EndringBeregningsgrunnlagForm;
