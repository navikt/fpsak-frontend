import React from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import classNames from 'classnames';
import { Row, Column } from 'nav-frontend-grid';
import { getLanguageCodeFromSprakkode } from 'utils/languageUtils';

import FadingPanel from 'sharedComponents/FadingPanel';
import klageVurderingType from 'kodeverk/klageVurdering';
import klageVurderingOmgjoerType from 'kodeverk/klageVurderingOmgjoer';
import {
  RadioGroupField, RadioOption, SelectField, TextAreaField,
} from 'form/Fields';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { required, hasValidText } from 'utils/validation/validators';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';
import BehandlingspunktSubmitButton from 'behandlingsprosess/components/BehandlingspunktSubmitButton';

import connect from 'react-redux/es/connect/connect';
import { getBehandlingSprak } from 'behandling/behandlingSelectors';
import styles from './behandleKlageForm.less';
import { maxLength1500, minLength3 } from '../vedtak/VedtakHelper';

/**
 * Behandleklageform
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (NFP og NK).
 */
const getClassForMedholdKlage = (readOnly, aksjonspunktKode) => {
  if (readOnly) {
    return styles.selectReadOnly;
  }
  return classNames(
    styles.arrowLine,
    aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ? styles.selectNkOmgjort : styles.selectOmgjort,
  );
};
const getClassForOpphevKlage = (readOnly, aksjonspunktKode) => {
  if (readOnly) {
    return styles.selectReadOnly;
  }
  return classNames(
    styles.arrowLine,
    aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ? styles.selectNkOpphoert : styles.selectOpphoert,
  );
};

