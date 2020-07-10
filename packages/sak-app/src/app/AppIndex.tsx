import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { Location } from 'history';
import { captureException, configureScope, withScope } from '@sentry/browser';

import errorHandler from '@fpsak-frontend/error-api-redux';
import { RestApiStateContext } from '@fpsak-frontend/rest-api-hooks';
import EventType from '@fpsak-frontend/rest-api/src/requestApi/eventType';
import { ForbiddenPage, UnauthorizedPage } from '@fpsak-frontend/sak-feilsider';
import { parseQueryString } from '@fpsak-frontend/utils';

import AppConfigResolver from './AppConfigResolver';
import LanguageProvider from './LanguageProvider';
import Home from './components/Home';
import Dekorator from './components/Dekorator';
import { FpsakApiKeys } from '../data/fpsakApiNyUtenRedux';

import '@fpsak-frontend/assets/styles/global.less';

interface OwnProps {
  errorMessages?: {
    type: EventType;
    code?: string;
    params?: {
      errorDetails?: string;
    };
    text?: string;
  }[];
  removeErrorMessage: () => void;
  crashMessage?: string;
  showCrashMessage: (message: string) => void;
  location: Location;
}

/**
 * AppIndex
 *
 * Container komponent. Dette er toppkomponenten i applikasjonen. Denne vil rendre header
 * og home-komponentene. Home-komponenten vil rendre barn-komponenter via ruter.
 * Komponenten er også ansvarlig for å hente innlogget NAV-ansatt og kodeverk fra server og
 * lagre desse i klientens state.
 */
class AppIndex extends Component<OwnProps> {
  static contextType = RestApiStateContext;

  static defaultProps = {
    crashMessage: '',
    navAnsattName: '',
    errorMessages: [],
  };

  state = {
    headerHeight: 0,
  };

  componentDidUpdate() {
    const state = this.context;
    const navAnsatt = state[FpsakApiKeys.NAV_ANSATT];
    const funksjonellTid = navAnsatt ? navAnsatt.funksjonellTid : undefined;

    if (funksjonellTid) {
      // TODO (TOR) Dette endrar jo berre moment. Kva med kode som brukar Date direkte?
      const diffInMinutes = moment()
        .diff(funksjonellTid, 'minutes');
      // Hvis diffInMinutes har avvik på over 5min: override moment.now (ref. http://momentjs.com/docs/#/customization/now/)
      if (diffInMinutes >= 5 || diffInMinutes <= -5) {
        const diff = moment()
          .diff(funksjonellTid);
        moment.now = () => Date.now() - diff;
      }
    }
  }

  componentDidCatch(error, info) {
    const { showCrashMessage: showCrashMsg } = this.props;

    withScope((scope) => {
      Object.keys(info).forEach((key) => {
        scope.setExtra(key, info[key]);
        captureException(error);
      });
    });

    showCrashMsg([
      error.toString(),
      info.componentStack
        .split('\n')
        .map((line) => line.trim())
        .find((line) => !!line),
    ].join(' '));

    // eslint-disable-next-line no-console
    console.error(error);
  }

  setSiteHeight = (headerHeight) => {
    document.documentElement.setAttribute('style', `height: calc(100% - ${headerHeight}px)`);
    this.setState((state) => ({ ...state, headerHeight }));
  }

  render() {
    const {
      location, crashMessage, errorMessages, removeErrorMessage: removeErrorMsg,
    } = this.props;
    const { headerHeight } = this.state;

    const state = this.context;
    const navAnsatt = state[FpsakApiKeys.NAV_ANSATT];
    const navAnsattName = navAnsatt ? navAnsatt.navn : undefined;

    // todo sjekke om dette er beste stedet å sette dette for sentry
    configureScope((scope) => {
      scope.setUser({ username: navAnsattName });
    });

    const queryStrings = parseQueryString(location.search);
    const forbiddenErrors = errorMessages.filter((o) => o.type === EventType.REQUEST_FORBIDDEN);
    const unauthorizedErrors = errorMessages.filter((o) => o.type === EventType.REQUEST_UNAUTHORIZED);
    const hasForbiddenOrUnauthorizedErrors = forbiddenErrors.length > 0 || unauthorizedErrors.length > 0;
    const shouldRenderHome = (!crashMessage && !hasForbiddenOrUnauthorizedErrors);

    return (
      <AppConfigResolver>
        <LanguageProvider>
          <Dekorator
            errorMessages={errorMessages}
            hideErrorMessages={hasForbiddenOrUnauthorizedErrors}
            queryStrings={queryStrings}
            removeErrorMessage={removeErrorMsg}
            setSiteHeight={this.setSiteHeight}
          />
          {shouldRenderHome && (<Home headerHeight={headerHeight} />)}
          {forbiddenErrors.length > 0 && (<ForbiddenPage />)}
          {unauthorizedErrors.length > 0 && (<UnauthorizedPage />)}
        </LanguageProvider>
      </AppConfigResolver>
    );
  }
}

const mapStateToProps = (state) => ({
  errorMessages: errorHandler.getAllErrorMessages(state),
  crashMessage: errorHandler.getCrashMessage(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  showCrashMessage: errorHandler.getCrashMessageActionCreator(),
  removeErrorMessage: errorHandler.getRemoveErrorMessageActionCreator(),
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppIndex));
