import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { TextAreaField } from '@fpsak-frontend/form';
import {
  minLength, maxLength, requiredIfNotPristine, hasValidText, decodeHtmlEntity, getLanguageCodeFromSprakkode,
} from '@fpsak-frontend/utils';
import { VerticalSpacer, ElementWrapper } from '@fpsak-frontend/shared-components';
import { hasIkkeOppfyltSoknadsfristvilkar } from './VedtakHelper';

import styles from './vedtakAvslagPanel.less';

const maxLength1500 = (0, maxLength)(1500);
const minLength3 = (0, minLength)(3);

export const getAvslagArsak = (vilkar, aksjonspunkter, behandlingsresultat) => {
  const avslatteVilkar = vilkar.filter(v => v.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT);
  if (avslatteVilkar.length === 0) {
    return <FormattedMessage id="VedtakForm.UttaksperioderIkkeGyldig" />;
  }

  return `${avslatteVilkar[0].vilkarType.navn}: ${behandlingsresultat.avslagsarsak.navn}`;
};


const VedtakAvslagArsakOgBegrunnelsePanel = ({
  intl,
  behandlingStatusKode,
  vilkar,
  aksjonspunkter,
  behandlingsresultat,
  sprakkode,
  readOnly,
}) => (
  <ElementWrapper>
    { getAvslagArsak(vilkar, aksjonspunkter, behandlingsresultat)
    && (
    <div>
      <Undertekst>{intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}</Undertekst>
      <Normaltekst>
        {getAvslagArsak(vilkar, aksjonspunkter, behandlingsresultat)}
      </Normaltekst>
      <VerticalSpacer sixteenPx />
    </div>
    )
    }
    {behandlingStatusKode === behandlingStatus.BEHANDLING_UTREDES && hasIkkeOppfyltSoknadsfristvilkar(vilkar)
      && (
      <Row>
        <VerticalSpacer sixteenPx />
        <Column xs="7">
          <TextAreaField
            name="begrunnelse"
            label={intl.formatMessage({ id: 'VedtakForm.Fritekst' })}
            validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
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
    {readOnly && behandlingsresultat.avslagsarsakFritekst !== null
    && (
    <span>
      <VerticalSpacer twentyPx />
      <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Fritekst' })}</Undertekst>
      <VerticalSpacer eightPx />
      <div className={styles.fritekstItem}>{decodeHtmlEntity(behandlingsresultat.avslagsarsakFritekst)}</div>
    </span>
    )
    }
  </ElementWrapper>
);

VedtakAvslagArsakOgBegrunnelsePanel.propTypes = {
  intl: intlShape.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
};

export default VedtakAvslagArsakOgBegrunnelsePanel;
