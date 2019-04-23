import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { fetchNyeOgFerdigstilteOppgaverNokkeltall } from './duck';
import SaksbehandlerNokkeltallPanel from './components/SaksbehandlerNokkeltallPanel';

interface TsProps {
  fetchNyeOgFerdigstilteOppgaverNokkeltall: (sakslisteId: number) => void;
  valgtSakslisteId: number;
}

/**
 * SaksbehandlerNokkeltallIndex
 */
export class SaksbehandlerNokkeltallIndex extends Component<TsProps> {
  static propTypes = {
    fetchNyeOgFerdigstilteOppgaverNokkeltall: PropTypes.func.isRequired,
    valgtSakslisteId: PropTypes.number.isRequired,
  };

  componentDidMount = () => {
    const {
      fetchNyeOgFerdigstilteOppgaverNokkeltall: fetchNyeOgFerdige, valgtSakslisteId,
    } = this.props;
    fetchNyeOgFerdige(valgtSakslisteId);
  }

  componentDidUpdate = (prevProps: TsProps) => {
    const {
      fetchNyeOgFerdigstilteOppgaverNokkeltall: fetchNyeOgFerdige, valgtSakslisteId,
    } = this.props;
    if (prevProps.valgtSakslisteId !== valgtSakslisteId) {
      fetchNyeOgFerdige(valgtSakslisteId);
    }
  }

  render = () => (
    <SaksbehandlerNokkeltallPanel />
  )
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators({
    fetchNyeOgFerdigstilteOppgaverNokkeltall,
  }, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(SaksbehandlerNokkeltallIndex);
