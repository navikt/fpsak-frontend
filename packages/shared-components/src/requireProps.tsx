import React, { Component, ReactNode } from 'react';

/*
 * requireProps
 *
 *  Komponent som sikkerstiller att requiredprops virkligen er lastade.
 */
const propsWithValue = (propNames, value) => propNames
  .map((propName) => ({ [propName]: value }))
  .reduce((a, b) => ({ ...a, ...b }));

const requireProps = (requiredPropNames: string[], alternative?: ReactNode) => (WrappedComponent) => {
  class ComponentWithRequiredProps extends Component {
    static defaultProps = propsWithValue(requiredPropNames, null)

    displayName = `ComponentWithRequiredProps(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    WrappedComponent = WrappedComponent;

    constructor(props) {
      super(props);
      this.missingRequirements = this.missingRequirements.bind(this);
    }

    missingRequirements() {
      const { props } = this;
      return requiredPropNames
        .map((key) => props[key])
        .some((prop) => prop === null || prop === undefined);
    }

    render() {
      if (this.missingRequirements()) {
        return alternative || null;
      }
      return <WrappedComponent {...this.props} />;
    }
  }
  return ComponentWithRequiredProps;
};

export default requireProps;
