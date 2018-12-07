import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { SkjemaGruppe } from 'nav-frontend-skjema';

import renderNavField from './renderNavField';

const renderNavSkjemaGruppeWithError = renderNavField(({
  title, feil, getChildren, className,
}) => <SkjemaGruppe title={title} feil={feil} className={className}>{getChildren()}</SkjemaGruppe>);

const NavFieldGroup = ({
  errorMessageName, errorMessage, title, children, className,
}) => {
  if (!errorMessageName) {
    return (
      <SkjemaGruppe title={title} className={className} feil={errorMessage ? { feilmelding: errorMessage } : null}>
        {children}
      </SkjemaGruppe>
    );
  }
  return (
    <Field
      name={errorMessageName}
      component={renderNavSkjemaGruppeWithError}
      title={title}
      getChildren={() => children}
      className={className}
    />
  );
};

NavFieldGroup.propTypes = {
  errorMessageName: PropTypes.string,
  errorMessage: PropTypes.string,
  title: PropTypes.node,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  className: PropTypes.string,
};

NavFieldGroup.defaultProps = {
  errorMessageName: null,
  errorMessage: null,
  title: '',
  className: '',
};

export default NavFieldGroup;
