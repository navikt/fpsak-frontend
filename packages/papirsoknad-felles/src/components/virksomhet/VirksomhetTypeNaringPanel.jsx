import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';

import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { CheckboxField } from '@fpsak-frontend/form';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import naringsvirksomhetType from '@fpsak-frontend/kodeverk/src/naringsvirksomhetType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

const naringsvirksomhetTypeOrder = {
  [naringsvirksomhetType.DAGMAMMA]: 1,
  [naringsvirksomhetType.FISKE]: 2,
  [naringsvirksomhetType.JORDBRUK_ELLER_SKOGBRUK]: 3,
  [naringsvirksomhetType.ANNEN]: 4,
};

/**
 * VirksomhetTypeNaringPanel
 *
 * Presentasjonskomponent. Komponenten vises som del av skjermbildet for registrering av
 * papirsøknad dersom søknad gjelder foreldrepenger og saksbehandler skal legge til ny virksomhet for
 * søker.
 */
export const VirksomhetTypeNaringPanel = ({
  readOnly,
  naringvirksomhetTyper,
}) => (
  <ElementWrapper>
    <Undertekst><FormattedMessage id="Registrering.VirksomhetNaeringTypePanel.Title" /></Undertekst>
    <VerticalSpacer fourPx />
    {naringvirksomhetTyper.sort((a, b) => naringsvirksomhetTypeOrder[a.kode] > naringsvirksomhetTypeOrder[b.kode])
      .map((nv) => <CheckboxField name={nv.kode} key={nv.kode} label={nv.navn} readOnly={readOnly} />)}
  </ElementWrapper>
);

const getFilteredNaringsvirksomhetTypes = createSelector(
  [(ownProps) => ownProps.alleKodeverk[kodeverkTyper.VIRKSOMHET_TYPE]], (types = []) => types.filter((t) => t.kode !== naringsvirksomhetType.FRILANSER),
);

const mapStateToProps = (state, ownProps) => ({
  naringvirksomhetTyper: getFilteredNaringsvirksomhetTypes(ownProps),
});

VirksomhetTypeNaringPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  naringvirksomhetTyper: kodeverkPropType.isRequired,
};

export default connect(mapStateToProps)(VirksomhetTypeNaringPanel);
