import React from 'react';
import sinon from 'sinon';
import { intlMock, mountWithIntl } from './intl-enzyme-test-helper';

function noop() {
  return undefined;
}

export const inputMock = {
  name: 'mockInput',
  onBlur: noop,
  onChange: noop,
  onDragStart: noop,
  onDrop: noop,
  onFocus: noop,
};

export const metaMock = {
  active: false,
  asyncValidating: false,
  autofilled: false,
  dirty: false,
  dispatch: noop,
  error: null,
  form: 'mockForm',
  invalid: false,
  pristine: false,
  submitting: false,
  submitFailed: false,
  touched: false,
  valid: true,
  visited: false,
  warning: null,
};

export function mountFieldComponent(node, input = {}, meta = {}, label = 'field') {
  return mountWithIntl(React.cloneElement(node, {
    input: { ...inputMock, ...input },
    meta: { ...metaMock, ...meta },
    intl: intlMock,
    label,
  }));
}

/* Lagt til for a hindre warnings i tester */
export const reduxFormPropsMock = Object.assign(metaMock, {
  anyTouched: false,
  initialized: false,
  pure: false,
  submitSucceeded: false,
  asyncValidate: sinon.spy(),
  autofill: sinon.spy(),
  blur: sinon.spy(),
  change: sinon.spy(),
  clearAsyncError: sinon.spy(),
  destroy: sinon.spy(),
  handleSubmit: sinon.spy(),
  initialize: sinon.spy(),
  reset: sinon.spy(),
  touch: sinon.spy(),
  submit: sinon.spy(),
  untouch: sinon.spy(),
  clearSubmit: sinon.spy(),
  resetSection: sinon.spy(),
  clearFields: sinon.spy(),
  clearSubmitErrors: sinon.spy(),
  submitAsSideEffect: false,
});

export class MockFields {
  constructor(name, len) {
    const formatName = (index) => `${name}[${index}]`;
    const array = [...new Array(len).keys()].map(formatName); // NOSONAR

    this.array = array;
    this.push = () => array.push(formatName(array.length));
    this.pop = array.pop.bind(array);
    this.map = array.map.bind(array);
    this.get = (index) => array[index];

    this.get = (index) => array[index];
    this.remove = (index) => array.splice(index, 1);
  }

  get length() {
    return this.array.length;
  }
}

export class MockFieldsWithContent {
  constructor(name, array) {
    const formatName = (index) => `${name}[${index}]`;
    this.fields = array;
    this.array = [array].map(formatName); // NOSONAR;
    this.push = () => array.push(formatName(array.length));

    this.pop = array.pop.bind(array);
    this.map = array.map.bind(array);
    this.get = (index) => array[index];

    this.get = (index) => array[index];
    this.remove = (index) => {
      this.fields.splice(index, 1);
      this.array.splice(index, 1);
      return this.array;
    };

    this.forEach = array.forEach.bind(array);
  }

  get length() {
    return this.fields.length;
  }
}
