import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formPropTypes, initialize as reduxFormInitialize } from 'redux-form';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import AlertStripe from 'nav-frontend-alertstriper';
import {
  getBehandlingFormPrefix, FaktaBegrunnelseTextField, behandlingForm, FaktaSubmitButton,
} from '@fpsak-frontend/fp-felles';
import { AksjonspunktHelpTextTemp, BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { CheckboxField } from '@fpsak-frontend/form';
import { formNameAvklarAktiviteter, getFormInitialValuesForAvklarAktiviteter, getFormValuesForAvklarAktiviteter } from '../BeregningFormUtils';
import { erOverstyringAvBeregningsgrunnlag } from '../fellesFaktaForATFLogSN/BgFordelingUtils';
import VurderAktiviteterPanel from './VurderAktiviteterPanel';
import beregningAksjonspunkterPropType from '../../propTypes/beregningAksjonspunkterPropType';


import styles from './avklareAktiviteterPanel.less';


const {
  AVKLAR_AKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
} = aksjonspunktCodes;

export const BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME = 'begrunnelseAvklareAktiviteter';

export const MANUELL_OVERSTYRING_FIELD = 'manuellOverstyringBeregningAktiviteter';

const findAksjonspunktMedBegrunnelse = (aksjonspunkter, kode) => aksjonspunkter
  .filter((ap) => ap.definisjon.kode === kode && ap.begrunnelse !== null)[0];


const getAvklarAktiviteter = createSelector(
  [(ownProps) => ownProps.beregningsgrunnlag.faktaOmBeregning], (faktaOmBeregning = {}) => (faktaOmBeregning ? faktaOmBeregning.avklarAktiviteter : undefined),
);

export const erAvklartAktivitetEndret = createSelector(
  [(state, ownProps) => ownProps.aksjonspunkter,
    (state, ownProps) => getAvklarAktiviteter(ownProps),
    getFormValuesForAvklarAktiviteter,
    getFormInitialValuesForAvklarAktiviteter],
  (aksjonspunkter, avklarAktiviteter, values, initialValues) => {
    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) && (!values || !values[MANUELL_OVERSTYRING_FIELD])) {
      return false;
    }
    if (!!values[MANUELL_OVERSTYRING_FIELD] !== hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter)) {
      return true;
    }
    let harEndring = false;
    if (values && avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping) {
      harEndring = VurderAktiviteterPanel.hasValueChangedFromInitial(avklarAktiviteter.aktiviteterTomDatoMapping, values, initialValues);
    }
    if (values && !harEndring) {
      harEndring = initialValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] !== values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
    }
    return harEndring;
  },
);

const getHelpTextsAvklarAktiviteter = createSelector(
  [(ownProps) => ownProps.aksjonspunkter],
  (aksjonspunkter) => (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
    ? [<FormattedMessage key="VurderFaktaForBeregningen" id="BeregningInfoPanel.AksjonspunktHelpText.VurderAktiviteter" />]
    : []),
);

const skalViseSubmitKnappEllerBegrunnelse = (aksjonspunkter, erOverstyrt) => hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) || erOverstyrt;

const buildInitialValues = (aksjonspunkter, avklarAktiviteter, alleKodeverk) => {
  const harAvklarAksjonspunkt = hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter);
  const erOverstyrt = hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter);
  let initialValues = {};
  if (avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping) {
    initialValues = VurderAktiviteterPanel.buildInitialValues(avklarAktiviteter.aktiviteterTomDatoMapping,
      alleKodeverk, erOverstyrt, harAvklarAksjonspunkt);
  }
  const overstyrAksjonspunktMedBegrunnelse = findAksjonspunktMedBegrunnelse(aksjonspunkter, OVERSTYRING_AV_BEREGNINGSAKTIVITETER);
  const aksjonspunktMedBegrunnelse = findAksjonspunktMedBegrunnelse(aksjonspunkter, AVKLAR_AKTIVITETER);
  const begrunnelse = erOverstyrt ? overstyrAksjonspunktMedBegrunnelse : aksjonspunktMedBegrunnelse;
  return {
    [MANUELL_OVERSTYRING_FIELD]: erOverstyrt,
    aksjonspunkter,
    avklarAktiviteter,
    ...initialValues,
    ...FaktaBegrunnelseTextField.buildInitialValues(begrunnelse, BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME),
  };
};

