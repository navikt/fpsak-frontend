import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';

import TilbakekrevingEditerVedtaksbrevPanel from './brev/TilbakekrevingEditerVedtaksbrevPanel';
import { TilbakekrevingVedtakFormImpl as TilbakekrevingVedtakForm } from './TilbakekrevingVedtakForm';

describe('<TilbakekrevingVedtakForm>', () => {
  it('skal vise tekstfelt for begrunnelse og godkjenningsknapp', () => {
    const wrapper = shallow(<TilbakekrevingVedtakForm
      submitCallback={sinon.spy()}
      readOnly={false}
      readOnlySubmitButton={false}
      fetchPreviewVedtaksbrev={sinon.spy()}
      behandlingIdentifier={new BehandlingIdentifier(1, 2)}
      formVerdier={{}}
      vedtaksbrevAvsnitt={[{
        avsnittstype: 'test',
        overskrift: 'Dette er en overskrift',
        underavsnittsliste: [{
          fritekstTillatt: false,
        }],
      }]}
    />);

    expect(wrapper.find(TilbakekrevingEditerVedtaksbrevPanel)).to.have.length(1);
    expect(wrapper.find(BehandlingspunktSubmitButton)).to.have.length(1);
  });

  it('skal formatere data for forhåndsvisning av vedtaksbrevet', () => {
    const fetchPreview = sinon.spy();
    const wrapper = shallow(<TilbakekrevingVedtakForm
      submitCallback={sinon.spy()}
      readOnly={false}
      readOnlySubmitButton={false}
      fetchPreviewVedtaksbrev={fetchPreview}
      behandlingIdentifier={new BehandlingIdentifier(1, 2)}
      formVerdier={{
        OPPSUMMERING: 'Dette er oppsummeringen',
        '2019-10-10_2019-11-10': {
          FAKTA: 'dette er faktateksten',
          VILKÅR: 'dette er vilkårteksten',
          SÆRLIGEGRUNNER: 'dette er særligegrunnerteksten',
        },
      }}
      vedtaksbrevAvsnitt={[{
        avsnittstype: 'test',
        overskrift: 'Dette er en overskrift',
        underavsnittsliste: [{
          fritekstTillatt: false,
        }],
      }]}
    />);

    wrapper.find('a').prop('onClick')({ preventDefault: sinon.spy() });

    expect(fetchPreview.calledOnce).to.true;
    expect(fetchPreview.getCalls()[0].args[0]).is.eql({
      behandlingId: 2,
      oppsummeringstekst: 'Dette er oppsummeringen',
      perioderMedTekst: [{
        fom: '2019-10-10',
        tom: '2019-11-10',
        faktaAvsnitt: 'dette er faktateksten',
        vilkaarAvsnitt: 'dette er vilkårteksten',
        saerligeGrunnerAvsnitt: 'dette er særligegrunnerteksten',
      }],
    });
  });
});
