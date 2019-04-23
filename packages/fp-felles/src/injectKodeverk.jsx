import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

const injectKodeverk = getAlleKodeverkSelector => (WrappedComponent) => {
  class KodeverkWrapper extends React.Component {
    getKodeverknavnFraKode = (kodeverkType, kode) => {
      const { alleKodeverk } = this.props;
      const kodeverkForType = alleKodeverk[kodeverkType];
      if (!kodeverkForType || kodeverkForType.length === 0) {
        return '';
      }
      const kodeverk = kodeverkForType.find(k => k.kode === kode);
      return kodeverk ? kodeverk.navn : '';
    }

    getKodeverknavn = kodeverkOjekt => this.getKodeverknavnFraKode(kodeverkTyper[kodeverkOjekt.kodeverk], kodeverkOjekt.kode)

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

  const mapStateToProps = state => ({
    alleKodeverk: getAlleKodeverkSelector(state),
  });

  return connect(mapStateToProps)(KodeverkWrapper);
};

export default injectKodeverk;
