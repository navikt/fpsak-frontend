import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Modal from './Modal';

const otherProps = {};

describe('<Modal>', () => {
  it('skal rendre modal med children', () => {
    const wrapper = shallow(
      <div id="app">
        <Modal
          ariaHideApp={false}
          {...otherProps}
          shouldCloseOnOverlayClick={false}
        >
          <div className="content">test</div>
        </Modal>
      </div>,
    );
    expect(wrapper.find('div.content')).to.have.length(1);
    expect(wrapper.find(Modal).prop('ariaHideApp')).to.be.false;
    expect(wrapper.find(Modal).prop('shouldCloseOnOverlayClick')).to.be.false;
  });
});
