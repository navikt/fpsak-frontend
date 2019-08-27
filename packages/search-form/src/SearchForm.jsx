import React from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl, intlShape, FormattedMessage, FormattedHTMLMessage,
} from 'react-intl';
import { reduxForm, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Row, Column } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import advarselIcon from '@fpsak-frontend/assets/images/advarsel.svg';
import { hasValidSaksnummerOrFodselsnummerFormat } from '@fpsak-frontend/utils';
import { InputField } from '@fpsak-frontend/form';

import styles from './searchForm.less';

const isButtonDisabled = (searchStringObject, searchStartedObject) => !!(searchStartedObject.searchStarted
  || searchStringObject.searchString.length < 1);

/**
 * SearchForm
 *
 * Presentasjonskomponent. Definerer søkefelt og tilhørende søkeknapp.
 */
const SearchFormImpl = ({
  intl,
  searchString,
  searchStarted,
  searchResultAccessDenied,
  ...formProps
}) => (
  <form className={styles.container} onSubmit={formProps.handleSubmit}>
    <Undertittel>{intl.formatMessage({ id: 'Search.SearchFagsakOrPerson' })}</Undertittel>
    <VerticalSpacer eightPx />
    <Row>
      <Column xs="7">
        <InputField
          name="searchString"
          parse={(s = '') => s.trim()}
          label={intl.formatMessage({ id: 'Search.SaksnummerOrPersonId' })}
          bredde="L"
        />
      </Column>
      <Column xs="5">
        <Hovedknapp
          mini
          className={styles.button}
          spinner={searchStarted}
          disabled={isButtonDisabled({ searchString }, { searchStarted })}
          tabIndex="0"
        >
          <FormattedMessage id="Search.Search" />
        </Hovedknapp>
      </Column>
    </Row>
    {searchResultAccessDenied
    && (
    <Row>
      <Column xs="12">
        <Image className={styles.advarselIcon} src={advarselIcon} />
        <FormattedHTMLMessage className={styles.feilmelding} id={searchResultAccessDenied.feilmelding} />
      </Column>
    </Row>
    )}
  </form>
);

SearchFormImpl.propTypes = {
  intl: intlShape.isRequired,
  /**
   * Saksnummer eller fødselsnummer/D-nummer
   */
  searchString: PropTypes.string,
  searchStarted: PropTypes.bool.isRequired,
  searchResultAccessDenied: PropTypes.shape({
    feilmelding: PropTypes.string.isRequired,
  }),
};

SearchFormImpl.defaultProps = {
  searchString: '',
  searchResultAccessDenied: null,
};

const validate = (values) => {
  const errors = {};
  errors.searchString = hasValidSaksnummerOrFodselsnummerFormat(values.searchString);
  return errors;
};

const selector = formValueSelector('SearchForm');

const SearchForm = connect((state) => ({
  searchString: selector(state, 'searchString'),
}))(reduxForm({ form: 'SearchForm', validate })(injectIntl(SearchFormImpl)));

export { SearchForm as default, SearchFormImpl };
