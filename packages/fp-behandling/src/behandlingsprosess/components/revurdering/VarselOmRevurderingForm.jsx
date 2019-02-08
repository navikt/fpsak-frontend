import React from 'react';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { FormattedMessage, intlShape, injectIntl } from 'react-intl';
import classNames from 'classnames';
import moment from 'moment';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import {
  FadingPanel, VerticalSpacer, AksjonspunktHelpText,
} from '@fpsak-frontend/shared-components';
import PropTypes from 'prop-types';
import { getBehandlingLanguageCode, getBehandlingArsaker } from 'behandlingFpsak/src/behandlingSelectors';
import { getKodeverk } from 'behandlingFpsak/src/duck';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingFpsak/src/behandlingsprosess/behandlingsprosessSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingFpsak/src/behandlingForm';
import FodselSammenligningPanel from 'behandlingFpsak/src/components/fodselSammenligning/FodselSammenligningPanel';
import { SettBehandlingPaVentModal } from '@fpsak-frontend/fp-felles';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  ISO_DATE_FORMAT, required, minLength, hasValidText,
} from '@fpsak-frontend/utils';

import styles from './varselOmRevurderingForm.less';

const minLength3 = minLength(3);

const hasValueChanged = (originalValue, newValue) => !(originalValue === newValue || (!newValue && !originalValue));
/**
 * VarselOmRevurderingForm
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for avklaring av varsel om revurdering i søknad.
 */
export class VarselOmRevurderingFormImpl extends React.Component {
  constructor(props) {
    super(props);
    this.previewMessage = this.previewMessage.bind(this);
    this.bekreftOgFortsettClicked = this.bekreftOgFortsettClicked.bind(this);
    this.hideSettPaVentModal = this.hideSettPaVentModal.bind(this);
    this.handleSubmitFromModal = this.handleSubmitFromModal.bind(this);
    this.state = { showSettPaVentModal: false };
  }

  previewMessage(e, previewCallback) {
    const {
      valid, pristine, fritekst, submit,
    } = this.props;
    if (valid || pristine) {
      previewCallback('', 'REVURD', fritekst || ' ');
    } else {
      submit();
    }
    e.preventDefault();
  }

  bekreftOgFortsettClicked() {
    const {
      valid: validForm, touch, dispatchSubmitFailed, sendVarsel, handleSubmit,
    } = this.props;
    touch('begrunnelse', 'sendVarsel', 'fritekst');
    if (!validForm) {
      dispatchSubmitFailed('VarselOmRevurderingForm');
    }
    if (validForm && sendVarsel) {
      this.setState({ showSettPaVentModal: true });
    } else if (validForm && !sendVarsel) {
      handleSubmit();
    }
  }

  handleSubmitFromModal() {
    const { valid, handleSubmit } = this.props;
    handleSubmit();
    if (valid) {
      this.hideSettPaVentModal();
    }
  }

  hideSettPaVentModal() {
    this.setState({ showSettPaVentModal: false });
  }

