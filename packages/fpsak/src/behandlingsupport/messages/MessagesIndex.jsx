import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { reset as resetReduxForm } from 'redux-form';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import venteArsakType from '@fpsak-frontend/kodeverk/src/venteArsakType';
import { LoadingPanel } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import { getKodeverk } from 'kodeverk/duck';
import { getBehandlingSprak, getBehandlingVersjon, getBehandlingIdentifier } from 'behandling/duck';
import fpsakApi from 'data/fpsakApi';
import { setBehandlingOnHold } from 'behandlingmenu/duck';
import { BehandlingIdentifier, SettBehandlingPaVentForm } from '@fpsak-frontend/fp-felles';
import {
  resetSubmitMessageActionCreator, previewMessageActionCreator, submitMessageActionCreator,
} from './duck';
import Messages from './components/Messages';
import MessagesModal from './components/MessagesModal';

/**
 * MessagesIndex
 *
 * Container komponent. Har ansvar for å hente mottakere og brevmaler fra serveren.
 */
export class MessagesIndex extends Component {
  constructor() {
    super();
    this.submitCallback = this.submitCallback.bind(this);
    this.previewCallback = this.previewCallback.bind(this);
    this.afterSubmit = this.afterSubmit.bind(this);
    this.hideSettPaVentModal = this.hideSettPaVentModal.bind(this);
    this.handleSubmitFromModal = this.handleSubmitFromModal.bind(this);
    this.state = { showSettPaVentModal: false, showMessagesModal: false };
  }

  componentDidMount = () => {
    const { fetchBrevmaler } = this.props;
    fetchBrevmaler();
  }

  componentDidUpdate = (prevProps) => {
    const { fetchBrevmaler, behandlingIdentifier, selectedBehandlingVersjon } = this.props;

    if (behandlingIdentifier.behandlingId !== prevProps.behandlingIdentifier.behandlingId
        || selectedBehandlingVersjon !== prevProps.selectedBehandlingVersjon) {
      fetchBrevmaler();
    }
  }

  submitCallback(values) {
    const {
      behandlingIdentifier, submitMessage, resetReduxForm: resetForm, fetchBrevmaler,
    } = this.props;
    const isInnhentEllerForlenget = values.brevmalkode === dokumentMalType.INNHENT_DOK
      || values.brevmalkode === dokumentMalType.FORLENGET_DOK
      || values.brevmalkode === dokumentMalType.FORLENGET_MEDL_DOK;
    this.setState({ showMessagesModal: !isInnhentEllerForlenget });
    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      mottaker: values.mottaker,
      brevmalkode: values.brevmalkode,
      fritekst: values.fritekst,
      arsakskode: values.arsakskode,
    };
    return submitMessage(data)
      .then(() => this.resetMessage())
      .then(() => fetchBrevmaler())
      .then(() => this.setState({ showSettPaVentModal: isInnhentEllerForlenget }))
      .then(() => resetForm(Messages.formName));
  }

  handleSubmitFromModal(formValues) {
    const { behandlingIdentifier, selectedBehandlingVersjon, setBehandlingOnHold: setOnHold } = this.props;
    const values = {
      behandlingId: behandlingIdentifier.behandlingId,
      behandlingVersjon: selectedBehandlingVersjon,
      frist: formValues.frist,
      ventearsak: formValues.ventearsak,
    };
    setOnHold(values, behandlingIdentifier);
    this.hideSettPaVentModal();
    this.goToSearchPage();
  }

  hideSettPaVentModal() {
    this.setState({ showSettPaVentModal: false });
  }

  goToSearchPage() {
    const { push: pushLocation } = this.props;
    pushLocation('/');
  }

  previewCallback(mottaker, brevmalkode, fritekst, aarsakskode) {
    const { behandlingIdentifier, fetchPreview } = this.props;
    const data = {
      behandlingId: behandlingIdentifier.behandlingId,
      fritekst: fritekst || ' ',
      årsakskode: aarsakskode || null,
      mottaker,
      brevmalkode,
    };
    fetchPreview(data);
  }

  afterSubmit() {
    this.setState({
      showMessagesModal: false,
    });
    return this.resetMessage();
  }

  resetMessage() {
    const { behandlingIdentifier, resetSubmitMessage: resetMessage } = this.props;
    return resetMessage(behandlingIdentifier);
  }

  render() {
    const {
      recipients,
      templates,
      submitFinished,
      selectedBehandlingSprak,
      ventearsaker,
      loadingBrevmaler,
    } = this.props;

    if (loadingBrevmaler) {
      return <LoadingPanel />;
    }

    const { showMessagesModal, showSettPaVentModal } = this.state;
    const model = {
      mottaker: recipients[0] ? recipients[0] : null,
      brevmalkode: templates[0] ? templates[0].kode : null,
      fritekst: '',
      aarsakskode: null,
    };

    return (
      <div>
        {showMessagesModal && <MessagesModal showModal={submitFinished && showMessagesModal} closeEvent={this.afterSubmit} />}
        <Messages
          submitCallback={this.submitCallback}
          initialValues={model}
          recipients={recipients}
          templates={templates}
          sprakKode={selectedBehandlingSprak}
          previewCallback={this.previewCallback}
        />
        {submitFinished && showSettPaVentModal
        && (
          <SettBehandlingPaVentForm
            showModal={submitFinished && showSettPaVentModal}
            cancelEvent={this.hideSettPaVentModal}
            comment={<Normaltekst><FormattedMessage id="Messages.BrevErBestilt" /></Normaltekst>}
            onSubmit={this.handleSubmitFromModal}
            ventearsak={venteArsakType.AVV_DOK}
            hasManualPaVent
            ventearsaker={ventearsaker}
          />
        )}
      </div>
    );
  }
}

MessagesIndex.propTypes = {
  submitFinished: PropTypes.bool.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  selectedBehandlingVersjon: PropTypes.number,
  selectedBehandlingSprak: PropTypes.shape(),
  recipients: PropTypes.arrayOf(PropTypes.string),
  templates: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
    tilgjengelig: PropTypes.bool.isRequired,
  })),
  fetchPreview: PropTypes.func.isRequired,
  submitMessage: PropTypes.func.isRequired,
  setBehandlingOnHold: PropTypes.func.isRequired,
  resetReduxForm: PropTypes.func.isRequired,
  resetSubmitMessage: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  ventearsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
  fetchBrevmaler: PropTypes.func.isRequired,
  loadingBrevmaler: PropTypes.bool.isRequired,
};

MessagesIndex.defaultProps = {
  behandlingIdentifier: undefined,
  selectedBehandlingVersjon: undefined,
  selectedBehandlingSprak: undefined,
  ventearsaker: [],
  recipients: ['Søker'],
  templates: [],
};

const mapStateToProps = (state) => ({
  templates: fpsakApi.BREVMALER.getRestApiData()(state),
  loadingBrevmaler: fpsakApi.BREVMALER.getRestApiStarted()(state),
  submitFinished: fpsakApi.SUBMIT_MESSAGE.getRestApiFinished()(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  selectedBehandlingVersjon: getBehandlingVersjon(state),
  selectedBehandlingSprak: getBehandlingSprak(state),
  ventearsaker: getKodeverk(kodeverkTyper.VENTEARSAK)(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    push,
    resetReduxForm,
    setBehandlingOnHold,
    fetchPreview: previewMessageActionCreator,
    submitMessage: submitMessageActionCreator,
    resetSubmitMessage: resetSubmitMessageActionCreator,
    fetchBrevmaler: fpsakApi.BREVMALER.makeRestApiRequest(),
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessagesIndex);
