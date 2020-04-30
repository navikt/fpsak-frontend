import React from 'react';
import { expect } from 'chai';
import { Element } from 'nav-frontend-typografi';

import { Behandlingsresultat, BeregningsresultatEs } from '@fpsak-frontend/types';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import VedtakFritekstPanel from '../felles/VedtakFritekstPanel';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import shallowWithIntl from '../../../i18n/intl-enzyme-test-helper-prosess-vedtak';

const behandlingsresultat: Partial<Behandlingsresultat> = {
  type: {
    kode: 'INNVILGET',
    kodeverk: '',
  },
};

describe('<VedtakInnvilgetPanel>', () => {
  it('skal rendre innvilget panel for engangsstønad', () => {
    const wrapper = shallowWithIntl(<VedtakInnvilgetPanel.WrappedComponent
      intl={intlMock}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      ytelseTypeKode={fagsakYtelseType.ENGANGSSTONAD}
      readOnly
      skalBrukeOverstyrendeFritekstBrev
      beregningErManueltFastsatt={false}
      resultatstruktur={{
        beregnetTilkjentYtelse: 100,
        antallBarn: 1,
      } as BeregningsresultatEs}
    />);

    const elementFields = wrapper.find(Element);
    expect(elementFields).to.have.length(2);
    expect(elementFields.first().childAt(0).text()).to.eql('100 kr');
    expect(elementFields.last().childAt(0).text()).to.eql('1');
  });

  it('skal rendre fritekstpanel for foreldrepenger', () => {
    const wrapper = shallowWithIntl(<VedtakInnvilgetPanel.WrappedComponent
      intl={intlMock}
      behandlingsresultat={behandlingsresultat as Behandlingsresultat}
      ytelseTypeKode={fagsakYtelseType.FORELDREPENGER}
      readOnly
      skalBrukeOverstyrendeFritekstBrev={false}
      beregningErManueltFastsatt
    />);

    expect(wrapper.find(VedtakFritekstPanel)).to.have.length(1);
  });
});