  render() {
    const {
      intl,
      previewCallback,
      erAutomatiskRevurdering,
      languageCode,
      readOnly,
      sendVarsel,
      frist,
      aksjonspunktStatus,
      aksjonspunktKode,
      begrunnelse,
      ventearsak,
      originalVentearsak,
      originalFrist,
      ventearsaker,
      ...formProps
    } = this.props;
    const { showSettPaVentModal } = this.state;

    const venteArsakHasChanged = hasValueChanged(originalVentearsak, ventearsak);
    const fristHasChanged = hasValueChanged(originalFrist, frist);

    return (
      <FadingPanel>
        <form>
          <Undertittel>{intl.formatMessage({ id: 'VarselOmRevurderingForm.VarselOmRevurdering' })}</Undertittel>
          <VerticalSpacer eightPx />
          {(!readOnly && isAksjonspunktOpen(aksjonspunktStatus))
            && (
            <div>
              <AksjonspunktHelpText isAksjonspunktOpen>
                {[<FormattedMessage key="1" id="VarselOmRevurderingForm.VarselOmRevurderingVurder" />]}
              </AksjonspunktHelpText>
              <VerticalSpacer twentyPx />
              { erAutomatiskRevurdering
              && (
              <div>
                <FodselSammenligningPanel />
                <VerticalSpacer sixteenPx />
              </div>
              )
            }
              <RadioGroupField name="sendVarsel" validate={[required]}>
                <RadioOption label={{ id: 'VarselOmRevurderingForm.SendVarsel' }} value />
                <RadioOption label={{ id: 'VarselOmRevurderingForm.IkkeSendVarsel' }} value={false} />
              </RadioGroupField>
              {sendVarsel
              && (
              <div className={styles.arrowLine}>
                <TextAreaField
                  badges={[{ textId: languageCode, type: 'fokus', title: 'Malform.Beskrivelse' }]}
                  name="fritekst"
                  label={intl.formatMessage({ id: 'VarselOmRevurderingForm.FritekstIBrev' })}
                  validate={[required, minLength3, hasValidText]}
                />
                <a
                  href=""
                  onClick={(e) => {
                    this.previewMessage(e, previewCallback);
                  }}
                  className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
                >
                  <FormattedMessage id="Messages.Preview" />
                </a>
              </div>
              )}
              <div className={styles.flexContainer}>
                <TextAreaField
                  name="begrunnelse"
                  label={intl.formatMessage({ id: 'VarselOmRevurderingForm.BegrunnelseForSvar' })}
                  validate={[required, minLength3, hasValidText]}
                />
                <Hovedknapp
                  mini
                  htmlType="button"
                  onClick={this.bekreftOgFortsettClicked}
                  spinner={formProps.submitting}
                  disabled={formProps.submitting}
                >
                  <FormattedMessage id="VarselOmRevurderingForm.Bekreft" />
                </Hovedknapp>
              </div>
            </div>
            )
          }
          {(readOnly || !isAksjonspunktOpen(aksjonspunktStatus))
            && (
            <div>
              <Undertekst>{intl.formatMessage({ id: 'VarselOmRevurderingForm.Begrunnelse' })}</Undertekst>
              <Normaltekst>{begrunnelse}</Normaltekst>
            </div>
            )
          }
          <SettBehandlingPaVentModal
            showModal={showSettPaVentModal}
            aksjonspunktKode={aksjonspunktKode}
            frist={frist}
            cancelEvent={this.hideSettPaVentModal}
            comment={<Normaltekst><FormattedMessage id="VarselOmRevurderingForm.BrevBlirBestilt" /></Normaltekst>}
            venteArsakHasChanged={venteArsakHasChanged}
            fristHasChanged={fristHasChanged}
            showAvbryt
            handleSubmit={this.handleSubmitFromModal}
            hasManualPaVent
            ventearsaker={ventearsaker}
          />
        </form>
      </FadingPanel>
    );
  }
}

VarselOmRevurderingFormImpl.propTypes = {
  intl: intlShape.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  aksjonspunktStatus: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  dispatchSubmitFailed: PropTypes.func.isRequired,
  languageCode: PropTypes.string,
  erAutomatiskRevurdering: PropTypes.bool,
  sendVarsel: PropTypes.bool,
  fritekst: PropTypes.string,
  begrunnelse: PropTypes.string,
  frist: PropTypes.string,
  originalVentearsak: PropTypes.string,
  ventearsak: PropTypes.string,
  ventearsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
  ...formPropTypes,
};

VarselOmRevurderingFormImpl.defaultProps = {
  sendVarsel: false,
  fritekst: null,
  frist: moment().add(28, 'days').format(ISO_DATE_FORMAT),
  begrunnelse: null,
  languageCode: null,
  erAutomatiskRevurdering: false,
  originalVentearsak: null,
  ventearsak: null,
  ventearsaker: [],
};

export const buildInitialValues = createSelector([getSelectedBehandlingspunktAksjonspunkter], aksjonspunkter => ({
  kode: aksjonspunkter[0].definisjon.kode,
  frist: moment().add(28, 'days').format(ISO_DATE_FORMAT),
  ventearsak: null,
}));

const formName = 'VarselOmRevurderingForm';

const mapStateToProps = (state, ownProps) => {
  const aksjonspunkt = getSelectedBehandlingspunktAksjonspunkter(state)[0];
  const erAutomatiskRevurdering = getBehandlingArsaker(state).reduce((result, current) => (result || current.erAutomatiskRevurdering), false);
  return {
    erAutomatiskRevurdering,
    initialValues: buildInitialValues(state),
    aksjonspunktStatus: aksjonspunkt.status.kode,
    aksjonspunktKode: aksjonspunkt.definisjon.kode,
    begrunnelse: aksjonspunkt.begrunnelse,
    languageCode: getBehandlingLanguageCode(state),
    ...behandlingFormValueSelector(formName)(state, 'sendVarsel', 'fritekst', 'frist', 'ventearsak'),
    onSubmit: values => ownProps.submitCallback([values]),
    originalVentearsak: ownProps.ventearsak,
    originalFrist: ownProps.frist,
    ventearsaker: getKodeverk(kodeverkTyper.VENTEARSAK)(state),
  };
};

const VarselOmRevurderingForm = connect(mapStateToProps)(injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: true,
})(VarselOmRevurderingFormImpl)));

VarselOmRevurderingForm.supports = apCodes => apCodes.includes(aksjonspunktCodes.VARSEL_REVURDERING_MANUELL)
  || apCodes.includes(aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL);

export default VarselOmRevurderingForm;
