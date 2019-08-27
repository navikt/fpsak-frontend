import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { Image } from '@fpsak-frontend/shared-components';

import DelOppPeriodeModal from './DelOppPeriodeModal';
import { PeriodeControllerImpl } from './PeriodeController';

describe('<PeriodeController>', () => {
  it('skal vise knapp for å dele opp perioden og knapper for å velge forrige eller neste periode', () => {
    const wrapper = shallow(<PeriodeControllerImpl
      behandlingId={1}
      beregnBelop={sinon.spy()}
      oppdaterSplittedePerioder={sinon.spy()}
      callbackForward={sinon.spy()}
      callbackBackward={sinon.spy()}
      periode={{}}
      readOnly={false}
    />);

    const knapper = wrapper.find(Image);
    expect(knapper).to.have.length(3);
    expect(knapper.first().prop('altCode')).is.eql('PeriodeController.DelOppPerioden');
    expect(knapper.at(1).prop('altCode')).is.eql('PeriodeController.ForrigePeriode');
    expect(knapper.last().prop('altCode')).is.eql('PeriodeController.NestePeriode');
  });

  it('skal ikke vise knapp for å dele opp perioder når readonly', () => {
    const wrapper = shallow(<PeriodeControllerImpl
      behandlingId={1}
      beregnBelop={sinon.spy()}
      oppdaterSplittedePerioder={sinon.spy()}
      callbackForward={sinon.spy()}
      callbackBackward={sinon.spy()}
      periode={{}}
      readOnly
    />);

    expect(wrapper.find(Image)).to.have.length(2);
  });

  it('skal splitte periode via modal', async () => {
    const response = {
      perioder: [{
        belop: 400,
      }, {
        belop: 600,
      }],
    };
    const beregnBelop = () => Promise.resolve(response);
    const oppdaterSplittedePerioder = sinon.spy();
    const periode = {
      feilutbetaling: 1000,
    };
    const wrapper = shallow(<PeriodeControllerImpl
      behandlingId={1}
      beregnBelop={beregnBelop}
      oppdaterSplittedePerioder={oppdaterSplittedePerioder}
      callbackForward={sinon.spy()}
      callbackBackward={sinon.spy()}
      periode={periode}
      readOnly
    />);
    wrapper.setState({ showDelPeriodeModal: true });

    const formValues = {
      forstePeriode: {
        fom: '2019-10-10',
        tom: '2019-11-10',
      },
      andrePeriode: {
        fom: '2019-11-11',
        tom: '2019-12-10',
      },
    };

    const modal = wrapper.find(DelOppPeriodeModal);
    await modal.prop('splitPeriod')(formValues);

    expect(oppdaterSplittedePerioder.called).is.true;
    const { args } = oppdaterSplittedePerioder.getCalls()[0];
    expect(args).has.length(1);
    expect(args[0]).is.eql([{
      feilutbetaling: 400,
      fom: '2019-10-10',
      tom: '2019-11-10',
    }, {
      feilutbetaling: 600,
      fom: '2019-11-11',
      tom: '2019-12-10',
    }]);
  });
});
