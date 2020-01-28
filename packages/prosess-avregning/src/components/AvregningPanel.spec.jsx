import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { FormattedMessage } from 'react-intl';
import sinon from 'sinon';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';

import { Undertittel } from 'nav-frontend-typografi';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { Column, Row } from 'nav-frontend-grid';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import AvregningSummary from './AvregningSummary';
import AvregningTable from './AvregningTable';
import { AvregningPanelImpl, transformValues } from './AvregningPanel';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-avregning';

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
  intl: intlMock,
  apCodes: [],
  readOnly: false,
  erTilbakekrevingVilkårOppfylt: false,
  grunnerTilReduksjon: false,
  previewCallback: sinon.spy(),
  hasOpenTilbakekrevingsbehandling: false,
};

describe('<AvregningPanelImpl>', () => {
  it('skal rendre AvregningPanel', () => {
    const wrapper = shallowWithIntl(<AvregningPanelImpl
      {...mockProps}
    />);

    const formattedMessage = wrapper.find(FormattedMessage);
    expect(formattedMessage).to.have.length(2);
    expect(formattedMessage.first().prop('id')).is.eql('Avregning.Title');
    const undertittel = wrapper.find(Undertittel);
    expect(undertittel).has.length(1);
    const avregningSummary = wrapper.find(AvregningSummary);
    expect(avregningSummary).has.length(1);
    const avregningTable = wrapper.find(AvregningTable);
    expect(avregningTable).has.length(1);
    const row = wrapper.find(Row);
    expect(row).has.length(1);
    const column = wrapper.find(Column);
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
    const radioGroupField = wrapper.find(RadioGroupField);
    expect(radioGroupField).has.length(1);
    expect(radioGroupField.at(0).prop('name')).is.eql('videreBehandling');
    const radioOption = wrapper.find(RadioOption);
    expect(radioOption).has.length(2);
    const radioOptionGjennomfør = radioOption.at(0);
    expect(radioOptionGjennomfør.prop('label')).is.eql(<FormattedMessage id="Avregning.Opprett" />);
    const radioOptionAvvent = radioOption.at(1);
    expect(radioOptionAvvent.prop('label')).is.eql(<FormattedMessage id="Avregning.avvent" />);
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

  it('skal vise tekst for åpen tilbakekrevingsbehandling', () => {
    const props = {
      ...mockProps,
      apCodes: ['5084'],
      erTilbakekrevingVilkårOppfylt: undefined,
      hasOpenTilbakekrevingsbehandling: true,
    };
    const wrapper = shallow(<AvregningPanelImpl
      {...props}
    />);

    expect(wrapper.find('[id="Avregning.ApenTilbakekrevingsbehandling"]')).has.length(1);
  });

  it('skal ikke vise tekst for åpen tilbakekrevingsbehandling', () => {
    const props = {
      ...mockProps,
      apCodes: ['5084'],
      erTilbakekrevingVilkårOppfylt: undefined,
      hasOpenTilbakekrevingsbehandling: false,
    };
    const wrapper = shallow(<AvregningPanelImpl
      {...props}
    />);

    expect(wrapper.find('[id="Avregning.ApenTilbakekrevingsbehandling"]')).has.length(0);
  });

  it('transform values skal returnere inntrekk som videre behandling gitt at vilkår er oppfylt og grunnerTilReduksjon er false', () => {
    const values = {
      erTilbakekrevingVilkårOppfylt: true,
      grunnerTilReduksjon: false,
      videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_INFOTRYGD,
    };
    const apCode = '5084';

    const transformedValues = transformValues(values, apCode);
    expect(transformedValues.kode).is.eql(apCode);
    expect(transformedValues.videreBehandling).is.eql(tilbakekrevingVidereBehandling.TILBAKEKR_INFOTRYGD);
  });

  it('transform values skal returnere verdi av videre behandling gitt at vilkår er oppfylt og grunnerTilReduksjon er true', () => {
    const values = {
      erTilbakekrevingVilkårOppfylt: true,
      grunnerTilReduksjon: true,
    };
    const apCode = '5084';

    const transformedValuesInfotrygd = transformValues({ ...values, videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_INFOTRYGD }, apCode);
    expect(transformedValuesInfotrygd.kode).is.eql(apCode);
    expect(transformedValuesInfotrygd.videreBehandling).is.eql(tilbakekrevingVidereBehandling.TILBAKEKR_INFOTRYGD);
    const transformedValuesIgnorer = transformValues({ ...values, videreBehandling: tilbakekrevingVidereBehandling.TILBAKEKR_IGNORER }, apCode);
    expect(transformedValuesIgnorer.videreBehandling).is.eql(tilbakekrevingVidereBehandling.TILBAKEKR_IGNORER);
  });
});