const hasOpenAksjonspunkt = (kode, aksjonspunkter) => aksjonspunkter.some((ap) => ap.definisjon.kode === kode && isAksjonspunktOpen(ap.status.kode));

const hasOpenAvklarAksjonspunkter = (aksjonspunkter) => hasOpenAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
|| hasOpenAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter);


/**
 * AvklareAktiviteterPanel
 *
 * Container komponent.. Inneholder panel for å avklare om aktivitet fra opptjening skal tas med i beregning
 */

export class AvklareAktiviteterPanelImpl extends Component {
  constructor() {
    super();
    this.state = {
      submitEnabled: false,
    };
  }

  componentDidMount() {
    const { submitEnabled } = this.state;
    if (!submitEnabled) {
      this.setState({
        submitEnabled: true,
      });
    }
  }

  initializeAktiviteter() {
    const {
      reduxFormInitialize: formInitialize, behandlingFormPrefix,
      avklarAktiviteter, aksjonspunkter, alleKodeverk,
    } = this.props;
    formInitialize(`${behandlingFormPrefix}.${formNameAvklarAktiviteter}`, buildInitialValues(aksjonspunkter, avklarAktiviteter, alleKodeverk));
  }

  render() {
    const {
      props: {
        readOnly,
        isAksjonspunktClosed,
        submittable,
        hasBegrunnelse,
        helpText,
        harAndreAksjonspunkterIPanel,
        erOverstyrt,
        aksjonspunkter,
        kanOverstyre,
        erBgOverstyrt,
        alleKodeverk,
        behandlingId,
        behandlingVersjon,
        ...formProps
      },
      state: {
        submitEnabled,
      },
    } = this;

    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) && !kanOverstyre && !erOverstyrt) {
      return null;
    }
    const avklarAktiviteter = getAvklarAktiviteter(this.props);
    const skalViseSubmitknappInneforBorderBox = (harAndreAksjonspunkterIPanel || erOverstyrt || erBgOverstyrt) && !hasOpenAvklarAksjonspunkter(aksjonspunkter);
    return (
      <>
        <form onSubmit={formProps.handleSubmit}>
          {(kanOverstyre || erOverstyrt)
          && (
            <div className={styles.rightAligned}>
              <CheckboxField
                key="manuellOverstyring"
                name={MANUELL_OVERSTYRING_FIELD}
                label={{ id: 'AvklareAktiviteter.ManuellOverstyring' }}
                readOnly={hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter) || readOnly}
                onChange={() => this.initializeAktiviteter()}
              />
            </div>
          )}
          {(hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) || kanOverstyre || erOverstyrt)
      && (
        <div>
          {hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
          && <AksjonspunktHelpTextTemp isAksjonspunktOpen={!isAksjonspunktClosed}>{helpText}</AksjonspunktHelpTextTemp>}
          {erOverstyrt && (
          <Element>
            <FormattedMessage id="AvklareAktiviteter.OverstyrerAktivitetAdvarsel" />
          </Element>
          )}

          {formProps.error && (
            <>
              <VerticalSpacer sixteenPx />
              <AlertStripe type="feil">
                <FormattedMessage id={formProps.error} />
              </AlertStripe>
            </>
          )}

          <VerticalSpacer twentyPx />
          <BorderBox>
            {avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping
          && (
            <VurderAktiviteterPanel
              aktiviteterTomDatoMapping={avklarAktiviteter.aktiviteterTomDatoMapping}
              readOnly={readOnly}
              isAksjonspunktClosed={isAksjonspunktClosed}
              erOverstyrt={erOverstyrt}
              alleKodeverk={alleKodeverk}
              harAksjonspunkt={hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)}
            />
          )}
            <VerticalSpacer twentyPx />
            {skalViseSubmitKnappEllerBegrunnelse(aksjonspunkter, erOverstyrt) && (
              <>
                <FaktaBegrunnelseTextField
                  name={BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME}
                  isDirty={formProps.dirty}
                  isSubmittable={submittable}
                  isReadOnly={readOnly}
                  hasBegrunnelse={hasBegrunnelse}
                />
                {skalViseSubmitknappInneforBorderBox
              && (
              <FaktaSubmitButton
                buttonTextId={erOverstyrt ? 'AvklarAktivitetPanel.OverstyrText' : 'AvklarAktivitetPanel.ButtonText'}
                formName={formProps.form}
                isSubmittable={submittable && submitEnabled && !formProps.error}
                isReadOnly={readOnly}
                hasOpenAksjonspunkter={!isAksjonspunktClosed}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
              />
              )}
              </>
            )}
          </BorderBox>
            {!(skalViseSubmitknappInneforBorderBox) && skalViseSubmitKnappEllerBegrunnelse(aksjonspunkter, erOverstyrt)
              && (
                <>
                  <VerticalSpacer twentyPx />
                  <FaktaSubmitButton
                    buttonTextId={erOverstyrt ? 'AvklarAktivitetPanel.OverstyrText' : undefined}
                    formName={formProps.form}
                    isSubmittable={submittable && submitEnabled && !formProps.error}
                    isReadOnly={readOnly}
                    hasOpenAksjonspunkter={!isAksjonspunktClosed}
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                  />
                </>
              )}
        </div>
      )}
        </form>
        {harAndreAksjonspunkterIPanel
      && <VerticalSpacer twentyPx />}
      </>
    );
  }
}

