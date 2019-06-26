import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Knapp } from 'nav-frontend-knapper';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';
import { behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { getSelectedBehandlingId } from 'behandlingForstegangOgRevurdering/src/duck';
import {
  getBehandlingVersjon,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import TilretteleggingTable from './TilretteleggingTable';
import TilretteleggingDetailForm, { TILRETTELEGGING_DETAIL_FORM_NAME } from './TilretteleggingDetailForm';

/**
 * TilretteleggingFaktaPanel
 *
 * Svangerskapspenger
 * Vise tabell med arbforhold og vise detaljer( fra søknad) når man klikker på et.
 */
export class TilretteleggingFaktaPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTilrettelegging: undefined,
    };
  }

  setSelected = (selectedTilrettelegging) => {
    const { settValgtTilrettelegging } = this.props;
    this.setState({ selectedTilrettelegging });
    settValgtTilrettelegging(selectedTilrettelegging);
  }

  setSelectedTilrettelegging = (selectedTilrettelegging) => {
    this.initializeTilretteleggingForm(selectedTilrettelegging);
    this.setSelected(selectedTilrettelegging);
  }

  initializeTilretteleggingForm = (selectedTilrettelegging) => {
    const { reduxFormInitialize: formInitialize, behandlingFormPrefix } = this.props;
    formInitialize(`${behandlingFormPrefix}.${TILRETTELEGGING_DETAIL_FORM_NAME}`, selectedTilrettelegging);
  }

  cancelTilrettelegging = () => {
    this.initializeTilretteleggingForm({});
    this.setSelected(undefined);
  }

  updateTilrettelegging = (values) => {
    const {
      reduxFormChange: formChange, behandlingFormPrefix, tilrettelegginger, parentFormName,
    } = this.props;
    const otherThanUpdated = tilrettelegginger.filter(a => a.id !== values.id);
    const fieldValues = otherThanUpdated.concat(values).sort((a, b) => a.fom.localeCompare(b.fom));
    formChange(`${behandlingFormPrefix}.${parentFormName}`, 'tilrettelegginger', fieldValues);
    this.setSelected(undefined);
  }

  createTilrettelegging = () => {
    this.setSelected({
      id: 2,
      fom: undefined,
      stillingsprosent: undefined,
      type: undefined,
    });
  }

  slettTilrettelegging = (selectedTilrettelegging) => {
    const {
      reduxFormChange: formChange, behandlingFormPrefix, tilrettelegginger, parentFormName,
    } = this.props;
    const otherThanDeleted = tilrettelegginger.filter(a => a.id !== selectedTilrettelegging.id);
    formChange(`${behandlingFormPrefix}.${parentFormName}`, 'tilrettelegginger', otherThanDeleted);
    this.setSelected(undefined);
  }

  render() {
    const {
      tilrettelegginger,
      readOnly,
      submittable,
    } = this.props;
    const { selectedTilrettelegging } = this.state;

    return (
      <FaktaGruppe>
        <TilretteleggingTable
          tilrettelegginger={tilrettelegginger}
          settValgtTilrettelegging={this.setSelectedTilrettelegging}
          valgtTilrettelegging={selectedTilrettelegging}
          slettTilrettelegging={this.slettTilrettelegging}
        />
        {selectedTilrettelegging && (
          <TilretteleggingDetailForm
            readOnly={readOnly}
            valgtTilrettelegging={selectedTilrettelegging}
            updateTilrettelegging={this.updateTilrettelegging}
            cancelTilrettelegging={this.cancelTilrettelegging}
            submittable={submittable}
          />
        )}
        {!selectedTilrettelegging && (
          <Knapp
            htmlType="button"
            mini
            onClick={this.createTilrettelegging}
          >
            <FormattedMessage id="ArbeidsforholdInnhold.LeggTilPeriode" />
          </Knapp>
        )}
        <VerticalSpacer fourPx />
      </FaktaGruppe>
    );
  }
}

TilretteleggingFaktaPanel.propTypes = {
  tilrettelegginger: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  parentFormName: PropTypes.string.isRequired,
  settValgtTilrettelegging: PropTypes.func.isRequired,
  submittable: PropTypes.bool.isRequired,
};

const EMPTY_ARRAY = [];

const mapStateToProps = (state, ownProps) => {
  const tilrettelegginger = behandlingFormValueSelector(ownProps.parentFormName)(state, 'tilrettelegginger') || EMPTY_ARRAY;
  tilrettelegginger.sort((a, b) => a.fom.localeCompare(b.fom));
  return {
    tilrettelegginger,
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TilretteleggingFaktaPanel);
