import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { removeSpacesFromNumber } from 'utils/currencyUtils';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from 'utils/formats';
import moment from 'moment';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import {
  getAksjonspunkter,
  getEndringBeregningsgrunnlag,
  getEndringBeregningsgrunnlagPerioder,
  getFaktaOmBeregningTilfellerKoder,
} from 'behandling/behandlingSelectors';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import createVisningsnavnForAktivitet from 'utils/arbeidsforholdUtil';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { byggListeSomStreng } from '../tilstøtendeYtelse/YtelsePanel';
import EndringBeregningsgrunnlagPeriodePanel from './EndringBeregningsgrunnlagPeriodePanel';

const ElementWrapper = ({ children }) => children;

const endringBGFieldArrayNamePrefix = 'endringBGPeriode';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const getFieldNameKey = index => (endringBGFieldArrayNamePrefix + index);

const formatDate = date => (date ? moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT) : '-');

const getEndredeArbeidsforhold = createSelector(
  [getEndringBeregningsgrunnlag],
  (endringBG) => {
    if (endringBG) {
      return endringBG.endredeArbeidsforhold;
    }
    return [];
  },
);

const lagPeriodeStreng = (perioder) => {
  const listeMedPeriodeStrenger = perioder.map((periode) => {
    let periodeStreng = ` f.o.m. ${formatDate(periode.fom)}`;
    if (periode.tom && periode.tom !== null) {
      periodeStreng = periodeStreng.concat(` - t.o.m. ${formatDate(periode.tom)}`);
    }
    return periodeStreng;
  });
  return byggListeSomStreng(listeMedPeriodeStrenger);
};


export const createEndretArbeidsforholdString = (listOfArbeidsforhold, gjelderGradering) => {
  const listOfStrings = listOfArbeidsforhold.map((arbeidsforhold) => {
    const navnOgOrgnr = createVisningsnavnForAktivitet(arbeidsforhold);
    const periodeStreng = gjelderGradering
      ? lagPeriodeStreng(arbeidsforhold.perioderMedGraderingEllerRefusjon.filter(({ erGradering }) => erGradering))
      : lagPeriodeStreng(arbeidsforhold.perioderMedGraderingEllerRefusjon.filter(({ erRefusjon }) => erRefusjon));
    return navnOgOrgnr + periodeStreng;
  });
  return byggListeSomStreng(listOfStrings);
};

export const lagHelpTextsEndringBG = (endredeArbeidsforhold) => {
  const helpTexts = [];
  const gradering = endredeArbeidsforhold
    .filter(arbeidsforhold => arbeidsforhold.perioderMedGraderingEllerRefusjon.map(({ erGradering }) => erGradering).includes(true));
  const refusjon = endredeArbeidsforhold
    .filter(arbeidsforhold => arbeidsforhold.perioderMedGraderingEllerRefusjon.map(({ erRefusjon }) => erRefusjon).includes(true));
  if (gradering.length > 0) {
    const arbeidsforholdString = createEndretArbeidsforholdString(gradering, true);
    helpTexts.push(<FormattedMessage
      key="EndringBeregningsgrunnlagGradering"
      id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Gradering"
      values={{ arbeidsforhold: arbeidsforholdString }}
    />);
  }
  if (refusjon.length > 0) {
    const arbeidsforholdString = createEndretArbeidsforholdString(refusjon, false);
    helpTexts.push(<FormattedMessage
      key="EndringBeregningsgrunnlagRefusjon"
      id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Refusjon"
      values={{ arbeidsforhold: arbeidsforholdString }}
    />);
  }
  if (helpTexts.length === 2) {
    return [
      <ElementWrapper>
        {helpTexts[0]}
        <VerticalSpacer eightPx />
        {helpTexts[1]}
      </ElementWrapper>];
  }
  return helpTexts;
};


export const getHelpTextsEndringBG = createSelector(
  [getFaktaOmBeregningTilfellerKoder, getEndredeArbeidsforhold, getAksjonspunkter],
  (aktivertePaneler, endredeArbeidsforhold, aksjonspunkter) => (hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter))
    && (aktivertePaneler && aktivertePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG)
      ? lagHelpTextsEndringBG(endredeArbeidsforhold) : []),
);


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
    } = this.props;
    const { openPanels } = this.state;
    return (
      <ElementWrapper>
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
            />
            <VerticalSpacer eightPx />
          </ElementWrapper>
        ))
        }
      </ElementWrapper>
    );
  }
}

EndringBeregningsgrunnlagForm.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  perioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
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


EndringBeregningsgrunnlagForm.buildInitialValues = (endringBGPerioder, aktivitetstatuskoder) => {
  const initialValues = {};
  if (!endringBGPerioder) {
    return initialValues;
  }
  endringBGPerioder.forEach((periode, index) => {
    initialValues[getFieldNameKey(index)] = EndringBeregningsgrunnlagPeriodePanel.buildInitialValues(periode, aktivitetstatuskoder);
  });
  return initialValues;
};

const getAndelsnr = (andelValues) => {
  if (andelValues.nyAndel === true) {
    return andelValues.andel;
  }
  return andelValues.andelsnr;
};

export const harKunEndringBG = aktivertePaneler => (aktivertePaneler && aktivertePaneler.length === 1
  && aktivertePaneler[0] === faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG);

EndringBeregningsgrunnlagForm.transformValues = (values, endringBGPerioder) => {
  const endringBeregningsgrunnlagPerioder = [];
  for (let index = 0; index < endringBGPerioder.length; index += 1) {
    if (endringBGPerioder[index].harPeriodeAarsakGraderingEllerRefusjon) {
      endringBeregningsgrunnlagPerioder.push({
        endretAndeler: values[getFieldNameKey(index)].map(aktivitet => ({
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


const mapStateToProps = state => ({ perioder: getEndringBeregningsgrunnlagPerioder(state) ? getEndringBeregningsgrunnlagPerioder(state) : [] });


export default connect(mapStateToProps)(EndringBeregningsgrunnlagForm);
