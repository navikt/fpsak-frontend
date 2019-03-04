import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import { reduxFormPropsMock } from '@fpsak-frontend/assets/testHelpers/redux-form-test-helper';
import sinon from 'sinon';
import avregningCodes from '@fpsak-frontend/kodeverk/src/avregningCodes';
import { AvregningPanelImpl, transformValues } from './AvregningPanel';

const simuleringResultat = {
  simuleringResultat: {
    periodeFom: '2018-09-01',
    periodeTom: '2018-12-31',
    sumFeilutbetaling: 0,
    sumEtterbetaling: 0,
    sumInntrekk: 0,
    ingenPerioderMedAvvik: false,
  },
  simuleringResultatUtenInntrekk: null,
};

const mockProps = {
  ...reduxFormPropsMock,
  simuleringResultat,
  isApOpen: false,
  apCodes: [],
  readOnly: false,
  erTilbakekrevingVilkårOppfylt: false,
  grunnerTilReduksjon: false,
  previewCallback: sinon.spy(),
};

describe('<AvregningPanelImpl>', () => {
  it('skal rendre AvregningPanel', () => {
    const wrapper = shallow(<AvregningPanelImpl
      {...mockProps}
    />);

    const fadingPanel = wrapper.find('FadingPanel');
    expect(fadingPanel).has.length(1);
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage).to.have.length(1);
    expect(formattedMessage.prop('id')).is.eql('Avregning.Title');
    const undertittel = wrapper.find('Undertittel');
    expect(undertittel).has.length(1);
    const avregningSummary = wrapper.find('AvregningSummary');
    expect(avregningSummary).has.length(1);
    const avregningTable = wrapper.find('AvregningTable');
    expect(avregningTable).has.length(1);
    const row = wrapper.find('Row');
    expect(row).has.length(1);
    const column = wrapper.find('Column');
    expect(column).has.length(1);
    const form = wrapper.find('form');
    expect(form).has.length(0);
  });

  it('skal rendre form med RadioGroup med to valg når aksjonspunkt 5084 er aktivt', () => {
    const props = {
      ...mockProps,
      apCodes: ['5084'],
    };
    const wrapper = shallow(<AvregningPanelImpl
      {...props}
    />);

    const form = wrapper.find('form');
    expect(form).has.length(1);
    const radioGroupField = wrapper.find('RadioGroupField');
    expect(radioGroupField).has.length(1);
    expect(radioGroupField.at(0).prop('name')).is.eql('videreBehandling');
    const radioOption = wrapper.find('RadioOption');
    expect(radioOption).has.length(2);
    const radioOptionGjennomfør = radioOption.at(0);
    expect(radioOptionGjennomfør.prop('label')).is.eql(<FormattedMessage id="Avregning.gjennomfør" />);
    const radioOptionAvvent = radioOption.at(1);
    expect(radioOptionAvvent.prop('label')).is.eql(<FormattedMessage id="Avregning.avvent" />);
  });

  it('skal rendre form med to RadioGroup, hver med to valg når aksjonspunkt 5085 er aktivt og erTilbakekrevingVilkårOppfylt er true', () => {
    const props = {
      ...mockProps,
      apCodes: ['5085'],
      erTilbakekrevingVilkårOppfylt: true,
    };
    const wrapper = shallow(<AvregningPanelImpl
      {...props}
    />);

    const form = wrapper.find('form');
    expect(form).has.length(1);
    const radioGroupField = wrapper.find('RadioGroupField');
    expect(radioGroupField).has.length(2);
    expect(radioGroupField.at(0).prop('name')).is.eql('erTilbakekrevingVilkårOppfylt');
    expect(radioGroupField.at(1).prop('name')).is.eql('grunnerTilReduksjon');
    const radioOption = wrapper.find('RadioOption');
    expect(radioOption).has.length(4);
    expect(radioOption.at(0).prop('label')).is.eql(<FormattedMessage id="Avregning.formAlternativ.ja" />);
    expect(radioOption.at(1).prop('label')).is.eql(<FormattedMessage id="Avregning.formAlternativ.nei" />);
    expect(radioOption.at(2).prop('label')).is.eql(<FormattedMessage id="Avregning.formAlternativ.ja" />);
    expect(radioOption.at(3).prop('label')).is.eql(<FormattedMessage id="Avregning.formAlternativ.nei" />);
  });

  it('method toggleDetails skal oppdatere og toggle tabeler med showDetails state', () => {
    const id = 7;
    const wrapper = shallow(<AvregningPanelImpl
      {...mockProps}
    />);

    expect(wrapper.state('showDetails')).is.eql([]);
    wrapper.instance().toggleDetails(id);
    expect(wrapper.state('showDetails')).is.eql([{ id, show: true }]);
    wrapper.instance().toggleDetails(id);
    expect(wrapper.state('showDetails')).is.eql([{ id, show: false }]);
  });

  it(`gitt aksjonspunt 5085 og erTilbakekrevingVilkårOppfylt er ikke undefined, 
      state verdi feilutbetaling oppdateres med erTilbakekrevingVilkårOppfylt verdi`, () => {
    const props = {
      ...mockProps,
      apCodes: ['5085'],
      erTilbakekrevingVilkårOppfylt: undefined,
    };
    const wrapper = shallow(<AvregningPanelImpl
      {...props}
    />);

    expect(wrapper.state('feilutbetaling')).is.eql(undefined);
    wrapper.setProps({ erTilbakekrevingVilkårOppfylt: true });
    expect(wrapper.state('feilutbetaling')).is.eql(true);
    wrapper.setProps({ erTilbakekrevingVilkårOppfylt: false });
    expect(wrapper.state('feilutbetaling')).is.eql(false);
  });

  it('feilutbetaling oppdateres ikke når aksjonspunkt er ikke 5085', () => {
    const props = {
      ...mockProps,
      apCodes: ['5084'],
      erTilbakekrevingVilkårOppfylt: undefined,
    };
    const wrapper = shallow(<AvregningPanelImpl
      {...props}
    />);

    expect(wrapper.state('feilutbetaling')).is.eql(undefined);
    wrapper.setProps({ erTilbakekrevingVilkårOppfylt: true });
    expect(wrapper.state('feilutbetaling')).is.eql(undefined);
  });

  it('transform values skal returnere inntrekk som videre behandling gitt at vilkår er oppfylt og grunnerTilReduksjon er false', () => {
    const values = {
      erTilbakekrevingVilkårOppfylt: true,
      grunnerTilReduksjon: false,
      videreBehandling: avregningCodes.TILBAKEKR_INFOTRYGD,
    };
    const apCode = '5084';

    const transformedValues = transformValues(values, apCode)[0];
    expect(transformedValues.kode).is.eql(apCode);
    expect(transformedValues.grunnerTilReduksjon).is.eql(values.grunnerTilReduksjon);
    expect(transformedValues.videreBehandling).is.eql(avregningCodes.TILBAKEKR_INNTREKK);
  });

  it('transform values skal returnere verdi av videre behandling gitt at vilkår er oppfylt og grunnerTilReduksjon er true', () => {
    const values = {
      erTilbakekrevingVilkårOppfylt: true,
      grunnerTilReduksjon: true,
    };
    const apCode = '5084';

    const transformedValuesInfotrygd = transformValues({ ...values, videreBehandling: avregningCodes.TILBAKEKR_INFOTRYGD }, apCode)[0];
    expect(transformedValuesInfotrygd.kode).is.eql(apCode);
    expect(transformedValuesInfotrygd.grunnerTilReduksjon).is.eql(values.grunnerTilReduksjon);
    expect(transformedValuesInfotrygd.videreBehandling).is.eql(avregningCodes.TILBAKEKR_INFOTRYGD);
    const transformedValuesIgnorer = transformValues({ ...values, videreBehandling: avregningCodes.TILBAKEKR_IGNORER }, apCode)[0];
    expect(transformedValuesIgnorer.videreBehandling).is.eql(avregningCodes.TILBAKEKR_IGNORER);
  });
});
