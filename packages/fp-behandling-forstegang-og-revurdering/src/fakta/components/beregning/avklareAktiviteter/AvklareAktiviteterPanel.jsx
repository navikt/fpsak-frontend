import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { initialize as reduxFormInitialize, formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { Element } from 'nav-frontend-typografi';
import { VerticalSpacer, BorderBox, AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { CheckboxField } from '@fpsak-frontend/form';
import { getRettigheter } from 'navAnsatt/duck';
import { getBehandlingFormPrefix, behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { getSelectedBehandlingId, getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import {
  getBehandlingVersjon,

  getAksjonspunkter,
  getAvklarAktiviteter,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';


import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';


import { getFormValuesForAvklarAktiviteter, getFormInitialValuesForAvklarAktiviteter, formNameAvklarAktiviteter } from '../BeregningFormUtils';
import { erOverstyringAvBeregningsgrunnlag } from '../fellesFaktaForATFLogSN/BgFordelingUtils';

import VurderAktiviteterPanel from './VurderAktiviteterPanel';
import styles from './avklareAktiviteterPanel.less';


const {
  AVKLAR_AKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
} = aksjonspunktCodes;

export const BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME = 'begrunnelseAvklareAktiviteter';

export const MANUELL_OVERSTYRING_FIELD = 'manuellOverstyringBeregningAktiviteter';

const findAksjonspunktMedBegrunnelse = (aksjonspunkter, kode) => aksjonspunkter
  .filter(ap => ap.definisjon.kode === kode && ap.begrunnelse !== null)[0];


export const erAvklartAktivitetEndret = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter, getFormValuesForAvklarAktiviteter, getFormInitialValuesForAvklarAktiviteter],
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

export const getHelpTextsAvklarAktiviteter = createSelector(
  [getAksjonspunkter],
  aksjonspunkter => (hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
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
      getKodeverknavnFn(alleKodeverk, kodeverkTyper), erOverstyrt, harAvklarAksjonspunkt);
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

const hasOpenAksjonspunkt = (kode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === kode && isAksjonspunktOpen(ap.status.kode));

const hasOpenAvklarAksjonspunkter = aksjonspunkter => hasOpenAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
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
        avklarAktiviteter,
        isAksjonspunktClosed,
        submittable,
        hasBegrunnelse,
        helpText,
        harAndreAksjonspunkterIPanel,
        erOverstyrt,
        aksjonspunkter,
        kanOverstyre,
        erBgOverstyrt,
        ...formProps
      },
      state: {
        submitEnabled,
      },
    } = this;

    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) && !kanOverstyre && !erOverstyrt) {
      return null;
    }

    const skalViseSubmitknappInneforBorderBox = (harAndreAksjonspunkterIPanel || erOverstyrt || erBgOverstyrt) && !hasOpenAvklarAksjonspunkter(aksjonspunkter);

    return (
      <React.Fragment>
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
)
        }
          {(hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) || kanOverstyre || erOverstyrt)
      && (
        <div>
          {hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)
          && <AksjonspunktHelpText isAksjonspunktOpen={!isAksjonspunktClosed}>{helpText}</AksjonspunktHelpText>}
          {erOverstyrt && (
          <Element>
            <FormattedMessage id="AvklareAktiviteter.OverstyrerAktivitetAdvarsel" />
          </Element>
          )}

          <VerticalSpacer twentyPx />
          <BorderBox>
            {avklarAktiviteter.aktiviteterTomDatoMapping
          && (
            <VurderAktiviteterPanel
              aktiviteterTomDatoMapping={avklarAktiviteter.aktiviteterTomDatoMapping}
              readOnly={readOnly}
              isAksjonspunktClosed={isAksjonspunktClosed}
              erOverstyrt={erOverstyrt}
              harAksjonspunkt={hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)}
            />
            )
          }
            <VerticalSpacer twentyPx />
            {skalViseSubmitKnappEllerBegrunnelse(aksjonspunkter, erOverstyrt) && (
            <React.Fragment>
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
                isSubmittable={submittable && submitEnabled}
                isReadOnly={readOnly}
                hasOpenAksjonspunkter={!isAksjonspunktClosed}
              />
            )
          }
            </React.Fragment>
          )}
          </BorderBox>
            {!(skalViseSubmitknappInneforBorderBox) && skalViseSubmitKnappEllerBegrunnelse(aksjonspunkter, erOverstyrt)
              && (
              <React.Fragment>
                <VerticalSpacer twentyPx />
                <FaktaSubmitButton
                  buttonTextId={erOverstyrt ? 'AvklarAktivitetPanel.OverstyrText' : undefined}
                  formName={formProps.form}
                  isSubmittable={submittable && submitEnabled}
                  isReadOnly={readOnly}
                  hasOpenAksjonspunkter={!isAksjonspunktClosed}
                />
              </React.Fragment>
            )
          }
        </div>
      )
        }
        </form>
        {harAndreAksjonspunkterIPanel
      && <VerticalSpacer twentyPx />
    }
      </React.Fragment>
);
  }
}

AvklareAktiviteterPanelImpl.propTypes = {
  kanOverstyre: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  avklarAktiviteter: PropTypes.shape().isRequired,
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
  ...formPropTypes,
};

const skalKunneLoseAksjonspunkt = (skalOverstyre, aksjonspunkter) => skalOverstyre || hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter);

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


export const buildInitialValuesAvklarAktiviteter = createSelector([getAksjonspunkter, getAvklarAktiviteter, getAlleKodeverk], buildInitialValues);

const skalKunneOverstyre = (rettigheter, aksjonspunkter) => rettigheter.kanOverstyreAccess.isEnabled && !hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter);

const getSkalKunneOverstyre = createSelector([getRettigheter, getAksjonspunkter], skalKunneOverstyre);

const getIsAksjonspunktClosed = createSelector([getAksjonspunkter],
(alleAp) => {
  const relevantOpenAps = alleAp.filter(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_AKTIVITETER
    || ap.definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER)
    .filter(ap => isAksjonspunktOpen(ap.status.kode));
  return relevantOpenAps.length === 0;
});

const mapStateToPropsFactory = (initialState, initialProps) => {
  const onSubmit = vals => initialProps.submitCallback(transformValues(vals));
  const alleKodeverk = getAlleKodeverk(initialState);
  return (state) => {
    const values = getFormValuesForAvklarAktiviteter(state);
    const initialValues = buildInitialValuesAvklarAktiviteter(state);
    return ({
      initialValues,
      values,
      onSubmit,
      alleKodeverk,
      aksjonspunkter: getAksjonspunkter(state),
      kanOverstyre: getSkalKunneOverstyre(state),
      helpText: getHelpTextsAvklarAktiviteter(state),
      behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
      isAksjonspunktClosed: getIsAksjonspunktClosed(state),
      avklarAktiviteter: getAvklarAktiviteter(state),
      hasBegrunnelse: initialValues && !!initialValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME],
      erOverstyrt: !!values && values[MANUELL_OVERSTYRING_FIELD],
      erBgOverstyrt: erOverstyringAvBeregningsgrunnlag(state),
  });
};
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormInitialize,
  }, dispatch),
});

export default connect(mapStateToPropsFactory, mapDispatchToProps)(behandlingForm({
  form: formNameAvklarAktiviteter,
})(AvklareAktiviteterPanelImpl));
