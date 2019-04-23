import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  injectIntl, intlShape, FormattedMessage, FormattedHTMLMessage,
} from 'react-intl';

import { Form } from 'react-final-form';
import { Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';

import { getNavAnsattKanSaksbehandle } from 'app/duck';
import { FlexContainer, FlexRow, FlexColumn } from 'sharedComponents/flexGrid';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Image from 'sharedComponents/Image';
import advarselIcon from 'images/advarsel.svg';
import { hasValidSaksnummerOrFodselsnummerFormat } from 'utils/validation/validators';
import { InputField, CheckboxField } from '@fpsak-frontend/form-final';

import styles from './searchForm.less';

const isButtonDisabled = (searchString, searchStarted) => {
  if (searchStarted || !searchString) {
    return true;
  }
  return false;
};

interface TsProps {
  intl: any;
  onSubmit: ({ searchString: string, skalReservere: boolean }) => void;
  searchStarted: boolean;
  searchResultAccessDenied?: {
    feilmelding?: string;
  };
  resetSearch: () => void;
  kanSaksbehandle: boolean;
}

/**
 * SearchForm
 *
 * Presentasjonskomponent. Definerer søkefelt og tilhørende søkeknapp.
 */
export const SearchForm = ({
  intl,
  onSubmit,
  searchStarted,
  searchResultAccessDenied,
  resetSearch,
  kanSaksbehandle,
}: TsProps) => (
  <Form
    onSubmit={onSubmit}
    render={({ handleSubmit, values }) => (
      <form className={styles.container} onSubmit={handleSubmit}>
        <Undertittel>{intl.formatMessage({ id: 'Search.SearchFagsakOrPerson' })}</Undertittel>
        {kanSaksbehandle && (
        <>
          <VerticalSpacer sixteenPx />
          <CheckboxField name="skalReservere" label={intl.formatMessage({ id: 'Search.ReserverBehandling' })} onClick={resetSearch} />
        </>
        )
        }
        <VerticalSpacer eightPx />
        <FlexContainer fluid>
          <FlexRow>
            <FlexColumn>
              <InputField
                name="searchString"
                parse={(s = '') => s.trim()}
                label={intl.formatMessage({ id: 'Search.SaksnummerOrPersonId' })}
                bredde="L"
                validate={[hasValidSaksnummerOrFodselsnummerFormat]}
              />
            </FlexColumn>
            <FlexColumn>
              <Knapp
                mini
                htmlType="submit"
                className={styles.button}
                spinner={searchStarted}
                disabled={isButtonDisabled(values.searchString, searchStarted)}
                tabIndex="0"
              >
                <FormattedMessage id="Search.Search" />
              </Knapp>
            </FlexColumn>
          </FlexRow>
          {searchResultAccessDenied && searchResultAccessDenied.feilmelding && (
          <FlexRow>
            <FlexColumn>
              <Image className={styles.advarselIcon} src={advarselIcon} />
              <FormattedHTMLMessage className={styles.feilmelding} id={searchResultAccessDenied.feilmelding} />
            </FlexColumn>
          </FlexRow>
          )
          }
        </FlexContainer>
      </form>
    )}
  />
);

SearchForm.propTypes = {
  intl: intlShape.isRequired,
  onSubmit: PropTypes.func.isRequired,
  searchStarted: PropTypes.bool.isRequired,
  searchResultAccessDenied: PropTypes.shape({
    feilmelding: PropTypes.string,
  }),
  resetSearch: PropTypes.func.isRequired,
  kanSaksbehandle: PropTypes.bool.isRequired,
};

SearchForm.defaultProps = {
  searchResultAccessDenied: {
    feilmelding: undefined,
  },
};

const mapStateToProps = state => ({
  kanSaksbehandle: getNavAnsattKanSaksbehandle(state),
});

export default connect(mapStateToProps)(injectIntl(SearchForm));
