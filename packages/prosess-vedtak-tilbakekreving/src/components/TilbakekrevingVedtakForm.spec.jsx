import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { ProsessStegSubmitButton } from '@fpsak-frontend/prosess-felles';

import { FlexColumn } from '@fpsak-frontend/shared-components';
import TilbakekrevingEditerVedtaksbrevPanel from './brev/TilbakekrevingEditerVedtaksbrevPanel';
import { TilbakekrevingVedtakFormImpl as TilbakekrevingVedtakForm } from './TilbakekrevingVedtakForm';
import underavsnittType from '../kodeverk/avsnittType';

describe('<TilbakekrevingVedtakForm>', () => {
  it('skal vise tekstfelt for begrunnelse og godkjenningsknapp', () => {
    const wrapper = shallow(<TilbakekrevingVedtakForm
      submitCallback={sinon.spy()}
      readOnly={false}
      readOnlySubmitButton={false}
      fetchPreviewVedtaksbrev={sinon.spy()}
      formVerdier={{}}
      vedtaksbrevAvsnitt={[{
        avsnittstype: 'test',
        overskrift: 'Dette er en overskrift',
        underavsnittsliste: [{
          fritekstTillatt: false,
        }],
      }]}
      behandlingId={1}
      behandlingUuid="uuid"
      behandlingVersjon={1}
      perioderSomIkkeHarUtfyltObligatoriskVerdi={[]}
    />);

    expect(wrapper.find(TilbakekrevingEditerVedtaksbrevPanel)).to.have.length(1);
    const knapp = wrapper.find(ProsessStegSubmitButton);
    expect(knapp).to.have.length(1);
    expect(knapp.prop('isSubmittable')).is.true;
    expect(wrapper.find('a')).to.have.length(1);
  });

  it('skal formatere data for forhåndsvisning av vedtaksbrevet', () => {
    const fetchPreview = sinon.spy();
    const wrapper = shallow(<TilbakekrevingVedtakForm
      submitCallback={sinon.spy()}
      readOnly={false}
      readOnlySubmitButton={false}
      fetchPreviewVedtaksbrev={fetchPreview}
      formVerdier={{
        OPPSUMMERING: 'Dette er oppsummeringen',
        '2019-10-10_2019-11-10': {
          FAKTA: 'dette er faktateksten',
          VILKÅR: 'dette er vilkårteksten',
          SÆRLIGEGRUNNER: 'dette er særligegrunnerteksten',
          SÆRLIGEGRUNNER_ANNET: 'dette er særligegrunnerteksten for annet',
        },
      }}
      vedtaksbrevAvsnitt={[{
        avsnittstype: 'test',
        overskrift: 'Dette er en overskrift',
        underavsnittsliste: [{
          fritekstTillatt: false,
        }],
      }]}
      behandlingId={2}
      behandlingUuid="uuid"
      behandlingVersjon={1}
      perioderSomIkkeHarUtfyltObligatoriskVerdi={[]}
    />);

    wrapper.find('a').prop('onClick')({ preventDefault: sinon.spy() });

    expect(fetchPreview.calledOnce).to.true;
    expect(fetchPreview.getCalls()[0].args[0]).is.eql({
      uuid: 'uuid',
      oppsummeringstekst: 'Dette er oppsummeringen',
      perioderMedTekst: [{
        fom: '2019-10-10',
        tom: '2019-11-10',
        faktaAvsnitt: 'dette er faktateksten',
        vilkaarAvsnitt: 'dette er vilkårteksten',
        saerligeGrunnerAvsnitt: 'dette er særligegrunnerteksten',
        saerligeGrunnerAnnetAvsnitt: 'dette er særligegrunnerteksten for annet',
      }],
    });
  });

  it('skal ikke vise trykkbar godkjenningsknapp og forhåndsvisningslenke når obligatoriske verdier ikke er utfylt', () => {
    const wrapper = shallow(<TilbakekrevingVedtakForm
      submitCallback={sinon.spy()}
      readOnly={false}
      readOnlySubmitButton={false}
      fetchPreviewVedtaksbrev={sinon.spy()}
      formVerdier={{}}
      vedtaksbrevAvsnitt={[{
        avsnittstype: 'test',
        overskrift: 'Dette er en overskrift',
        underavsnittsliste: [{
          fritekstTillatt: false,
        }],
      }]}
      behandlingId={1}
      behandlingUuid="uuid"
      behandlingVersjon={1}
      perioderSomIkkeHarUtfyltObligatoriskVerdi={['2019-01-01_2019-02-02']}
    />);

    const knapp = wrapper.find(ProsessStegSubmitButton);
    expect(knapp).to.have.length(1);
    expect(knapp.prop('isSubmittable')).is.false;
    expect(wrapper.find('a')).to.have.length(0);
  });

  it('skal ikke vise trykkbar godkjenningsknapp og forhåndsvisningslenke når obligatorisk oppsummering for revurdering tilbakekreving ikke er utfylt', () => {
    const wrapper = shallow(<TilbakekrevingVedtakForm
      submitCallback={sinon.spy()}
      readOnly={false}
      readOnlySubmitButton={false}
      fetchPreviewVedtaksbrev={sinon.spy()}
      formVerdier={{}}
      vedtaksbrevAvsnitt={[{
        avsnittstype: 'test',
        overskrift: 'Dette er en overskrift',
        underavsnittsliste: [{
          fritekstTillatt: false,
        }],
      }, {
        avsnittstype: underavsnittType.OPPSUMMERING,
        overskrift: 'Dette er en overskrift',
        underavsnittsliste: [{
          fritekstTillatt: false,
          fritekstPåkrevet: true,
        }],
      }]}
      behandlingId={1}
      behandlingUuid="uuid"
      behandlingVersjon={1}
      perioderSomIkkeHarUtfyltObligatoriskVerdi={[]}
      erRevurderingTilbakekrevingKlage
      fritekstOppsummeringPakrevdMenIkkeUtfylt
    />);

    const knapp = wrapper.find(ProsessStegSubmitButton);
    expect(knapp).to.have.length(1);
    expect(knapp.prop('isSubmittable')).is.false;
    expect(wrapper.find('a')).to.have.length(1);
    const flexColumns = wrapper.find(FlexColumn);
    expect(flexColumns).to.have.length(5);
  });
});
