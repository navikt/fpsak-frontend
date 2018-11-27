import React from 'react';
import PropTypes from 'prop-types';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';

import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import { findInnvilgetResultatText } from '../VedtakHelper';

export const VedtakInnvilgetKlagePanelImpl = ({
  intl,
  behandlingsresultatTypeKode,
  ytelseType,
}) => (
  <ElementWrapper>
    <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.Resultat' })}</Undertekst>
    <Normaltekst>
      {intl.formatMessage({ id: findInnvilgetResultatText(behandlingsresultatTypeKode, ytelseType) })}
    </Normaltekst>
    <VerticalSpacer eightPx />
  </ElementWrapper>
);

VedtakInnvilgetKlagePanelImpl.propTypes = {
  intl: intlShape.isRequired,
  behandlingsresultatTypeKode: PropTypes.string.isRequired,
  ytelseType: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  ytelseType: getFagsakYtelseType(state).kode,
});

export default connect(mapStateToProps)(injectIntl(VedtakInnvilgetKlagePanelImpl));
