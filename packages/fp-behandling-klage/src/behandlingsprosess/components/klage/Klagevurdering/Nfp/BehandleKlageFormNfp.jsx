import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Row, Column } from 'nav-frontend-grid';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';

import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingKlage/src/behandlingsprosess/behandlingsprosessKlageSelectors';
import { getBehandlingKlageVurderingResultatNFP, getBehandlingSprak, isKlageBehandlingInKA } from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandlingKlage/src/behandlingForm';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';

import { Undertittel } from 'nav-frontend-typografi';

import { VerticalSpacer, AksjonspunktHelpText, FadingPanel } from '@fpsak-frontend/shared-components';
import { BehandlingspunktBegrunnelseTextField } from '@fpsak-frontend/fp-behandling-felles';
import BehandlingspunktSubmitButton from 'behandlingKlage/src/behandlingsprosess/components/BehandlingspunktSubmitButton';
import KlageVurderingRadioOptionsNfp from './KlageVurderingRadioOptionsNfp';
import FritekstBrevTextField from '../SharedUtills/FritekstKlageBrevTextField';
import PreviewKlageLink from '../SharedUtills/PreviewKlageLink';
import styles from '../SharedUtills/behandleKlageForm.less';
import TempsaveKlageButton from '../SharedUtills/TempsaveKlageButton';


/**
 * BehandleklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (NFP).
 */
export const BehandleKlageFormNfpImpl = ({
  readOnly,
  handleSubmit,
  previewCallback,
  saveKlage,
  readOnlySubmitButton,
  aksjonspunktCode,
  sprakkode,
  formValues,
  intl,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FadingPanel>
      <Undertittel>{intl.formatMessage({ id: 'Klage.ResolveKlage.Title' })}</Undertittel>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Klage.ResolveKlage.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpText>
      <VerticalSpacer sixteenPx />
      <KlageVurderingRadioOptionsNfp
        readOnly={readOnly}
        klageVurdering={formValues.klageVurdering}
        aksjonspunktCode={aksjonspunktCode}
        intl={intl}
      />
      <div className={styles.confirmVilkarForm}>
        <BehandlingspunktBegrunnelseTextField
          readOnly={readOnly}
          textCode="VedtakKlageForm.BegrunnelseForKlage"
        />
        <VerticalSpacer sixteenPx />
        <FritekstBrevTextField
          sprakkode={sprakkode}
          readOnly={readOnly}
          intl={intl}
        />
        <Row>
          <Column xs="8">
            <BehandlingspunktSubmitButton formName={formProps.form} isReadOnly={readOnly} isSubmittable={!readOnlySubmitButton} />
            {!readOnly && formValues.klageVurdering && formValues.fritekstTilBrev && (formValues.fritekstTilBrev.length > 2)
              && (
                <PreviewKlageLink
                  previewCallback={previewCallback}
                  fritekstTilBrev={formValues.fritekstTilBrev}
                  klageVurdering={formValues.klageVurdering}
                  aksjonspunktCode={aksjonspunktCode}
                />
              )
              }
          </Column>
          <Column xs="2">
            <TempsaveKlageButton
              formValues={formValues}
              saveKlage={saveKlage}
              readOnly={readOnly}
            />
          </Column>
        </Row>
      </div>
    </FadingPanel>
  </form>
);

BehandleKlageFormNfpImpl.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  saveKlage: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape(),
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  ...formPropTypes,
};

BehandleKlageFormNfpImpl.defaultProps = {
  formValues: {},
  readOnly: true,
  readOnlySubmitButton: true,
};

export const buildInitialValues = createSelector([getBehandlingKlageVurderingResultatNFP], klageVurderingResultat => ({
  klageMedholdArsak: klageVurderingResultat ? klageVurderingResultat.klageMedholdArsak : null,
  klageVurderingOmgjoer: klageVurderingResultat ? klageVurderingResultat.klageVurderingOmgjoer : null,
  klageVurdering: klageVurderingResultat ? klageVurderingResultat.klageVurdering : null,
  begrunnelse: klageVurderingResultat ? klageVurderingResultat.begrunnelse : null,
  fritekstTilBrev: klageVurderingResultat ? klageVurderingResultat.fritekstTilBrev : null,
}));


export const transformValues = (values, aksjonspunktCode) => ({
  klageMedholdArsak: (values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE
    || values.klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK) ? values.klageMedholdArsak : null,
  klageVurderingOmgjoer: values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ? values.klageVurderingOmgjoer : null,
  klageVurdering: values.klageVurdering,
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
});

const formName = 'BehandleKlageNfpForm';

const mapStateToProps = (state, ownProps) => {
  const aksjonspunktCode = getSelectedBehandlingspunktAksjonspunkter(state)[0].definisjon.kode;
  return {
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    formValues: behandlingFormValueSelector(formName)(state, 'klageVurdering', 'begrunnelse', 'fritekstTilBrev', 'klageMedholdArsak', 'klageVurderingOmgjoer'),
    onSubmit: values => ownProps.submitCallback([transformValues(values, aksjonspunktCode)]),
    readOnly: isKlageBehandlingInKA(state) || ownProps.readOnly,
    sprakkode: getBehandlingSprak(state),
  };
};

const BehandleKlageFormNfp = connect(mapStateToProps)(behandlingForm({
  form: formName,
})(BehandleKlageFormNfpImpl));

BehandleKlageFormNfp.supports = apCodes => apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NFP);


export default connect(mapStateToProps)(injectIntl(BehandleKlageFormNfp));
