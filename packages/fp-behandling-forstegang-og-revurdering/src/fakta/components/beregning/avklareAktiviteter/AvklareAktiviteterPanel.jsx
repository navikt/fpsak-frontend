import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { Element } from 'nav-frontend-typografi';
import { VerticalSpacer, BorderBox, AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import { FaktaBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { CheckboxField } from '@fpsak-frontend/form';
import { getRettigheter } from 'navAnsatt/duck';

import { behandlingForm } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import FaktaSubmitButton from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaSubmitButton';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import {
  getAksjonspunkter,
  getAvklarAktiviteter,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { getFormValuesForAvklarAktiviteter, getFormInitialValuesForAvklarAktiviteter, formNameAvklarAktiviteter } from '../BeregningFormUtils';

import VurderAktiviteterPanel from './VurderAktiviteterPanel';
import styles from './avklareAktiviteterPanel.less';


const {
  AVKLAR_AKTIVITETER,
  OVERSTYRING_AV_BEREGNINGSAKTIVITETER,
} = aksjonspunktCodes;

export const BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME = 'begrunnelseAvklareAktiviteter';

export const MANUELL_OVERSTYRING_FIELD = 'manuellOverstyringBeregningAktiviteter';

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);

const findAksjonspunktMedBegrunnelse = (aksjonspunkter, kode) => aksjonspunkter
  .filter(ap => ap.definisjon.kode === kode && ap.begrunnelse !== null)[0];


export const erAvklartAktivitetEndret = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter, getFormValuesForAvklarAktiviteter, getFormInitialValuesForAvklarAktiviteter],
  (aksjonspunkter, avklarAktiviteter, values, initialValues) => {
    if (!hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) && (!values || !values[MANUELL_OVERSTYRING_FIELD])) {
      return false;
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
        ...formProps
      },
      state: {
        submitEnabled,
      },
    } = this;
    return (
      <React.Fragment>
        <form onSubmit={formProps.handleSubmit}>
          {kanOverstyre
          && (
            <div className={styles.rightAligned}>
              <CheckboxField
                key="manuellOverstyring"
                name={MANUELL_OVERSTYRING_FIELD}
                label={{ id: 'AvklareAktiviteter.ManuellOverstyring' }}
                readOnly={hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter) || readOnly}
              />
            </div>
)
        }
          {(hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter) || erOverstyrt)
      && (
        <div>
          {!erOverstyrt && <AksjonspunktHelpText isAksjonspunktOpen={!isAksjonspunktClosed}>{helpText}</AksjonspunktHelpText>}
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
            />
            )
          }
            <VerticalSpacer twentyPx />
            <FaktaBegrunnelseTextField
              name={BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME}
              isDirty={formProps.dirty}
              isSubmittable={submittable}
              isReadOnly={readOnly}
              hasBegrunnelse={hasBegrunnelse}
            />
            {harAndreAksjonspunkterIPanel
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
          </BorderBox>
            {!harAndreAksjonspunkterIPanel
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
  ...formPropTypes,
};

export const transformValuesAvklarAktiviteter = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter],
  (aksjonspunkter, avklarAktiviteter) => (values) => {
    const skalOverstyre = values[MANUELL_OVERSTYRING_FIELD];
    if (skalOverstyre || hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter)) {
      if (avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping) {
        const vurderAktiviteterTransformed = VurderAktiviteterPanel.transformValues(values, avklarAktiviteter.aktiviteterTomDatoMapping);
        const beg = values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
        return [{
          kode: skalOverstyre ? OVERSTYRING_AV_BEREGNINGSAKTIVITETER : AVKLAR_AKTIVITETER,
          begrunnelse: beg === undefined ? null : beg,
          ...vurderAktiviteterTransformed,
        }];
      }
    }
    return null;
  },
);

export const buildInitialValuesAvklarAktiviteter = createSelector(
  [getAksjonspunkter, getAvklarAktiviteter, getAlleKodeverk],
  (aksjonspunkter, avklarAktiviteter, alleKodeverk) => {
    const harAvklarAksjonspunkt = hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter);
    let initialValues = {};
    if (avklarAktiviteter && avklarAktiviteter.aktiviteterTomDatoMapping) {
      initialValues = VurderAktiviteterPanel.buildInitialValues(avklarAktiviteter.aktiviteterTomDatoMapping,
        getKodeverknavnFn(alleKodeverk, kodeverkTyper), !harAvklarAksjonspunkt);
    }
    const overstyrBegrunnelse = findAksjonspunktMedBegrunnelse(aksjonspunkter, OVERSTYRING_AV_BEREGNINGSAKTIVITETER);
    const aksjonspunktBegrunnelse = findAksjonspunktMedBegrunnelse(aksjonspunkter, AVKLAR_AKTIVITETER);
    const begrunnelse = hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter) ? overstyrBegrunnelse : aksjonspunktBegrunnelse;
    return {
      [MANUELL_OVERSTYRING_FIELD]: hasAksjonspunkt(OVERSTYRING_AV_BEREGNINGSAKTIVITETER, aksjonspunkter),
      ...initialValues,
      ...FaktaBegrunnelseTextField.buildInitialValues(begrunnelse, BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME),
    };
  },
);

const getSkalKunneOverstyre = createSelector([getRettigheter, getAksjonspunkter],
  (rettigheter, aksjonspunkter) => rettigheter.kanOverstyreAccess.isEnabled && !hasAksjonspunkt(AVKLAR_AKTIVITETER, aksjonspunkter));

const mapStateToProps = (state, initialProps) => {
  const avklarAktiviteter = getAvklarAktiviteter(state);
  const alleAp = getAksjonspunkter(state);
  const relevantOpenAps = alleAp.filter(ap => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_AKTIVITETER
    || ap.definisjon.kode === aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER)
    .filter(ap => isAksjonspunktOpen(ap.status.kode));
  const isAksjonspunktClosed = relevantOpenAps.length === 0;
  const initialValues = buildInitialValuesAvklarAktiviteter(state);
  const values = getFormValuesForAvklarAktiviteter(state);
  const hasBegrunnelse = initialValues
  && !!initialValues[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME];
  return {
    values,
    isAksjonspunktClosed,
    avklarAktiviteter,
    hasBegrunnelse,
    initialValues,
    kanOverstyre: getSkalKunneOverstyre(state),
    erOverstyrt: values && values[MANUELL_OVERSTYRING_FIELD],
    aksjonspunkter: alleAp,
    helpText: getHelpTextsAvklarAktiviteter(state),
    onSubmit: vals => initialProps.submitCallback(transformValuesAvklarAktiviteter(state)(vals)),
  };
};

export default connect(mapStateToProps)(behandlingForm({
  form: formNameAvklarAktiviteter,
})(AvklareAktiviteterPanelImpl));
