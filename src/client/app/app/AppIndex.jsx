import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import moment from 'moment';

import { parseQueryString } from 'utils/urlUtils';
import AppConfigResolver from './AppConfigResolver';
import {
  getCrashMessage, getErrorMessageCodeWithParams, getErrorMessages, getFunksjonellTid, getNavAnsattName,
  getRettskildeUrl, getSystemrutineUrl, removeErrorMessage, showCrashMessage,
} from './duck';
import LanguageProvider from './LanguageProvider';
import Header from './components/Header';
import Home from './components/Home';

import '../../nomodulestyles/global.less';

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 * Komponenten er også ansvarlig for å hente innlogget NAV-ansatt, rettskilde-url, systemrutine-url
 * og kodeverk fra server og lagre desse i klientens state.
 */
class AppIndex extends Component {
  componentDidUpdate(prevProps) {
    const { funksjonellTid } = this.props;
    if (prevProps.funksjonellTid !== funksjonellTid) {
      // TODO (TOR) Dette endrar jo berre moment. Kva med kode som brukar Date direkte?
      const diffInMinutes = moment().diff(funksjonellTid, 'minutes');
      // Hvis diffInMinutes har avvik på over 5min: override moment.now (ref. http://momentjs.com/docs/#/customization/now/)
      if (diffInMinutes >= 5 || diffInMinutes <= -5) {
        const diff = moment().diff(funksjonellTid);
        moment.now = () => Date.now() - diff;
      }
    }
  }

  componentDidCatch(error, info) {
    const { showCrashMessage: showCrashMsg } = this.props;
    showCrashMsg([
      error.toString(),
      info.componentStack
        .split('\n')
        .map(line => line.trim())
        .find(line => !!line),
    ].join(' '));
  }

  render() {
    const {
      location, crashMessage, errorMessagesLength, navAnsattName, rettskildeUrl, systemrutineUrl, funksjonellTid, removeErrorMessage: removeErrorMsg,
    } = this.props;
    const queryStrings = parseQueryString(location.search);

    return (
      <AppConfigResolver>
        <LanguageProvider>
          <Header
            queryStrings={queryStrings}
            navAnsattName={navAnsattName}
            removeErrorMessage={removeErrorMsg}
            rettskildeUrl={rettskildeUrl}
            systemrutineUrl={systemrutineUrl}
            funksjonellTid={funksjonellTid}
          />
          {!crashMessage && (
            <Home nrOfErrorMessages={queryStrings.errorcode || queryStrings.errormessage ? 1 : errorMessagesLength} />
          )
          }
        </LanguageProvider>
      </AppConfigResolver>
    );
  }
}

AppIndex.propTypes = {
  errorMessagesLength: PropTypes.number.isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
  crashMessage: PropTypes.string,
  showCrashMessage: PropTypes.func.isRequired,
  navAnsattName: PropTypes.string,
  rettskildeUrl: PropTypes.string,
  systemrutineUrl: PropTypes.string,
  funksjonellTid: PropTypes.string,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

AppIndex.defaultProps = {
  crashMessage: '',
  navAnsattName: '',
  rettskildeUrl: '',
  systemrutineUrl: '',
  funksjonellTid: undefined,
};

const mapStateToProps = state => ({
  errorMessagesLength: getErrorMessages(state).length + (getErrorMessageCodeWithParams(state) ? 1 : 0),
  crashMessage: getCrashMessage(state),
  navAnsattName: getNavAnsattName(state),
  rettskildeUrl: getRettskildeUrl(state),
  systemrutineUrl: getSystemrutineUrl(state),
  funksjonellTid: getFunksjonellTid(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({ showCrashMessage, removeErrorMessage }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(hot(module)(AppIndex)));
