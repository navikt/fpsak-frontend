import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
 * requireProps
 *
 *  Komponent som sikkerstiller att requiredprops virkligen er lastade.
 */

const propsWithValue = (propNames, value) => propNames
  .map(propName => ({ [propName]: value }))
  .reduce((a, b) => ({ ...a, ...b }));

const requireProps = (requiredPropNames, alternative) => (WrappedComponent) => {
  class ComponentWithRequiredProps extends Component {
    constructor() {
      super();
      this.missingRequirements = this.missingRequirements.bind(this);
    }

    missingRequirements() {
      const { props } = this;
      return requiredPropNames
        .map(key => props[key])
        .some(prop => prop === null || prop === undefined);
    }

    render() {
      if (this.missingRequirements()) {
        return alternative || null;
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  ComponentWithRequiredProps.propTypes = propsWithValue(requiredPropNames, PropTypes.any);
  ComponentWithRequiredProps.defaultProps = propsWithValue(requiredPropNames, null);
  ComponentWithRequiredProps.displayName = `ComponentWithRequiredProps(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  ComponentWithRequiredProps.WrappedComponent = WrappedComponent;
  return ComponentWithRequiredProps;
};

export default requireProps;
