import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { TimeLineButton } from '@fpsak-frontend/tidslinje';
import DelOppPeriodeModal from './DelOppPeriodeModal';
import { PeriodeController } from './PeriodeController';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-tilbakekreving';


describe('<PeriodeController>', () => {
  it('skal vise knapp for å dele opp perioden og knapper for å velge forrige eller neste periode', () => {
    const wrapper = shallowWithIntl(<PeriodeController
      intl={intlMock}
      behandlingId={1}
      behandlingVersjon={1}
      beregnBelop={sinon.spy()}
      oppdaterSplittedePerioder={sinon.spy()}
      callbackForward={sinon.spy()}
      callbackBackward={sinon.spy()}
      periode={{}}
      readOnly={false}
    />);

    const knapper = wrapper.find(TimeLineButton);

    expect(knapper).to.have.length(2);
    expect(knapper.first().prop('text')).is.length.above(3);
    expect(knapper.last().prop('text')).is.length.above(3);
  });

  it('skal ikke vise knapp for å dele opp perioder når readonly', () => {
    const wrapper = shallowWithIntl(<PeriodeController
      intl={intlMock}
      behandlingId={1}
      behandlingVersjon={1}
      beregnBelop={sinon.spy()}
      oppdaterSplittedePerioder={sinon.spy()}
      callbackForward={sinon.spy()}
      callbackBackward={sinon.spy()}
      periode={{}}
      readOnly
    />);

    expect(wrapper.find(TimeLineButton)).to.have.length(2);
  });

  it('skal splitte periode via modal', async () => {
    const response = {
      payload: {
        perioder: [{
          belop: 400,
        }, {
          belop: 600,
        }],
      },
    };
    const beregnBelop = () => Promise.resolve(response);
    const oppdaterSplittedePerioder = sinon.spy();
    const periode = {
      feilutbetaling: 1000,
    };
    const wrapper = shallowWithIntl(<PeriodeController
      intl={intlMock}
      behandlingId={1}
      behandlingVersjon={1}
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
