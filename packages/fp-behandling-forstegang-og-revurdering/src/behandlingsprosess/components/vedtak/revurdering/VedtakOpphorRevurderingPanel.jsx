import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { getOpphoersdatoFraUttak, getBehandlingMedlem } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { endringerIBeregningsgrunnlagGirFritekstfelt } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vedtak/VedtakHelper';
import VedtakFritekstPanel from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vedtak/VedtakFritekstPanel';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

export const VedtakOpphorRevurderingPanelImpl = ({
  intl,
  opphoersdato,
  revurderingsAarsakString,
  sprakKode,
  aksjonspunkter,
  readOnly,
  behandlingsresultat,
  ytelseType,
}) => (
  <div>
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
    <Normaltekst>
      <FormattedMessage
        id={ytelseType === fagsakYtelseType.SVANGERSKAPSPENGER ? 'VedtakForm.RevurderingSVP.SvangerskapspengerOpphoerer'
        : 'VedtakForm.RevurderingFP.ForeldrepengerOpphoerer'}
        values={{ dato: moment(opphoersdato).format(DDMMYYYY_DATE_FORMAT) }}
      />
    </Normaltekst>
    <VerticalSpacer sixteenPx />
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.RevurderingFP.Aarsak' })}</Undertekst>
    { revurderingsAarsakString !== undefined
    && (
    <Normaltekst>
      {revurderingsAarsakString}
    </Normaltekst>
    )
    }
    {endringerIBeregningsgrunnlagGirFritekstfelt(aksjonspunkter, ytelseType)
    && (
    <VedtakFritekstPanel
      readOnly={readOnly}
      sprakkode={sprakKode}
      behandlingsresultat={behandlingsresultat}
      labelTextCode="VedtakForm.Fritekst.Beregningsgrunnlag"
    />
    )
    }
  </div>
);

VedtakOpphorRevurderingPanelImpl.propTypes = {
  intl: intlShape.isRequired,
  opphoersdato: PropTypes.string,
  revurderingsAarsakString: PropTypes.string,
  sprakKode: PropTypes.shape(),
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType),
  readOnly: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  ytelseType: PropTypes.string.isRequired,
};

VedtakOpphorRevurderingPanelImpl.defaultProps = {
  opphoersdato: '',
  revurderingsAarsakString: undefined,
  sprakKode: undefined,
  aksjonspunkter: undefined,

};

const getOpphorsdato = createSelector(
  [getOpphoersdatoFraUttak, getBehandlingMedlem, behandlingSelectors.getBehandlingsresultat],
  (datoFraUttak, medlemskap, behandlingsresultat) => {
    if (datoFraUttak) {
      return datoFraUttak;
    }
    if (medlemskap && medlemskap.fom) {
      return medlemskap.fom;
    }
    return behandlingsresultat.skjaeringstidspunktForeldrepenger
      ? behandlingsresultat.skjaeringstidspunktForeldrepenger : '';
  },
);

const mapStateToProps = state => ({
  opphoersdato: getOpphorsdato(state),
  sprakKode: behandlingSelectors.getBehandlingSprak(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
});

export default connect(mapStateToProps)(injectIntl(VedtakOpphorRevurderingPanelImpl));
