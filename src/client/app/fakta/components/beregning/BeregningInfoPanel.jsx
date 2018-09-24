import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import { getKodeverk } from 'kodeverk/duck';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import {
  getAksjonspunkter,
  getFaktaOmBeregningTilfellerKoder,
  getTilstøtendeYtelse,
} from 'behandling/behandlingSelectors';
import withDefaultToggling from 'fakta/withDefaultToggling';
import faktaPanelCodes from 'fakta/faktaPanelCodes';
import FaktaEkspandertpanel from 'fakta/components/FaktaEkspandertpanel';
import AksjonspunktHelpText from '@fpsak-frontend/shared-components/AksjonspunktHelpText';
import { Hovedknapp } from 'nav-frontend-knapper';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import FaktaBegrunnelseTextField from 'fakta/components/FaktaBegrunnelseTextField';
import FaktaSubmitButton from 'fakta/components/FaktaSubmitButton';
import faktaOmBeregningTilfelle, { erATFLSpesialtilfelle } from 'kodeverk/faktaOmBeregningTilfelle';
import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';
import TilstotendeYtelseForm from './tilstøtendeYtelse/TilstøtendeYtelseForm';
import FaktaForATFLOgSNPanel, {
  getHelpTextsFaktaForATFLOgSN, transformValuesFaktaForATFLOgSN,
  buildInitialValuesFaktaForATFLOgSN, getValidationFaktaForATFLOgSN,
} from './fellesFaktaForATFLogSN/FaktaForATFLOgSNPanel';
import { erNyoppstartetFLField } from './fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import { lonnsendringField } from './fellesFaktaForATFLogSN/vurderOgFastsettATFL/forms/LonnsendringForm';


export const formName = 'faktaOmBeregningForm';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
  AVKLAR_BEREGNINGSGRUNNLAG_OG_INNTEKTSKATEGORI_FOR_BRUKER_MED_TILSTOTENDE_YTELSE,
} = aksjonspunktCodes;

const faktaOmBeregningAksjonspunkter = [VURDER_FAKTA_FOR_ATFL_SN, AVKLAR_BEREGNINGSGRUNNLAG_OG_INNTEKTSKATEGORI_FOR_BRUKER_MED_TILSTOTENDE_YTELSE];

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);


export const getHelpTexts = createSelector(
  [getHelpTextsFaktaForATFLOgSN, getAksjonspunkter, getTilstøtendeYtelse],
  (helpTexts, aksjonspunkter, tilstotendeYtelse) => {
    if (hasAksjonspunkt(AVKLAR_BEREGNINGSGRUNNLAG_OG_INNTEKTSKATEGORI_FOR_BRUKER_MED_TILSTOTENDE_YTELSE, aksjonspunkter)) {
      if (tilstotendeYtelse.erBesteberegning) {
        helpTexts.push(<FormattedMessage
          key="AvklarBGTilstøtendeYtelseMedBB"
          id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.TilstøtendeYtelseBesteberegning"
        />);
      } else {
        helpTexts.push(<FormattedMessage
          key="AvklarBGTilstøtendeYtelse"
          id="BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.TilstøtendeYtelse"
        />);
      }
    }
    return helpTexts;
  },
);

const findAksjonspunktMedBegrunnelse = aksjonspunkter => aksjonspunkter
  .filter(ap => faktaOmBeregningAksjonspunkter.includes(ap.definisjon.kode) && ap.begrunnelse !== null)[0];


const createRelevantForms = (readOnly, aksjonspunkter, skalViseATFLTabell) => (
  <div>
    {hasAksjonspunkt(AVKLAR_BEREGNINGSGRUNNLAG_OG_INNTEKTSKATEGORI_FOR_BRUKER_MED_TILSTOTENDE_YTELSE, aksjonspunkter)
    && (
      <TilstotendeYtelseForm
        readOnly={readOnly}
      />
    )
    }
    {hasAksjonspunkt(AVKLAR_BEREGNINGSGRUNNLAG_OG_INNTEKTSKATEGORI_FOR_BRUKER_MED_TILSTOTENDE_YTELSE, aksjonspunkter)
    && hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)
    && <VerticalSpacer twentyPx />
    }
    {hasAksjonspunkt(VURDER_FAKTA_FOR_ATFL_SN, aksjonspunkter)
    && (
      <FaktaForATFLOgSNPanel
        readOnly={readOnly}
        formName={formName}
        skalViseATFLTabell={skalViseATFLTabell}
      />
    )
    }
  </div>
);

