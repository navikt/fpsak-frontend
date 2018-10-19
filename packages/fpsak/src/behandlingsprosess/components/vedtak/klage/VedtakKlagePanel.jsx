import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';

import ElementWrapper from 'sharedComponents/ElementWrapper';
import {
  getBehandlingKlageVurderingResultatNFP, getBehandlingKlageVurderingResultatNK,
  getBehandlingSprak, getBehandlingVilkar,
} from 'behandling/behandlingSelectors';
import { getLanguageCodeFromSprakkode } from 'utils/languageUtils';
import { required, hasValidText } from 'utils/validation/validators';
import { TextAreaField } from 'form/Fields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import {
  medholdIKlage, shouldGiveBegrunnelse, maxLength1500, minLength3,
} from '../VedtakHelper';

export const getMedholdArsak = (klageVurderingResultatNK, klageVurderingResultatNFP) => {
  if (medholdIKlage(klageVurderingResultatNK)) {
    return klageVurderingResultatNK.klageMedholdArsakNavn;
  } if (medholdIKlage(klageVurderingResultatNFP)) {
    return klageVurderingResultatNFP.klageMedholdArsakNavn;
  }
  return null;
};

const shouldShowBegrunnelseField = (
  klageVurderingResultatNK, klageVurderingResultatNFP, vilkar, behandlingStatus,
) => !medholdIKlage(klageVurderingResultatNFP) && shouldGiveBegrunnelse(klageVurderingResultatNK, klageVurderingResultatNFP, vilkar, behandlingStatus);


export const VedtakKlagePanelImpl = ({
  intl,
  klageVurderingResultatNK,
  klageVurderingResultatNFP,
  behandlingStatus,
  readOnly,
  sprakkode,
  vilkar,
}) => {
  const medholdArsak = getMedholdArsak(klageVurderingResultatNK, klageVurderingResultatNFP);
  return (
    <ElementWrapper>
      { medholdArsak
        && (
        <ElementWrapper>
          <Undertekst>{ intl.formatMessage({ id: 'VedtakKlageForm.ArsakTilMedhold' })}</Undertekst>
          <Normaltekst>{ medholdArsak }</Normaltekst>
          <VerticalSpacer sixteenPx />
        </ElementWrapper>
        )
      }
      <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.BegrunnelseForKlage' })}</Undertekst>
      <Normaltekst>
        {klageVurderingResultatNK ? klageVurderingResultatNK.begrunnelse : klageVurderingResultatNFP.begrunnelse}
      </Normaltekst>
      {shouldShowBegrunnelseField(klageVurderingResultatNK, klageVurderingResultatNFP, vilkar, behandlingStatus)
      && (
      <Row>
        <VerticalSpacer sixteenPx />
        <Column xs="7">
          <TextAreaField
            name="begrunnelse"
            label={intl.formatMessage({ id: 'VedtakKlageForm.Fritekst' })}
            validate={[required, minLength3, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={readOnly}
            badges={[{
              type: 'fokus',
              textId: getLanguageCodeFromSprakkode(sprakkode),
              title: 'Malform.Beskrivelse',
            }]}
          />
        </Column>
      </Row>
      )
      }
    </ElementWrapper>
  );
};

VedtakKlagePanelImpl.propTypes = {
  intl: intlShape.isRequired,
  sprakkode: PropTypes.shape().isRequired,
  klageVurderingResultatNFP: PropTypes.shape(),
  klageVurderingResultatNK: PropTypes.shape(),
  behandlingStatus: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

VedtakKlagePanelImpl.defaultProps = {
  klageVurderingResultatNFP: undefined,
  klageVurderingResultatNK: undefined,
};

const mapStateToProps = state => ({
  vilkar: getBehandlingVilkar(state),
  klageVurderingResultatNFP: getBehandlingKlageVurderingResultatNFP(state),
  klageVurderingResultatNK: getBehandlingKlageVurderingResultatNK(state),
  sprakkode: getBehandlingSprak(state),
});

export default connect(mapStateToProps)(injectIntl(VedtakKlagePanelImpl));
