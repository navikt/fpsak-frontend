import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { Knapp } from 'nav-frontend-knapper';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';
import { omit } from '@fpsak-frontend/utils';

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
      reduxFormChange: formChange, behandlingFormPrefix, tilretteleggingDatoer, parentFormName,
    } = this.props;

    const updatedTilrettelegging = values.type.kode === tilretteleggingType.DELVIS_TILRETTELEGGING
      ? values : omit(values, 'stillingsprosent');

    const otherThanUpdated = tilretteleggingDatoer.filter(a => a.id !== values.id);
    const fieldValues = otherThanUpdated.concat(updatedTilrettelegging).sort((a, b) => a.fom.localeCompare(b.fom));
    formChange(`${behandlingFormPrefix}.${parentFormName}`, 'tilretteleggingDatoer', fieldValues);
    this.setSelected(undefined);
  }

  createTilrettelegging = () => {
    const { tilretteleggingDatoer } = this.props;
    const nesteId = tilretteleggingDatoer.reduce((id, t) => (t.id >= id ? t.id + 1 : id), 0);
    this.setSelectedTilrettelegging({
      id: nesteId,
      fom: undefined,
      stillingsprosent: undefined,
      type: undefined,
    });
  }

  slettTilrettelegging = (selectedTilrettelegging) => {
    const {
      reduxFormChange: formChange, behandlingFormPrefix, tilretteleggingDatoer, parentFormName,
    } = this.props;
    const otherThanDeleted = tilretteleggingDatoer.filter(a => a.id !== selectedTilrettelegging.id);
    formChange(`${behandlingFormPrefix}.${parentFormName}`, 'tilretteleggingDatoer', otherThanDeleted);
    if (otherThanDeleted.length === 0) {
      this.createTilrettelegging();
    } else {
      this.setSelected(undefined);
    }
  }

  render() {
    const {
      tilretteleggingDatoer,
      readOnly,
      submittable,
      jordmorTilretteleggingFraDato,
    } = this.props;
    const { selectedTilrettelegging } = this.state;

    return (
      <FaktaGruppe>
        <TilretteleggingTable
          tilretteleggingDatoer={tilretteleggingDatoer}
          settValgtTilrettelegging={this.setSelectedTilrettelegging}
          valgtTilrettelegging={selectedTilrettelegging}
          slettTilrettelegging={this.slettTilrettelegging}
          readOnly={readOnly}
        />
        {(selectedTilrettelegging || tilretteleggingDatoer.length === 0) && (
          <TilretteleggingDetailForm
            readOnly={readOnly}
            initialValues={selectedTilrettelegging}
            onSubmit={this.updateTilrettelegging}
            validate={values => TilretteleggingDetailForm.validate(values, tilretteleggingDatoer, jordmorTilretteleggingFraDato)}
            cancelTilrettelegging={this.cancelTilrettelegging}
            submittable={submittable}
            harIngenTilretteleggingDatoer={tilretteleggingDatoer.length === 0}
          />
        )}
        {!selectedTilrettelegging && tilretteleggingDatoer.length > 0 && (
          <Knapp
            htmlType="button"
            mini
            disabled={readOnly}
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
  tilretteleggingDatoer: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  parentFormName: PropTypes.string.isRequired,
  settValgtTilrettelegging: PropTypes.func.isRequired,
  submittable: PropTypes.bool.isRequired,
  jordmorTilretteleggingFraDato: PropTypes.string.isRequired,
};

const EMPTY_ARRAY = [];

const mapStateToProps = (state, ownProps) => {
  const tilretteleggingDatoer = behandlingFormValueSelector(ownProps.parentFormName)(state, 'tilretteleggingDatoer') || EMPTY_ARRAY;
  tilretteleggingDatoer.sort((a, b) => a.fom.localeCompare(b.fom));
  return {
    tilretteleggingDatoer,
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