AvklareAktiviteterPanelImpl.propTypes = {
  kanOverstyre: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  hasBegrunnelse: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  harAndreAksjonspunkterIPanel: PropTypes.bool.isRequired,
  helpText: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  erBgOverstyrt: PropTypes.bool.isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  erOverstyrt: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregningsgrunnlag: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningAksjonspunkterPropType).isRequired,
  ...formPropTypes,
};

const skalKunneLoseAksjonspunkt = (skalOverstyre, aksjonspunkter) => skalOverstyre || hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter);

const validate = (values) => {
  const { avklarAktiviteter } = values;
  if (avklarAktiviteter) {
    return VurderAktiviteterPanel.validate(values, avklarAktiviteter.aktiviteterTomDatoMapping);
  }
  return {};
};

export const transformValues = (values) => {
  const { aksjonspunkter, avklarAktiviteter } = values;
  const skalOverstyre = values[MANUELL_OVERSTYRING_FIELD];
  if (skalKunneLoseAksjonspunkt(skalOverstyre, aksjonspunkter)) {
    const vurderAktiviteterTransformed = VurderAktiviteterPanel.transformValues(values, avklarAktiviteter.aktiviteterTomDatoMapping);
    const beg = values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
    return [{
      kode: skalOverstyre ? OVERSTYRING_AV_BEREGNINGSAKTIVITETER : AVKLAR_AKTIVITETER,
      begrunnelse: beg === undefined ? null : beg,
      ...vurderAktiviteterTransformed,
    }];
  }
  return null;
};

export const buildInitialValuesAvklarAktiviteter = createSelector([(ownProps) => ownProps.aksjonspunkter, (ownProps) => getAvklarAktiviteter(ownProps),
  (ownProps) => ownProps.alleKodeverk], buildInitialValues);

const skalKunneOverstyre = (erOverstyrer, aksjonspunkter) => erOverstyrer && !hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter);

const getIsAksjonspunktClosed = createSelector([(ownProps) => ownProps.aksjonspunkter],
  (alleAp) => {
    const relevantOpenAps = alleAp.filter((ap) => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_AKTIVITETER
    || ap.definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER)
      .filter((ap) => isAksjonspunktOpen(ap.status.kode));
    return relevantOpenAps.length === 0;
  });

const mapStateToPropsFactory = (initialState, initialProps) => {
  const onSubmit = (vals) => initialProps.submitCallback(transformValues(vals));
  return (state, ownProps) => {
    const values = getFormValuesForAvklarAktiviteter(state, ownProps);
    const initialValues = buildInitialValuesAvklarAktiviteter(ownProps);
    return ({
      initialValues,
      values,
      onSubmit,
      validate,
      kanOverstyre: skalKunneOverstyre(ownProps.erOverstyrer, ownProps.aksjonspunkter),
      helpText: getHelpTextsAvklarAktiviteter(ownProps),
      behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
      isAksjonspunktClosed: getIsAksjonspunktClosed(ownProps),
      avklarAktiviteter: getAvklarAktiviteter(ownProps),
      hasBegrunnelse: initialValues && !!initialValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME],
      erOverstyrt: !!values && values[MANUELL_OVERSTYRING_FIELD],
      erBgOverstyrt: erOverstyringAvBeregningsgrunnlag(state, ownProps),
    });
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    reduxFormInitialize,
  }, dispatch),
});

export default connect(mapStateToPropsFactory, mapDispatchToProps)(behandlingForm({
  form: formNameAvklarAktiviteter,
})(AvklareAktiviteterPanelImpl));
