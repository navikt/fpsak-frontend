import { expect } from 'chai';
import sinon from 'sinon';
import reducerRegistry from './ReducerRegistry';

describe('ReducerRegistry', () => {
  const reducer1 = 'Dette er en reducer';
  const reducer2 = 'Dette er en ny reducer';

  before(() => {
    reducerRegistry.clear();
  });

  afterEach(() => {
    reducerRegistry.clear();
  });

  it('skal ikke feile når det ikke er satt en event-listener', () => {
    reducerRegistry.register('testReducer', reducer1);
    reducerRegistry.register('testReducer2', reducer2);
    expect(reducerRegistry.getReducers()).to.eql({
      testReducer: reducer1,
      testReducer2: reducer2,
    });
  });

  it('skal utføre event når det er satt en event-listener', () => {
    const listener = sinon.spy();
    reducerRegistry.setChangeListener(listener);

    reducerRegistry.register('testReducer', reducer1);

    expect(listener.calledOnce).to.be.true;
    const { args } = listener.getCalls()[0];
    expect(args[0]).to.eql({
      testReducer: reducer1,
    });
  });
});