const ikkeSpesialtilfelleOgMinstEtAksjonspunkt = (skalViseATFLTabell, faktaTilfeller, aksjonspunkter) => {
  if (!aksjonspunkter || aksjonspunkter.length < 1) {
    return false;
  }
  if (erATFLSpesialtilfelle(faktaTilfeller) && !skalViseATFLTabell) {
    return false;
  }
  return true;
};

const skalViseInntektTabellUansett = (tilfeller, aksjonspunkter) => {
  if (aksjonspunkter === undefined || aksjonspunkter.length < 1) {
    return false;
  }
  const atflFaktaAP = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN);
  if (erATFLSpesialtilfelle(tilfeller) && !isAksjonspunktOpen(atflFaktaAP.status.kode)) {
    return true;
  }
  return (tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)
    && !tilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)
    && !tilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)
    && !tilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE));
};

/**
 * BeregningInfoPanel
 *
 * Container komponent.. Har ansvar for å sette opp Redux Formen for "avklar fakta om beregning" panel.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export class BeregningInfoPanelImpl extends Component {
  constructor() {
    super();

    this.state = {
      skalViseKombinertATFLTabell: false,
    };

    this.showTableCallback = this.showTableCallback.bind(this);
  }

  componentWillMount() {
    const { faktaTilfeller, aksjonspunkter } = this.props;
    if (skalViseInntektTabellUansett(faktaTilfeller, aksjonspunkter)) {
      this.setState({
        skalViseKombinertATFLTabell: true,
      });
    }
  }

  showTableCallback() {
    const { knappForInntektstabellSkalKunneKlikkes } = this.props;
    if (knappForInntektstabellSkalKunneKlikkes) {
      this.setState({
        skalViseKombinertATFLTabell: true,
      });
    }
  }

  render() {
    const {
      showTableCallback,
      props: {
        intl,
        openInfoPanels,
        toggleInfoPanelCallback,
        hasOpenAksjonspunkter,
        readOnly,
        aksjonspunkter,
        submittable,
        initialValues,
        helpText,
        faktaTilfeller,
        knappForInntektstabellSkalKunneKlikkes,
        ...formProps
      },
      state: {
        skalViseKombinertATFLTabell,
      },
    } = this;
    return (
      <FaktaEkspandertpanel
        title={intl.formatMessage({ id: 'BeregningInfoPanel.Title' })}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.BEREGNING)}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        faktaId={faktaPanelCodes.BEREGNING}
        readOnly={readOnly}
      >
        <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>{helpText}</AksjonspunktHelpText>
        <VerticalSpacer sixteenPx />
        <VerticalSpacer sixteenPx />
        <form onSubmit={formProps.handleSubmit}>
          {createRelevantForms(readOnly, aksjonspunkter, skalViseKombinertATFLTabell)}
          {erATFLSpesialtilfelle(faktaTilfeller) && !skalViseKombinertATFLTabell
          && (
            <Hovedknapp
              mini
              htmlType="button"
              onClick={showTableCallback}
              disabled={!knappForInntektstabellSkalKunneKlikkes}
            >
              <FormattedMessage id="BeregningInfoPanel.VisTabell" />
            </Hovedknapp>
          )
          }
          {ikkeSpesialtilfelleOgMinstEtAksjonspunkt(skalViseKombinertATFLTabell, faktaTilfeller, aksjonspunkter)
          && (
            <ElementWrapper>
              <VerticalSpacer eightPx />
              <VerticalSpacer twentyPx />
              <FaktaBegrunnelseTextField
                isDirty={formProps.dirty}
                isSubmittable={submittable}
                isReadOnly={readOnly}
                hasBegrunnelse={!!initialValues.begrunnelse}
              />
              <VerticalSpacer twentyPx />
              <FaktaSubmitButton formName={formProps.form} isSubmittable={submittable} isReadOnly={readOnly} hasOpenAksjonspunkter={hasOpenAksjonspunkter} />
            </ElementWrapper>
          )
          }
        </form>
      </FaktaEkspandertpanel>
    );
  }
}

BeregningInfoPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  initialValues: PropTypes.shape(),
  submittable: PropTypes.bool.isRequired,
  helpText: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  faktaTilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
  knappForInntektstabellSkalKunneKlikkes: PropTypes.bool.isRequired,
  ...formPropTypes,
};

BeregningInfoPanelImpl.defaultProps = {
  initialValues: {},
};

const transformValues = createSelector(
  [getTilstøtendeYtelse, transformValuesFaktaForATFLOgSN, getAksjonspunkter],
  (tilstotendeYtelse, transformValuesVurderFakta, aksjonspunkter) => (values) => {
    const aksjonspunkterMedValues = transformValuesVurderFakta(values);
    const beg = values.begrunnelse;
    if (hasAksjonspunkt(AVKLAR_BEREGNINGSGRUNNLAG_OG_INNTEKTSKATEGORI_FOR_BRUKER_MED_TILSTOTENDE_YTELSE, aksjonspunkter)) {
      const faktor = tilstotendeYtelse.skalReduseres ? parseInt(tilstotendeYtelse.dekningsgrad, 10) / 100 : 1;
      aksjonspunkterMedValues.push(TilstotendeYtelseForm.transformValues(values, beg, faktor));
    }
    return aksjonspunkterMedValues;
  },
);

const buildInitialValues = createSelector(
  [getTilstøtendeYtelse, getAksjonspunkter, buildInitialValuesFaktaForATFLOgSN, getKodeverk(kodeverkTyper.AKTIVITET_STATUS)],
  (tilstotendeYtelse, aksjonspunkter, initialValuesFelles, aktivitetstatuser) => ({
    ...FaktaBegrunnelseTextField.buildInitialValues(findAksjonspunktMedBegrunnelse(aksjonspunkter)),
    ...initialValuesFelles,
    ...TilstotendeYtelseForm.buildInitialValues(tilstotendeYtelse, aktivitetstatuser),
  }),
);

const getValidate = createSelector(
  [getValidationFaktaForATFLOgSN],
  validationForVurderFakta => values => ({
    ...validationForVurderFakta(values),
  }),
);


const mapStateToProps = (state, initialProps) => {
  const faktaTilfeller = getFaktaOmBeregningTilfellerKoder(state) ? getFaktaOmBeregningTilfellerKoder(state) : [];
  const erLonnsendring = behandlingFormValueSelector(formName)(state, lonnsendringField);
  const erNyoppstartetFL = behandlingFormValueSelector(formName)(state, erNyoppstartetFLField);
  const knappForInntektstabellSkalKunneKlikkes = (erLonnsendring !== null && erNyoppstartetFL !== null)
    && (erLonnsendring !== undefined && erNyoppstartetFL !== undefined);
  return {
    knappForInntektstabellSkalKunneKlikkes,
    faktaTilfeller,
    helpText: getHelpTexts(state),
    initialValues: buildInitialValues(state),
    validate: getValidate(state),
    onSubmit: values => initialProps.submitCallback(transformValues(state)(values)),
  };
};

const BeregningInfoPanel = withDefaultToggling(faktaPanelCodes.BEREGNING, faktaOmBeregningAksjonspunkter)(connect(mapStateToProps)(behandlingForm({
  form: formName,
})(injectIntl(BeregningInfoPanelImpl))));

BeregningInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => faktaOmBeregningAksjonspunkter.includes(ap.definisjon.kode));

export default BeregningInfoPanel;
