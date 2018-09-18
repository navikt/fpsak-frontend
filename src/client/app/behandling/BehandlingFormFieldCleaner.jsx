import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxChange } from 'redux-form';

import { getBehandlingVersjon } from 'behandling/behandlingSelectors';
import { getSelectedBehandlingId } from 'behandling/duck';
import { getBehandlingFormName } from 'behandling/behandlingForm';
import ElementWrapper from 'sharedComponents/ElementWrapper';

const findAllNames = children => (children ? React.Children
  .map(children, (child) => {
    let all = [];
    if (child && child.props && child.props.children) {
      all = findAllNames(child.props.children);
    }
    if (child && child.props && child.props.name) {
      all.push(child.props.name);
    }
    return all;
  }) : []);

/**
 * BehandlingFormFieldCleaner
 *
 * Denne komponenten sørger for å fjerne redux-form feltverdier fra state når felt-komponenten blir fjernet fra DOM.
 * Strengene i fieldNames-prop må matche name-attributten i feltet som skal fjernes fra state.
 *
 * * Eksempel:
 * ```html
 * <BehandlingFormFieldCleaner formName={TEST_FORM} fieldNames={['fomDato']}>{children}</BehandlingFormFieldCleaner>
 * ```
 */
export class BehandlingFormFieldCleaner extends Component {
  shouldComponentUpdate(nextProps) {
    const { children } = this.props;
    const oldNames = findAllNames(children);
    const newNames = findAllNames(nextProps.children);

    const diff1 = oldNames.every(k => newNames.includes(k));
    const diff2 = newNames.every(k => oldNames.includes(k));
    return !diff1 || !diff2;
  }

  componentDidUpdate() {
    const {
      behandlingFormName, children, fieldNames, reduxChange: reduxFieldChange,
    } = this.props;
    const doNotRemoveFieldNames = findAllNames(children);

    fieldNames
      .filter(fieldName => !doNotRemoveFieldNames.includes(fieldName))
      .forEach((fieldName) => {
        reduxFieldChange(behandlingFormName, fieldName, null);
      });
  }

  render() {
    const { children } = this.props;
    return (
      <ElementWrapper>
        {children}
      </ElementWrapper>
    );
  }
}

BehandlingFormFieldCleaner.propTypes = {
  behandlingFormName: PropTypes.string.isRequired,
  fieldNames: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  reduxChange: PropTypes.func.isRequired,
};

BehandlingFormFieldCleaner.defaultProps = {
  children: [],
};

const getCompleteFormName = formName => createSelector(
  [getSelectedBehandlingId, getBehandlingVersjon], (behandlingId, versjon) => getBehandlingFormName(behandlingId, versjon, formName),
);

const mapStateToProps = (state, ownProps) => ({
  behandlingFormName: getCompleteFormName(ownProps.formName)(state),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxChange,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(BehandlingFormFieldCleaner);
