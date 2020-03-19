import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Normaltekst } from 'nav-frontend-typografi';

import relatertYtelseTilstand from '@fpsak-frontend/kodeverk/src/relatertYtelseTilstand';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { DateLabel, VerticalSpacer, FaktaGruppe } from '@fpsak-frontend/shared-components';
import { behandlingFormValueSelector } from '@fpsak-frontend/form';

import styles from './rettighetFaktaPanel.less';

const getLopendeOrAvsluttetYtelser = (ytelse) => ytelse.tilgrensendeYtelserListe.filter((y) => y.status !== relatertYtelseTilstand.APEN);

/**
 * RettighetFaktaPanel
 */
const RettighetFaktaPanelImpl = ({
  farSokerType,
  ytelser,
  relatertYtelseTypes,
  alleMerknaderFraBeslutter,
}) => (
  <FaktaGruppe
    aksjonspunktCode={aksjonspunktCodes.OMSORGSOVERTAKELSE}
    titleCode="OmsorgOgForeldreansvarFaktaForm.Rettighet"
    merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.OMSORGSOVERTAKELSE]}
  >
    <Normaltekst>{farSokerType || '-'}</Normaltekst>
    <VerticalSpacer sixteenPx />
    <FaktaGruppe withoutBorder titleCode="OmsorgOgForeldreansvarFaktaForm.AndreYtelseTilMor">
      {ytelser.map((ytelse) => getLopendeOrAvsluttetYtelser(ytelse).map((y) => (
        <div className={styles.wrapper} key={`${relatertYtelseTypes[ytelse.relatertYtelseType]}-${y.periodeFraDato}`}>
          <Normaltekst className={styles.iverksatt}>
            <FormattedMessage
              id="OmsorgOgForeldreansvarFaktaForm.YtelseIverksatt"
              values={{ ytelseType: relatertYtelseTypes.find((r) => r.kode === ytelse.relatertYtelseType).navn }}
            />
            <DateLabel className={styles.dato} dateString={y.periodeFraDato} />
          </Normaltekst>
        </div>
      )))}
      {!ytelser.some((y) => getLopendeOrAvsluttetYtelser(y).length > 0) && '-'}
    </FaktaGruppe>
  </FaktaGruppe>
);

RettighetFaktaPanelImpl.propTypes = {
  farSokerType: PropTypes.string.isRequired,
  ytelser: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  relatertYtelseTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
};

const FORM_NAME = 'OmsorgOgForeldreansvarInfoPanel';

const mapStateToProps = (state, ownProps) => ({
  ...behandlingFormValueSelector(FORM_NAME, ownProps.behandlingId, ownProps.behandlingVersjon)(state, 'farSokerType', 'ytelser'),
});

const RettighetFaktaPanel = connect(mapStateToProps)(RettighetFaktaPanelImpl);

RettighetFaktaPanel.buildInitialValues = (soknad, innvilgetRelatertTilgrensendeYtelserForAnnenForelder, getKodeverknavn) => ({
  ytelser: innvilgetRelatertTilgrensendeYtelserForAnnenForelder,
  farSokerType: getKodeverknavn(soknad.farSokerType),
});

export default RettighetFaktaPanel;
