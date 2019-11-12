import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

import CreateNewBehandlingModal from './CreateNewBehandlingModal';
import MenuButton from '../MenuButton';
import MenyKodeverk from '../../MenyKodeverk';

const TILBAKEKREVING_BEHANDLINGSTYPER = [BehandlingType.TILBAKEKREVING, BehandlingType.TILBAKEKREVING_REVURDERING];

/**
 * CreateNewBehandlingMenuItem
 *
 * Presentasjonskomponent. Viser menyinnslag for ny 1.gangsbehandling.
 * Håndterer også visning av modal.
 */
class CreateNewBehandlingMenuItem extends Component {
  constructor() {
    super();

    this.submit = this.submit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);

    this.state = {
      showModal: false,
    };
  }

  submit(formValues) {
    const {
      saksnummer, behandlingIdentifier, submitNyBehandling, push,
    } = this.props;
    const data = {
      saksnummer: saksnummer.toString(),
      ...formValues,
    };

    const isTilbakekreving = TILBAKEKREVING_BEHANDLINGSTYPER.includes(formValues.behandlingType);
    const erBehandlingValgt = behandlingIdentifier !== undefined && behandlingIdentifier.behandlingId;
    submitNyBehandling(push, saksnummer, erBehandlingValgt, isTilbakekreving, data);
    this.hideModal();
  }

  showModal() {
    const { toggleBehandlingsmeny } = this.props;
    this.setState({ showModal: true });
    toggleBehandlingsmeny();
  }

  hideModal() {
    this.setState({ showModal: false });
  }

  render() {
    const {
      opprettNyForstegangsBehandlingEnabled, opprettRevurderingEnabled, ikkeVisOpprettNyBehandling, menyKodeverk,
      behandlingType, behandlingIdentifier, ytelseType, saksnummer, kanTilbakekrevingOpprettes, uuidForSistLukkede,
      erTilbakekrevingAktivert, sjekkOmTilbakekrevingKanOpprettes, sjekkOmTilbakekrevingRevurderingKanOpprettes,
    } = this.props;
    const { showModal } = this.state;
    return (
      <div>
        <MenuButton onMouseDown={this.showModal} disabled={ikkeVisOpprettNyBehandling}>
          <FormattedMessage id="Behandlingsmeny.NyForstegangsbehandling" />
        </MenuButton>
        {showModal && (
          <CreateNewBehandlingModal
            ytelseType={ytelseType}
            saksnummer={saksnummer}
            showModal={showModal}
            cancelEvent={this.hideModal}
            submitCallback={this.submit}
            hasEnabledCreateNewBehandling={opprettNyForstegangsBehandlingEnabled}
            hasEnabledCreateRevurdering={opprettRevurderingEnabled}
            menyKodeverk={menyKodeverk}
            kanTilbakekrevingOpprettes={kanTilbakekrevingOpprettes}
            behandlingType={behandlingType}
            behandlingId={behandlingIdentifier ? behandlingIdentifier.behandlingId : undefined}
            uuidForSistLukkede={uuidForSistLukkede}
            erTilbakekrevingAktivert={erTilbakekrevingAktivert}
            sjekkOmTilbakekrevingKanOpprettes={sjekkOmTilbakekrevingKanOpprettes}
            sjekkOmTilbakekrevingRevurderingKanOpprettes={sjekkOmTilbakekrevingRevurderingKanOpprettes}
          />
        )}
      </div>
    );
  }
}

CreateNewBehandlingMenuItem.propTypes = {
  menyKodeverk: PropTypes.instanceOf(MenyKodeverk).isRequired,
  behandlingType: kodeverkObjektPropType,
  ytelseType: kodeverkObjektPropType.isRequired,
  saksnummer: PropTypes.number.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier),
  push: PropTypes.func.isRequired,
  submitNyBehandling: PropTypes.func.isRequired,
  opprettNyForstegangsBehandlingEnabled: PropTypes.bool.isRequired,
  opprettRevurderingEnabled: PropTypes.bool.isRequired,
  ikkeVisOpprettNyBehandling: PropTypes.bool.isRequired,
  toggleBehandlingsmeny: PropTypes.func.isRequired,
  kanTilbakekrevingOpprettes: PropTypes.shape({
    kanBehandlingOpprettes: PropTypes.bool.isRequired,
    kanRevurderingOpprettes: PropTypes.bool.isRequired,
  }),
  uuidForSistLukkede: PropTypes.string,
  erTilbakekrevingAktivert: PropTypes.bool.isRequired,
  sjekkOmTilbakekrevingKanOpprettes: PropTypes.func.isRequired,
  sjekkOmTilbakekrevingRevurderingKanOpprettes: PropTypes.func.isRequired,
};

CreateNewBehandlingMenuItem.defaultProps = {
  behandlingType: undefined,
  uuidForSistLukkede: undefined,
};

export default CreateNewBehandlingMenuItem;
