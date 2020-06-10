import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { formValueSelector, reduxForm, InjectedFormProps } from 'redux-form';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Column, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';

import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import advarselIcon from '@fpsak-frontend/assets/images/advarsel.svg';
import { hasValidSaksnummerOrFodselsnummerFormat } from '@fpsak-frontend/utils';
import { InputField } from '@fpsak-frontend/form';

import styles from './searchForm.less';

const isButtonDisabled = (searchStringObject, searchStartedObject) => !!(searchStartedObject.searchStarted
  || searchStringObject.searchString.length < 1);

interface OwnProps {
  searchString?: string;
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding: string;
  };
}

/**
 * SearchForm
 *
 * Presentasjonskomponent. Definerer søkefelt og tilhørende søkeknapp.
 */
export const SearchForm: FunctionComponent<OwnProps & WrappedComponentProps & InjectedFormProps > = ({
  intl,
  searchString = '',
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
        >
          <FormattedMessage id="Search.Search" />
        </Hovedknapp>
      </Column>
    </Row>
    {searchResultAccessDenied && (
      <Row>
        <Column xs="12">
          <Image className={styles.advarselIcon} src={advarselIcon} />
          <FormattedMessage id={searchResultAccessDenied.feilmelding} />
        </Column>
      </Row>
    )}
  </form>
);

const validate = (values) => {
  const errors = { searchString: undefined };
  errors.searchString = hasValidSaksnummerOrFodselsnummerFormat(values.searchString);
  return errors;
};

const mapStateToProps = (state) => ({
  searchString: formValueSelector('SearchForm')(state, 'searchString'),
});

export default connect(mapStateToProps)(reduxForm({
  form: 'SearchForm',
  validate,
})(injectIntl(SearchForm)));