export const BehandleKlageFormNy = ({
  readOnly,
  readOnlySubmitButton,
  aksjonspunktCode,
  klageMedholdArsaker,
  klageVurdering,
  fritekstTilBrev,
  previewCallback,
  intl,
  formProps,
  sprakkode,
}) => {
  const medholdOptions = klageMedholdArsaker.map(mo => <option key={mo.kode} value={mo.kode}>{mo.navn}</option>);
  const keepVedtakTextId = aksjonspunktCode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ? 'Klage.ResolveKlage.KeepVedtakNk' : 'Klage.ResolveKlage.KeepVedtakNfp';
  const previewMessage = (e) => {
    previewCallback('', 'KLAGOV', fritekstTilBrev || ' ');
    e.preventDefault();
  };

  return (
    <FadingPanel>
      <Undertittel>{intl.formatMessage({ id: 'Klage.ResolveKlage.Title' })}</Undertittel>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Klage.ResolveKlage.HelpText" key={aksjonspunktCode} />]}
      </AksjonspunktHelpText>
      <VerticalSpacer sixteenPx />
      {aksjonspunktCode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP
      && (
      <div>
        <RadioGroupField name="klageVurdering" validate={[required]} readOnly={readOnly} className={styles.noWrap}>
          <RadioOption value={klageVurderingType.MEDHOLD_I_KLAGE} label={{ id: 'Klage.ResolveKlage.ChangeVedtak' }} />
          <RadioOption value={klageVurderingType.STADFESTE_YTELSESVEDTAK} label={{ id: keepVedtakTextId }} />
        </RadioGroupField>
      </div>
      )
      }
      {aksjonspunktCode === aksjonspunktCodes.BEHANDLE_KLAGE_NK
      && (
        <div>
          <BehandlingspunktBegrunnelseTextField
            readOnly={readOnly}
            textCode="VedtakKlageForm.VurderingForKlage"
          />
          <VerticalSpacer sixteenPx />
          <Row>
            <Column xs="4">
              <RadioGroupField
                name="klageVurdering"
                validate={[required]}
                readOnly={readOnly}
                className={styles.noWrap}
                direction="vertical"
              >
                <RadioOption value={klageVurderingType.STADFESTE_YTELSESVEDTAK} label={{ id: keepVedtakTextId }} />
                <RadioOption value={klageVurderingType.MEDHOLD_I_KLAGE} label={{ id: 'Klage.ResolveKlage.ChangeVedtak' }} />
              </RadioGroupField>
            </Column>
            <Column xs="4">
              <RadioGroupField
                name="klageVurdering"
                validate={[required]}
                readOnly={readOnly}
                className={styles.noWrap}
                direction="vertical"
              >
                <RadioOption value={klageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE} label={{ id: 'Klage.Behandle.Hjemsendt' }} />
                <RadioOption value={klageVurderingType.OPPHEVE_YTELSESVEDTAK} label={{ id: 'Klage.ResolveKlage.NullifyVedtak' }} />
              </RadioGroupField>
            </Column>
          </Row>
        </div>
      )
      }
      {(klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE)
      && (
      <div className={getClassForMedholdKlage(readOnly, aksjonspunktCode)}>
        <SelectField
          readOnly={readOnly}
          name="klageMedholdArsak"
          selectValues={medholdOptions}
          label={intl.formatMessage({ id: 'Klage.ResolveKlage.Cause' })}
          validate={[required]}
          bredde="xl"
        />
        <VerticalSpacer sixPx />
        <RadioGroupField name="klageVurderingOmgjoer" validate={[required]} readOnly={readOnly} className={styles.noWrap} direction="vertical">
          <RadioOption value={klageVurderingOmgjoerType.GUNST_MEDHOLD_I_KLAGE} label={{ id: 'Klage.Behandle.Omgjort' }} />
          <RadioOption value={klageVurderingOmgjoerType.UGUNST_MEDHOLD_I_KLAGE} label={{ id: 'Klage.Behandle.Ugunst' }} />
          <RadioOption value={klageVurderingOmgjoerType.DELVIS_MEDHOLD_I_KLAGE} label={{ id: 'Klage.Behandle.DelvisOmgjort' }} />
        </RadioGroupField>
      </div>
      )
      }
      {(klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK)
      && (
        <div className={getClassForOpphevKlage(readOnly, aksjonspunktCode)}>
          <SelectField
            readOnly={readOnly}
            name="klageMedholdArsak"
            selectValues={medholdOptions}
            label={intl.formatMessage({ id: 'Klage.ResolveKlage.Cause' })}
            validate={[required]}
            bredde="xl"
          />
        </div>
      )
      }
      <div className={styles.confirmVilkarForm}>
        {aksjonspunktCode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP
        && (
          <BehandlingspunktBegrunnelseTextField
            readOnly={readOnly}
            textCode="VedtakKlageForm.BegrunnelseForKlage"
          />
        )
        }
        <Row>
          <VerticalSpacer sixteenPx />
          <Column xs="10">
            <TextAreaField
              name="fritekstTilBrev"
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
        <BehandlingspunktSubmitButton formName={formProps.form} isReadOnly={readOnly} isSubmittable={!readOnlySubmitButton} />
        {!readOnly
        && (
        <a
          href=""
          onClick={(e) => { previewMessage(e); }}
          onKeyDown={e => (e.keyCode === 13 ? previewMessage(e) : null)}
          className={classNames(styles.previewLink, 'lenke lenke--frittstaende')}
        >
          <FormattedMessage id="VedtakForm.ForhandvisBrev" />
        </a>
        )
        }
      </div>
    </FadingPanel>
  );
};

BehandleKlageFormNy.propTypes = {
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  intl: intlShape.isRequired,
  klageVurdering: PropTypes.string,
  fritekstTilBrev: PropTypes.string,
  klageMedholdArsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
  formProps: PropTypes.shape().isRequired,
  previewCallback: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
  sprakkode: PropTypes.shape().isRequired,
};

BehandleKlageFormNy.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
  klageVurdering: null,
  fritekstTilBrev: null,
  klageMedholdArsaker: [],
};

const mapStateToProps = state => ({
  sprakkode: getBehandlingSprak(state),
});

export default connect(mapStateToProps)(injectIntl(BehandleKlageFormNy));
