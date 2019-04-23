
import { expect } from 'chai';

import {
  formReducer, saveInReduxState,
} from './formDuck';

describe('FormDuck-reducer', () => {
  it('skal returnere initial state', () => {
    expect((undefined, {})).to.eql({
    });
  });

  it('skal lagre forms i state', () => {
    const addForm1Action = saveInReduxState({
      key: 'form1',
      values: { value: 'test' },
    });
    const state = formReducer(undefined, addForm1Action);
    expect(state).is.eql({
      forms: { form1: { value: 'test' } },
    });

    const addForm2Action = saveInReduxState({
      key: 'form2',
      values: { value: 'test2' },
    });
    expect(formReducer(state, addForm2Action)).is.eql({
      forms: {
        form1: { value: 'test' },
        form2: { value: 'test2' },
      },
    });
  });
});
