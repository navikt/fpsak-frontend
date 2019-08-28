import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFraKode } from './kodeverkUtils';

const injectKodeverk = (getAlleKodeverkSelector) => (WrappedComponent) => {
  class KodeverkWrapper extends React.Component {
    getKodeverknavnFraKode = (kodeverkType, kode, undertype) => {
      const { alleKodeverk } = this.props;
      return getKodeverknavnFraKode(alleKodeverk, kodeverkType, kode, undertype);
    }

    // TODO (TOR) Endre nøkkel i map returnert av KodeverkRestTjeneste til å bruka DISCRIMINATOR, ikkje simplename. Kan da fjerna
    // mappinga kodeverkTyper[kodeverkOjekt.kodeverk]
    getKodeverknavn = (kodeverkOjekt, undertype) => this.getKodeverknavnFraKode(kodeverkTyper[kodeverkOjekt.kodeverk], kodeverkOjekt.kode, undertype)

    render() {
      const newProps = {
        getKodeverknavn: this.getKodeverknavn,
        getKodeverknavnFraKode: this.getKodeverknavnFraKode,
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  }

  KodeverkWrapper.displayName = `KodeverkWrapper(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  KodeverkWrapper.propTypes = {
    alleKodeverk: PropTypes.shape({}).isRequired,
  };

  const mapStateToProps = (state) => ({
    alleKodeverk: getAlleKodeverkSelector(state),
  });

  return connect(mapStateToProps)(KodeverkWrapper);
};

export default injectKodeverk;
