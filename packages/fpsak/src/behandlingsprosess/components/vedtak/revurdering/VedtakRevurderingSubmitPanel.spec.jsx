import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallowWithIntl, intlMock } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/assets/testHelpers/redux-form-test-helper';
import { FormattedMessage } from 'react-intl';
import vedtaksbrevStatus from '@fpsak-frontend/kodeverk/vedtakbrevStatus';
import { VedtakRevurderingSubmitPanelImpl as UnwrappedForm, getSubmitKnappTekst } from './VedtakRevurderingSubmitPanel';

const forhandsvisVedtaksbrevFunc = sinon.spy();

const beregningResultatInnvilget = {
  antallBarn: 1,
  beregnetTilkjentYtelse: 63140,
  satsVerdi: 63140,
};
const beregningResultatAvslatt = undefined;

describe('<VedtakRevurderingSubmitPanel>', () => {
  it('skal kunne forhåndsvise brev ved engangsstonad dersom det ikke er endring men er sendt varsel om revurdering', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      formProps={reduxFormPropsMock}
      intl={intlMock}
      beregningResultat={beregningResultatInnvilget}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      begrunnelse=""
      haveSentVarsel
      originaltBeregningResultat={beregningResultatInnvilget}
      brevStatus={undefined}
      readOnly={false}
      ytelseType="ES"
      submitKnappTextId="VedtakForm.TilGodkjenning"
    />);
    const formattedMessages = wrapper.find(FormattedMessage);
    expect(formattedMessages.prop('id')).is.eql('VedtakForm.ForhandvisBrev');
  });

  it('skal ikke forhåndsvise brev ved engangsstonad dersom det ikke er endring og ikke er sendt varsel om revurdering', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      formProps={reduxFormPropsMock}
      intl={intlMock}
      beregningResultat={beregningResultatInnvilget}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      begrunnelse=""
      haveSentVarsel={false}
      originaltBeregningResultat={beregningResultatInnvilget}
      brevStatus={undefined}
      readOnly={false}
      ytelseType="ES"
      submitKnappTextId="VedtakForm.TilGodkjenning"
    />);
    expect(wrapper.find(FormattedMessage)).to.have.length(0);
  });

  it('skal forhåndsvise brev ved engangsstonad dersom det er endring', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      formProps={reduxFormPropsMock}
      intl={intlMock}
      beregningResultat={beregningResultatInnvilget}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      begrunnelse=""
      haveSentVarsel={false}
      originaltBeregningResultat={beregningResultatAvslatt}
      brevStatus={undefined}
      readOnly={false}
      ytelseType="ES"
      submitKnappTextId="VedtakForm.TilGodkjenning"
    />);
    const formattedMessages = wrapper.find(FormattedMessage);
    expect(formattedMessages.prop('id')).is.eql('VedtakForm.ForhandvisBrev');
  });

  it('skal forhåndsvise brev ved foreldrepenger', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      formProps={reduxFormPropsMock}
      intl={intlMock}
      beregningResultat={beregningResultatInnvilget}
      previewVedtakCallback={forhandsvisVedtaksbrevFunc}
      begrunnelse=""
      haveSentVarsel={false}
      originaltBeregningResultat={beregningResultatAvslatt}
      brevStatus={{ kode: vedtaksbrevStatus.AUTOMATISK }}
      readOnly={false}
      ytelseType="FP"
      submitKnappTextId="VedtakForm.TilGodkjenning"
    />);
    const formattedMessages = wrapper.find(FormattedMessage);
    expect(formattedMessages.prop('id')).is.eql('VedtakForm.ForhandvisBrev');
  });

  it('knapp skal vise til godkjenning tekst når det finnes aktive aksjonspunkter som skal til totrinn', () => {
    const aksjonspunkter = [{ kode: '5058', erAktivt: true, toTrinnsBehandling: false }, { kode: '5027', erAktivt: true, toTrinnsBehandling: true }];
    const tekstId = getSubmitKnappTekst.resultFunc(aksjonspunkter);
    expect(tekstId).to.equal('VedtakForm.TilGodkjenning');
  });

  it('knapp skal vise fatt vedtak tekst når det finnes inaktive aksjonspunkter som skal til totrinn', () => {
    const aksjonspunkter = [{ kode: '5058', erAktivt: true, toTrinnsBehandling: false }, { kode: '5027', erAktivt: false, toTrinnsBehandling: true }];
    const tekstId = getSubmitKnappTekst.resultFunc(aksjonspunkter);
    expect(tekstId).to.equal('VedtakForm.FattVedtak');
  });

  it('knapp skal vise fatt vedtak tekst når det ikkje finnes aksjonspunkter som skal til totrinn', () => {
    const aksjonspunkter = [{ kode: '5058', erAktivt: true, toTrinnsBehandling: false }, { kode: '5027', erAktivt: true, toTrinnsBehandling: false }];
    const tekstId = getSubmitKnappTekst.resultFunc(aksjonspunkter);
    expect(tekstId).to.equal('VedtakForm.FattVedtak');
  });
});
