import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { LoadingPanel, requireProps } from '@fpsak-frontend/shared-components';
import errorHandler from '@fpsak-frontend/error-api-redux';

import { updateAktoer as updateAktoerCreator } from './duck';
import { getAllAktoerInfoResolved, getSelectedAktoerId } from './aktoerSelectors';

/**
 * AktoerResolver
 *
 * Container-komponent. Har ansvar for å hente info om aktør med et gitt saksnummer fra serveren.
 * NB: Komponenten henter kun ajtør når den konstrueres. Bruk unik key.
 */
export class AktoerResolver extends Component {
  constructor(props) {
    super(props);
    const { aktoerId, updateAktoer } = this.props;
    updateAktoer(aktoerId);
  }

  render() {
    const { children, allAktoerInfoResolved } = this.props;
    if (!allAktoerInfoResolved) {
      return <LoadingPanel />;
    }
    return children;
  }
}

AktoerResolver.propTypes = {
  children: PropTypes.node,
  aktoerId: PropTypes.number.isRequired,
  updateAktoer: PropTypes.func.isRequired,
  allAktoerInfoResolved: PropTypes.bool.isRequired,
};
AktoerResolver.defaultProps = {
  children: null,
};
const mapStateToProps = (state) => ({
  aktoerId: getSelectedAktoerId(state),
  allAktoerInfoResolved: getAllAktoerInfoResolved(state),

});
const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateAktoer: updateAktoerCreator,
  removeErrorMessage: errorHandler.removeErrorMessage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(requireProps(['aktoerId'], <LoadingPanel />)(AktoerResolver));
