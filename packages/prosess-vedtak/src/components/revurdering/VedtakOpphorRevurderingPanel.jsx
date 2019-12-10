import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import { endringerIBeregningsgrunnlagGirFritekstfelt } from '../VedtakHelper';
import VedtakFritekstPanel from '../VedtakFritekstPanel';

export const VedtakOpphorRevurderingPanelImpl = ({
  intl,
  opphoersdato,
  revurderingsAarsakString,
  sprakKode,
  aksjonspunkter,
  readOnly,
  behandlingsresultat,
  ytelseTypeKode,
}) => (
  <div>
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Resultat' })}</Undertekst>
    <Normaltekst>
      {intl.formatMessage({
        id: ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER ? 'VedtakForm.RevurderingSVP.SvangerskapspengerOpphoerer'
          : 'VedtakForm.RevurderingFP.ForeldrepengerOpphoerer',
      }, { dato: moment(opphoersdato).format(DDMMYYYY_DATE_FORMAT) })}
    </Normaltekst>
    <VerticalSpacer sixteenPx />
    <Undertekst>{intl.formatMessage({ id: 'VedtakForm.RevurderingFP.Aarsak' })}</Undertekst>
    { revurderingsAarsakString !== undefined && (
      <Normaltekst>
        {revurderingsAarsakString}
      </Normaltekst>
    )}
    {endringerIBeregningsgrunnlagGirFritekstfelt(aksjonspunkter, ytelseTypeKode) && (
      <VedtakFritekstPanel
        readOnly={readOnly}
        sprakkode={sprakKode}
        behandlingsresultat={behandlingsresultat}
        labelTextCode="VedtakForm.Fritekst.Beregningsgrunnlag"
      />
    )}
  </div>
);

VedtakOpphorRevurderingPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  opphoersdato: PropTypes.string,
  revurderingsAarsakString: PropTypes.string,
  sprakKode: PropTypes.shape(),
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType),
  readOnly: PropTypes.bool.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
};

VedtakOpphorRevurderingPanelImpl.defaultProps = {
  opphoersdato: '',
  revurderingsAarsakString: undefined,
  sprakKode: undefined,
  aksjonspunkter: undefined,

};

const getOpphorsdato = createSelector(
  [(ownProps) => ownProps.resultatstruktur,
    (ownProps) => ownProps.medlemskapFom,
    (ownProps) => ownProps.behandlingsresultat],
  (resultatstruktur, medlemskapFom, behandlingsresultat) => {
    if (resultatstruktur && resultatstruktur.opphoersdato) {
      return resultatstruktur.opphoersdato;
    }
    if (medlemskapFom) {
      return medlemskapFom;
    }
    return behandlingsresultat.skjæringstidspunkt
      ? behandlingsresultat.skjæringstidspunkt.dato : '';
  },
);

const mapStateToProps = (state, ownProps) => ({
  opphoersdato: getOpphorsdato(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakOpphorRevurderingPanelImpl));
