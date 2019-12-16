import React, { Component, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { captureException, withScope } from '@sentry/browser';

import { ErrorPage } from '@fpsak-frontend/sak-feilsider';

type OwnProps = {
  errorMessageCallback: (error: {}) => void;
  children: ReactNode;
};
type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<OwnProps, State> {
  static propTypes = {
    errorMessageCallback: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    const { errorMessageCallback } = this.props;

    withScope((scope) => {
      Object.keys(info).forEach((key) => {
        scope.setExtra(key, info[key]);
        captureException(error);
      });
    });

    errorMessageCallback([
      error.toString(),
      info.componentStack
        .split('\n')
        .map((line) => line.trim())
        .find((line) => !!line),
    ].join(' '));

    // eslint-disable-next-line no-console
    console.error(error);
  }

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    return hasError ? <ErrorPage /> : children;
  }
}

export default ErrorBoundary;
