import React from 'react';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form';
import {
  AksjonspunktHelpTextTemp, ArrowBox, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { behandlingForm, behandlingFormValueSelector, SettBehandlingPaVentModal } from '@fpsak-frontend/fp-felles';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import {
  hasValidText, ISO_DATE_FORMAT, minLength, required, getLanguageCodeFromSprakkode,
} from '@fpsak-frontend/utils';
import FodselSammenligningIndex from '@fpsak-frontend/prosess-fakta-fodsel-sammenligning';

import revurderingFamilieHendelsePropType from '../propTypes/revurderingFamilieHendelsePropType';
import revurderingSoknadPropType from '../propTypes/revurderingSoknadPropType';

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
      const data = {
        mottaker: '',
        dokumentMal: 'REVURD',
        fritekst: fritekst || ' ',
      };
      previewCallback(data);
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
    if (validForm) {
      if (sendVarsel) {
        this.setState({ showSettPaVentModal: true });
      } else {
        handleSubmit();
      }
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
      avklartBarn,
      behandlingTypeKode,
      soknad,
      termindato,
      soknadOriginalBehandling,
      familiehendelseOriginalBehandling,
      vedtaksDatoSomSvangerskapsuke,
      ...formProps
    } = this.props;
    const { showSettPaVentModal } = this.state;

    const venteArsakHasChanged = hasValueChanged(originalVentearsak, ventearsak);
    const fristHasChanged = hasValueChanged(originalFrist, frist);

    return (
      <form>
        <Undertittel>{intl.formatMessage({ id: 'VarselOmRevurderingForm.VarselOmRevurdering' })}</Undertittel>
        <VerticalSpacer eightPx />
        {(!readOnly && isAksjonspunktOpen(aksjonspunktStatus))
            && (
            <div>
              <AksjonspunktHelpTextTemp isAksjonspunktOpen>
                {[<FormattedMessage key="1" id="VarselOmRevurderingForm.VarselOmRevurderingVurder" />]}
              </AksjonspunktHelpTextTemp>
              <VerticalSpacer twentyPx />
              { erAutomatiskRevurdering
              && (
              <div>
                <FodselSammenligningIndex
                  behandlingsTypeKode={behandlingTypeKode}
                  avklartBarn={avklartBarn}
                  termindato={termindato}
                  vedtaksDatoSomSvangerskapsuke={vedtaksDatoSomSvangerskapsuke}
                  soknad={soknad}
                  soknadOriginalBehandling={soknadOriginalBehandling}
                  familiehendelseOriginalBehandling={familiehendelseOriginalBehandling}
                />
                <VerticalSpacer sixteenPx />
              </div>
              )}
              <RadioGroupField name="sendVarsel" validate={[required]}>
                <RadioOption label={{ id: 'VarselOmRevurderingForm.SendVarsel' }} value />
                <RadioOption label={{ id: 'VarselOmRevurderingForm.IkkeSendVarsel' }} value={false} />
              </RadioGroupField>
              {sendVarsel
              && (
              <ArrowBox>
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
                  <FormattedMessage id="VarselOmRevurderingForm.Preview" />
                </a>
              </ArrowBox>
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
            )}
        {(readOnly || !isAksjonspunktOpen(aksjonspunktStatus))
            && (
            <div>
              <Undertekst>{intl.formatMessage({ id: 'VarselOmRevurderingForm.Begrunnelse' })}</Undertekst>
              <Normaltekst>{begrunnelse}</Normaltekst>
            </div>
            )}
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
    );
  }
}

VarselOmRevurderingFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
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
  avklartBarn: PropTypes.arrayOf(PropTypes.shape()),
  behandlingTypeKode: PropTypes.string.isRequired,
  soknad: revurderingSoknadPropType.isRequired,
  termindato: PropTypes.string,
  soknadOriginalBehandling: revurderingSoknadPropType.isRequired,
  familiehendelseOriginalBehandling: revurderingFamilieHendelsePropType.isRequired,
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
  avklartBarn: undefined,
  termindato: undefined,
};

export const buildInitialValues = createSelector([(state, ownProps) => ownProps.aksjonspunkter], (aksjonspunkter) => ({
  kode: aksjonspunkter[0].definisjon.kode,
  frist: moment().add(28, 'days').format(ISO_DATE_FORMAT),
  ventearsak: null,
}));

const formName = 'VarselOmRevurderingForm';

const nullSafe = (value) => (value || {});

const mapStateToPropsFactory = (initialState, ownProps) => {
  const {
    behandlingId, behandlingVersjon, behandlingType, behandlingArsaker, aksjonspunkter, submitCallback, sprakkode, ventearsak, frist, familiehendelse,
  } = ownProps;
  const onSubmit = (values) => submitCallback([values]);
  const erAutomatiskRevurdering = behandlingArsaker.reduce((result, current) => (result || current.erAutomatiskRevurdering), false);
  const aksjonspunkt = aksjonspunkter[0];
  const ventearsaker = ownProps.alleKodeverk[kodeverkTyper.VENT_AARSAK];
  const languageCode = getLanguageCodeFromSprakkode(sprakkode);

  return (state) => ({
    initialValues: buildInitialValues(state, ownProps),
    aksjonspunktStatus: aksjonspunkt.status.kode,
    aksjonspunktKode: aksjonspunkt.definisjon.kode,
    begrunnelse: aksjonspunkt.begrunnelse,
    ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'sendVarsel', 'fritekst', 'frist', 'ventearsak'),
    avklartBarn: nullSafe(familiehendelse.register).avklartBarn,
    termindato: nullSafe(familiehendelse.gjeldende).termindato,
    vedtaksDatoSomSvangerskapsuke: nullSafe(familiehendelse.gjeldende).vedtaksDatoSomSvangerskapsuke,
    originalVentearsak: ventearsak,
    originalFrist: frist,
    behandlingTypeKode: behandlingType.kode,
    languageCode,
    ventearsaker,
    erAutomatiskRevurdering,
    onSubmit,
  });
};

const VarselOmRevurderingForm = connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: true,
})(VarselOmRevurderingFormImpl)));

export default VarselOmRevurderingForm;
