import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { createSelector } from 'reselect';
import { Row, Column } from 'nav-frontend-grid';
import { Undertekst } from 'nav-frontend-typografi';
import Lukknapp from 'nav-frontend-lukknapp';

import decodeHtmlEntity from 'utils/decodeHtmlEntityUtils';
import {
  getCrashMessage, getErrorMessages, getErrorMessageCodeWithParams, getShowDetailedErrorMessages,
} from 'app/duck';
import { getAllAsyncErrorMessages } from 'data/duck';
import ErrorMessageDetailsModal from './ErrorMessageDetailsModal';

import styles from './errorMessagePanel.less';

/**
 * ErrorMessagePanel
 *
 * Presentasjonskomponent. Definerer hvordan feilmeldinger vises.
 */
export class ErrorMessagePanel extends Component {
  constructor() {
    super();

    this.state = {
      isModalOpen: false,
      selectedErrorMsgIndex: undefined,
    };

    this.toggleModalOnClick = this.toggleModalOnClick.bind(this);
    this.toggleModalOnKeyDown = this.toggleModalOnKeyDown.bind(this);
  }

  toggleModalOnClick(e, index) {
    const { isModalOpen } = this.state;
    this.setState({
      isModalOpen: !isModalOpen,
      selectedErrorMsgIndex: index,
    });
    e.preventDefault();
  }

  toggleModalOnKeyDown(e, index) {
    if (e.key === 'Enter' || e.key === ' ') {
      this.toggleModal(e, index);
    } else {
      e.preventDefault();
    }
  }

  render() {
    const {
      showDetailedErrorMessages, errorMessages, removeErrorMessage, intl,
    } = this.props;
    const { isModalOpen, selectedErrorMsgIndex } = this.state;

    if (errorMessages.length === 0) {
      return null;
    }

    return (
      <div className={styles.container}>
        {errorMessages.map((message, index) => (
          <Row key={message}>
            <Column xs="11">
              <Undertekst className={styles.wordWrap}>
                {`${decodeHtmlEntity(message.message)} `}
              </Undertekst>
              {showDetailedErrorMessages && message.additionalInfo
              && (
                <Undertekst>
                  <a
                    href=""
                    onClick={e => this.toggleModalOnClick(e, index)}
                    onKeyDown={e => this.toggleModalOnKeyDown(e, index)}
                    className={styles.link}
                  >
                    <FormattedMessage id="ErrorMessagePanel.ErrorDetails" />
                  </a>
                </Undertekst>
              )}
            </Column>
          </Row>
        ))}
        <div className={styles.lukkContainer}>
          <Lukknapp hvit onClick={removeErrorMessage}>{intl.formatMessage({ id: 'ErrorMessagePanel.Close' })}</Lukknapp>
        </div>
        {isModalOpen
          && (
          <ErrorMessageDetailsModal
            showModal={isModalOpen}
            closeModalFn={this.toggleModalOnClick}
            errorDetails={errorMessages[selectedErrorMsgIndex].additionalInfo}
          />
          )
        }
      </div>
    );
  }
}

ErrorMessagePanel.propTypes = {
  intl: intlShape.isRequired,
  showDetailedErrorMessages: PropTypes.bool.isRequired,
  errorMessages: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string.isRequired,
    additionalInfo: PropTypes.shape(),
  }).isRequired).isRequired,
  removeErrorMessage: PropTypes.func.isRequired,
};

const filterMessage = (params, showDetailedErrorMessages) => (params.message && !showDetailedErrorMessages
  ? {
    ...params,
    message: '',
  }
  : params);

// TODO (TOR) Dette er rotete og lite forståeleg. Refaktorer...
export const getErrorMessageList = ownProps => createSelector(
  [getErrorMessages, getErrorMessageCodeWithParams, getCrashMessage, getShowDetailedErrorMessages, getAllAsyncErrorMessages],
  (errorMessages, errorMessageCodeWithParams, crashMessage, showDetailedErrorMessages, asyncErrorMessages) => {
    if (ownProps.queryStrings.errorcode) {
      return [{ message: ownProps.intl.formatMessage({ id: ownProps.queryStrings.errorcode }) }];
    } if (ownProps.queryStrings.errormessage) {
      return [{ message: ownProps.queryStrings.errormessage }];
    } if (crashMessage) {
      return [{ message: crashMessage }];
    } if (errorMessageCodeWithParams) {
      return [{
        message: ownProps.intl.formatMessage({ id: errorMessageCodeWithParams.code },
          filterMessage(errorMessageCodeWithParams.params, showDetailedErrorMessages)),
        additionalInfo: errorMessageCodeWithParams.params.errorDetails
          ? JSON.parse(decodeHtmlEntity(errorMessageCodeWithParams.params.errorDetails))
          : undefined,
      }];
    } if (errorMessages) {
      return errorMessages.map(em => ({ message: em }));
    }
    return asyncErrorMessages.map(em => ({ message: em }));
  },
);

const mapStateToProps = (state, ownProps) => ({
  errorMessages: getErrorMessageList(ownProps)(state),
  showDetailedErrorMessages: getShowDetailedErrorMessages(state),
});

export default injectIntl(connect(mapStateToProps)(ErrorMessagePanel));
