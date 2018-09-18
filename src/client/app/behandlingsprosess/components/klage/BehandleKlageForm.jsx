import React from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import classNames from 'classnames';

import FadingPanel from 'sharedComponents/FadingPanel';
import klageVurderingType from 'kodeverk/klageVurdering';
import { RadioGroupField, RadioOption } from 'form/Fields';
import SelectField from 'form/fields/SelectField';
import DatepickerField from 'form/fields/DatepickerField';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { required, hasValidDate } from 'utils/validation/validators';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import BehandlingspunktBegrunnelseTextField from 'behandlingsprosess/components/BehandlingspunktBegrunnelseTextField';
import BehandlingspunktSubmitButton from 'behandlingsprosess/components/BehandlingspunktSubmitButton';

import styles from './behandleKlageForm.less';

/**
 * Behandleklageform
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (NFP og NK).
 */
const shouldSendBrev = (aksjonspunktKode, klageVurdering) => aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP
  && klageVurdering === klageVurderingType.STADFESTE_YTELSESVEDTAK;

const getClassForAvvisKlage = (readOnly, aksjonspunktKode) => {
  if (readOnly) {
    return styles.selectReadOnly;
  }
  return classNames(
    styles.arrowLine,
    aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ? styles.selectNkAvvis : styles.selectAvvis,
  );
};

const getClassForMedholdKlage = (readOnly, aksjonspunktKode) => {
  if (readOnly) {
    return styles.selectReadOnly;
  }
  return classNames(
    styles.arrowLine,
    aksjonspunktKode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ? styles.selectNkOmgjort : styles.selectOmgjort,
  );
};

export const BehandleKlageForm = ({
  readOnly,
  readOnlySubmitButton,
  aksjonspunktCode,
  klageMedholdArsaker,
  klageAvvistArsaker,
  klageVurdering,
  begrunnelse,
  previewCallback,
  intl,
  formProps,
}) => {
  const avvistOptions = klageAvvistArsaker.map(ao => <option key={ao.kode} value={ao.kode}>{ao.navn}</option>);
  const medholdOptions = klageMedholdArsaker.map(mo => <option key={mo.kode} value={mo.kode}>{mo.navn}</option>);
  const keepVedtakTextId = aksjonspunktCode === aksjonspunktCodes.BEHANDLE_KLAGE_NK ? 'Klage.ResolveKlage.KeepVedtakNk' : 'Klage.ResolveKlage.KeepVedtakNfp';
  const previewMessage = (e) => {
    previewCallback('', 'KLAGOV', begrunnelse || ' ');
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
      <RadioGroupField name="klageVurdering" validate={[required]} readOnly={readOnly} className={styles.noWrap}>
        {aksjonspunktCode === aksjonspunktCodes.BEHANDLE_KLAGE_NK
        && <RadioOption value={klageVurderingType.OPPHEVE_YTELSESVEDTAK} label={{ id: 'Klage.ResolveKlage.NullifyVedtak' }} />
        }
        <RadioOption value={klageVurderingType.STADFESTE_YTELSESVEDTAK} label={{ id: keepVedtakTextId }} />
        <RadioOption value={klageVurderingType.MEDHOLD_I_KLAGE} label={{ id: 'Klage.ResolveKlage.ChangeVedtak' }} />
        <RadioOption value={klageVurderingType.AVVIS_KLAGE} label={{ id: 'Klage.ResolveKlage.RejectKlage' }} />
      </RadioGroupField>
      {klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE
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
      </div>
      )
      }
      {klageVurdering === klageVurderingType.AVVIS_KLAGE
      && (
      <div className={getClassForAvvisKlage(readOnly, aksjonspunktCode)}>
        <SelectField
          readOnly={readOnly}
          name="klageAvvistArsak"
          selectValues={avvistOptions}
          label={intl.formatMessage({ id: 'Klage.ResolveKlage.Cause' })}
          validate={[required]}
          bredde="xl"
        />
      </div>
      )
      }
      <div>
        <DatepickerField
          name="vedtaksdatoPaklagdBehandling"
          label={{ id: 'Klage.ResolveKlage.VedtaksdatoPaklagdBehandling' }}
          validate={[required, hasValidDate]}
          readOnly={readOnly}
        />
      </div>
      <div className={styles.confirmVilkarForm}>
        <BehandlingspunktBegrunnelseTextField
          readOnly={readOnly}
          textCode={shouldSendBrev(aksjonspunktCode, klageVurdering) ? 'Klage.ResolveKlage.ExplanationRequiredBrev' : undefined}
        />
        <BehandlingspunktSubmitButton formName={formProps.form} isReadOnly={readOnly} isSubmittable={!readOnlySubmitButton} />
        {!readOnly && shouldSendBrev(aksjonspunktCode, klageVurdering)
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

BehandleKlageForm.propTypes = {
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  intl: intlShape.isRequired,
  klageVurdering: PropTypes.string,
  begrunnelse: PropTypes.string,
  klageAvvistArsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
  klageMedholdArsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    navn: PropTypes.string,
  })),
  formProps: PropTypes.shape().isRequired,
  previewCallback: PropTypes.func.isRequired,
  aksjonspunktCode: PropTypes.string.isRequired,
};

BehandleKlageForm.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
  klageVurdering: null,
  begrunnelse: null,
  klageMedholdArsaker: null,
  klageAvvistArsaker: null,
};

export default injectIntl(BehandleKlageForm);
