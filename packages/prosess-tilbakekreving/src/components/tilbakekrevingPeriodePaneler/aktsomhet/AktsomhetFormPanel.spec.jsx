import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { FormattedMessage } from 'react-intl';

import { RadioOption } from '@fpsak-frontend/form';

import sarligGrunn from '../../../kodeverk/sarligGrunn';
import aktsomhet from '../../../kodeverk/aktsomhet';
import AktsomhetGradFormPanel from './AktsomhetGradFormPanel';

import AktsomhetFormPanel from './AktsomhetFormPanel';

describe('<AktsomhetFormPanel>', () => {
  const sarligGrunnTyper = [{
    kode: sarligGrunn.GRAD_AV_UAKTSOMHET,
    navn: 'grad av uaktsomhet',
  }, {
    kode: sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL,
    navn: 'navs feil',
  }];
  const aktsomhetTyper = [{
    kode: aktsomhet.GROVT_UAKTSOM,
    navn: 'grovt',
  }, {
    kode: aktsomhet.SIMPEL_UAKTSOM,
    navn: 'simpel',
  }, {
    kode: aktsomhet.FORSETT,
    navn: 'forsett',
  }];

  it('skal vise radioknapp for hver aksomhetstype', () => {
    const wrapper = shallow(<AktsomhetFormPanel
      readOnly={false}
      resetFields={sinon.spy()}
      resetAnnetTextField={sinon.spy()}
      handletUaktsomhetGrad={undefined}
      harGrunnerTilReduksjon
      erSerligGrunnAnnetValgt={false}
      aktsomhetTyper={aktsomhetTyper}
      sarligGrunnTyper={sarligGrunnTyper}
      antallYtelser={2}
      feilutbetalingBelop={100}
      erTotalBelopUnder4Rettsgebyr={false}
    />);

    expect(wrapper.find(RadioOption)).to.have.length(3);
    expect(wrapper.find(AktsomhetGradFormPanel)).to.have.length(0);
  });

  it('skal vise panel for aktsomhet når dette er valgt', () => {
    const wrapper = shallow(<AktsomhetFormPanel
      readOnly={false}
      resetFields={sinon.spy()}
      resetAnnetTextField={sinon.spy()}
      handletUaktsomhetGrad={aktsomhet.GROVT_UAKTSOM}
      harGrunnerTilReduksjon
      erSerligGrunnAnnetValgt={false}
      aktsomhetTyper={aktsomhetTyper}
      sarligGrunnTyper={sarligGrunnTyper}
      antallYtelser={2}
      feilutbetalingBelop={100}
      erTotalBelopUnder4Rettsgebyr={false}
    />);

    expect(wrapper.find(RadioOption)).to.have.length(3);
    expect(wrapper.find(AktsomhetGradFormPanel)).to.have.length(1);
  });

  it('skal ikke vise panel for aktsomhet når dette ikke er valgt', () => {
    const wrapper = shallow(<AktsomhetFormPanel
      readOnly={false}
      resetFields={sinon.spy()}
      resetAnnetTextField={sinon.spy()}
      handletUaktsomhetGrad={undefined}
      harGrunnerTilReduksjon
      erSerligGrunnAnnetValgt={false}
      aktsomhetTyper={aktsomhetTyper}
      sarligGrunnTyper={sarligGrunnTyper}
      antallYtelser={2}
      feilutbetalingBelop={100}
      erTotalBelopUnder4Rettsgebyr={false}
    />);

    expect(wrapper.find(RadioOption)).to.have.length(3);
    expect(wrapper.find(AktsomhetGradFormPanel)).to.have.length(0);
  });

  it('skal vise riktig labels når valg resultattype ikke er Forsto/Burde forstått', () => {
    const wrapper = shallow(<AktsomhetFormPanel
      readOnly={false}
      resetFields={sinon.spy()}
      resetAnnetTextField={sinon.spy()}
      handletUaktsomhetGrad={undefined}
      erValgtResultatTypeForstoBurdeForstaatt={false}
      harGrunnerTilReduksjon
      erSerligGrunnAnnetValgt={false}
      aktsomhetTyper={aktsomhetTyper}
      sarligGrunnTyper={sarligGrunnTyper}
      antallYtelser={2}
      feilutbetalingBelop={100}
      erTotalBelopUnder4Rettsgebyr={false}
    />);

    expect(wrapper.find(RadioOption)).to.have.length(3);
    expect(wrapper.find(RadioOption).find({ value: 'SIMPEL_UAKTSOM' }).prop('label')).to.equal('simpel');
    expect(wrapper.find(RadioOption).find({ value: 'GROVT_UAKTSOM' }).prop('label')).to.equal('grovt');
    expect(wrapper.find(RadioOption).find({ value: 'FORSETT' }).prop('label')).to.equal('forsett');
  });

  it('skal vise riktig labels når valg resultattype er Forsto/Burde forstått', () => {
    const wrapper = shallow(<AktsomhetFormPanel
      readOnly={false}
      resetFields={sinon.spy()}
      resetAnnetTextField={sinon.spy()}
      handletUaktsomhetGrad={undefined}
      erValgtResultatTypeForstoBurdeForstaatt
      harGrunnerTilReduksjon
      erSerligGrunnAnnetValgt={false}
      aktsomhetTyper={aktsomhetTyper}
      sarligGrunnTyper={sarligGrunnTyper}
      antallYtelser={2}
      feilutbetalingBelop={100}
      erTotalBelopUnder4Rettsgebyr={false}
    />);

    const radioOptions = wrapper.find(RadioOption);
    expect(radioOptions).to.have.length(3);

    const simpelUaksomLabel = radioOptions.find({ value: 'SIMPEL_UAKTSOM' }).prop('label');
    const grovtUaktsomLabel = radioOptions.find({ value: 'GROVT_UAKTSOM' }).prop('label');
    const forsettLabel = radioOptions.find({ value: 'FORSETT' }).prop('label');

    expect(simpelUaksomLabel.type).is.equal(FormattedMessage);
    expect(simpelUaksomLabel.props.id).is.equal('AktsomhetFormPanel.AktsomhetTyperLabel.SimpelUaktsom');
    expect(grovtUaktsomLabel.type).is.equal(FormattedMessage);
    expect(grovtUaktsomLabel.props.id).is.equal('AktsomhetFormPanel.AktsomhetTyperLabel.GrovtUaktsomt');
    expect(forsettLabel.type).is.equal(FormattedMessage);
    expect(forsettLabel.props.id).is.equal('AktsomhetFormPanel.AktsomhetTyperLabel.Forsett');
  });

  it('skal lage form-initialvalues fra struktur når en har aktsomhetsgrad FORSETT', () => {
    const vilkarResultatInfo = {
      begrunnelse: 'test',
      aktsomhet: { kode: aktsomhet.FORSETT },
    };
    const initialValues = AktsomhetFormPanel.buildInitalValues(vilkarResultatInfo);

    expect(initialValues).to.eql({
      handletUaktsomhetGrad: aktsomhet.FORSETT,
    });
  });

  it('skal lage form-initialvalues fra struktur når en har aktsomhetsgrad FORSETT', () => {
    const vilkarResultatInfo = {
      begrunnelse: 'test',
      aktsomhet: { kode: aktsomhet.GROVT_UAKTSOM },
      aktsomhetInfo: {
        harGrunnerTilReduksjon: true,
        ileggRenter: true,
        andelTilbakekreves: 50,
        tilbakekrevesBelop: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
        sarligGrunner: sarligGrunnTyper,
      },
    };
    const initialValues = AktsomhetFormPanel.buildInitalValues(vilkarResultatInfo);

    expect(initialValues).to.eql({
      handletUaktsomhetGrad: aktsomhet.GROVT_UAKTSOM,
      [aktsomhet.GROVT_UAKTSOM]: {
        [sarligGrunn.GRAD_AV_UAKTSOMHET]: true,
        [sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL]: true,
        harGrunnerTilReduksjon: true,
        skalDetTilleggesRenter: true,
        andelSomTilbakekreves: '50',
        andelSomTilbakekrevesManuell: undefined,
        belopSomSkalTilbakekreves: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
        sarligGrunnerBegrunnelse: undefined,
      },
    });
  });

  it('skal lage form-initialvalues fra struktur når en har andel som skal tilbakekreves som er ulik standardverdier', () => {
    const vilkarResultatInfo = {
      begrunnelse: 'test',
      aktsomhet: { kode: aktsomhet.GROVT_UAKTSOM },
      aktsomhetInfo: {
        harGrunnerTilReduksjon: true,
        ileggRenter: true,
        andelTilbakekreves: 10,
        tilbakekrevesBelop: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
        sarligGrunner: sarligGrunnTyper,
        sarligGrunnerBegrunnelse: 'sarlig grunner begrunnelse',
      },
    };
    const initialValues = AktsomhetFormPanel.buildInitalValues(vilkarResultatInfo);

    expect(initialValues).to.eql({
      handletUaktsomhetGrad: aktsomhet.GROVT_UAKTSOM,
      [aktsomhet.GROVT_UAKTSOM]: {
        [sarligGrunn.GRAD_AV_UAKTSOMHET]: true,
        [sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL]: true,
        harGrunnerTilReduksjon: true,
        skalDetTilleggesRenter: true,
        andelSomTilbakekreves: 'Egendefinert',
        andelSomTilbakekrevesManuell: 10,
        belopSomSkalTilbakekreves: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
        sarligGrunnerBegrunnelse: 'sarlig grunner begrunnelse',
      },
    });
  });

  it('skal klargjøre data for lagring når en har FORSETT', () => {
    const info = {
      handletUaktsomhetGrad: aktsomhet.FORSETT,
      aktsomhetBegrunnelse: 'test',
    };
    const vurderingBegrunnelse = 'test';
    const transformertData = AktsomhetFormPanel.transformValues(info, sarligGrunnTyper, vurderingBegrunnelse);

    expect(transformertData).to.eql({
      '@type': 'annet',
      aktsomhet: aktsomhet.FORSETT,
      aktsomhetInfo: null,
      begrunnelse: 'test',
    });
  });

  it('skal klargjøre data for lagring når en har vært uaktsom', () => {
    const info = {
      handletUaktsomhetGrad: aktsomhet.GROVT_UAKTSOM,
      aktsomhetBegrunnelse: 'test',
      [aktsomhet.GROVT_UAKTSOM]: {
        [sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL]: true,
        harGrunnerTilReduksjon: true,
        skalDetTilleggesRenter: true,
        andelSomTilbakekreves: 70,
        belopSomSkalTilbakekreves: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
        sarligGrunnerBegrunnelse: 'sarlig grunner begrunnelse',
      },
    };
    const vurderingBegrunnelse = 'test';
    const transformertData = AktsomhetFormPanel.transformValues(info, sarligGrunnTyper, vurderingBegrunnelse);

    expect(transformertData).to.eql({
      '@type': 'annet',
      aktsomhet: aktsomhet.GROVT_UAKTSOM,
      aktsomhetInfo: {
        harGrunnerTilReduksjon: true,
        ileggRenter: undefined,
        sarligGrunnerBegrunnelse: 'sarlig grunner begrunnelse',
        sarligGrunner: [sarligGrunn.HELT_ELLER_DELVIS_NAVS_FEIL],
        andelTilbakekreves: 70,
        tilbakekrevesBelop: 100,
        annetBegrunnelse: 'test',
        tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: true,
      },
      begrunnelse: 'test',
    });
  });
});
