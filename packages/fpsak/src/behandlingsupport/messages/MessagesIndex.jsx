import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { reset as resetReduxForm } from 'redux-form';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import dokumentMalType from 'kodeverk/dokumentMalType';
import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import SettBehandlingPaVentForm from 'behandling/components/SettBehandlingPaVentForm';
import {
  getBehandlingSprak,
  getBehandlingVersjon,
  getBrevMaler,
  getBrevMottakere,
  getSelectedBehandlingIdentifier,
} from 'behandling/behandlingSelectors';
import { setBehandlingOnHold } from 'behandlingmenu/duck';
import venteArsakType from 'kodeverk/venteArsakType';
import LoadingPanel from 'sharedComponents/LoadingPanel';
import requireProps from 'app/data/requireProps';
import fpsakApi from 'data/fpsakApi';

import resetSubmitMessageActionCreator from './duck';
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

  submitCallback(values) {
    const { behandlingIdentifier, submitMessage, resetReduxForm: resetForm } = this.props;
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
    } = this.props;
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
          />
        )
        }
      </div>
    );
  }
}

MessagesIndex.propTypes = {
  submitFinished: PropTypes.bool.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  selectedBehandlingVersjon: PropTypes.number,
  selectedBehandlingSprak: PropTypes.shape(),
  recipients: PropTypes.arrayOf(PropTypes.string).isRequired,
  templates: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
    tilgjengelig: PropTypes.bool.isRequired,
  })).isRequired,
  fetchPreview: PropTypes.func.isRequired,
  submitMessage: PropTypes.func.isRequired,
  setBehandlingOnHold: PropTypes.func.isRequired,
  resetReduxForm: PropTypes.func.isRequired,
  resetSubmitMessage: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
};

MessagesIndex.defaultProps = {
  behandlingIdentifier: undefined,
  selectedBehandlingVersjon: undefined,
  selectedBehandlingSprak: undefined,
};

const mapStateToProps = state => ({
  recipients: getBrevMottakere(state),
  templates: getBrevMaler(state),
  submitFinished: fpsakApi.SUBMIT_MESSAGE.getRestApiFinished()(state),
  behandlingIdentifier: getSelectedBehandlingIdentifier(state),
  selectedBehandlingVersjon: getBehandlingVersjon(state),
  selectedBehandlingSprak: getBehandlingSprak(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    push,
    resetReduxForm,
    setBehandlingOnHold,
    fetchPreview: fpsakApi.PREVIEW_MESSAGE.makeRestApiRequest(),
    submitMessage: fpsakApi.SUBMIT_MESSAGE.makeRestApiRequest(),
    resetSubmitMessage: resetSubmitMessageActionCreator,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(requireProps(['recipients', 'templates'], <LoadingPanel />)(MessagesIndex));
