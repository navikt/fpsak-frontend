import React, { FunctionComponent } from 'react';
import {
  FormattedMessage, FormattedHTMLMessage, injectIntl, WrappedComponentProps,
} from 'react-intl';
import { connect } from 'react-redux';
import { Undertittel, Element } from 'nav-frontend-typografi';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaBegrunnelseTextField, FaktaSubmitButton } from '@fpsak-frontend/fakta-felles';
import { AksjonspunktBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { RadioGroupField, RadioOption, behandlingForm } from '@fpsak-frontend/form';

import styles from './innhentDokOpptjeningUtlandPanel.less';

const OpptjeningIUtlandDokStatus = {
  DOKUMENTASJON_VIL_BLI_INNHENTET: 'DOKUMENTASJON_VIL_BLI_INNHENTET',
  DOKUMENTASJON_VIL_IKKE_BLI_INNHENTET: 'DOKUMENTASJON_VIL_IKKE_BLI_INNHENTET',
};

interface OwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  readOnly: boolean;
  harApneAksjonspunkter: boolean;
  dirty: boolean;
  submittable: boolean;
  initialValues: { begrunnelse?: string };
  handleSubmit: () => void;
  form: string;
}

export const InnhentDokOpptjeningUtlandPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  behandlingId,
  behandlingVersjon,
  readOnly,
  harApneAksjonspunkter,
  dirty,
  submittable,
  initialValues,
  handleSubmit,
  form,
}) => (
  <form onSubmit={handleSubmit}>
    <Undertittel>
      <FormattedMessage id="InnhentDokOpptjeningUtlandPanel.OpptjeningUtland" />
    </Undertittel>
    {harApneAksjonspunkter && <VerticalSpacer sixteenPx />}
    <AksjonspunktBox className={styles.aksjonspunktMargin} erAksjonspunktApent={harApneAksjonspunkter}>
      <Element>
        <FormattedMessage id="InnhentDokOpptjeningUtlandPanel.InnhentelseDok" />
      </Element>
      <VerticalSpacer sixteenPx />
      <RadioGroupField name="dokStatus" validate={[required]} direction="vertical" readOnly={readOnly}>
        <RadioOption
          label={<FormattedMessage id="InnhentDokOpptjeningUtlandPanel.Innhentes" />}
          value={OpptjeningIUtlandDokStatus.DOKUMENTASJON_VIL_BLI_INNHENTET}
        />
        <RadioOption
          label={<FormattedHTMLMessage id="InnhentDokOpptjeningUtlandPanel.InnhentesIkke" />}
          value={OpptjeningIUtlandDokStatus.DOKUMENTASJON_VIL_IKKE_BLI_INNHENTET}
        />
      </RadioGroupField>
      <FaktaBegrunnelseTextField
        isDirty={dirty}
        isSubmittable={submittable}
        isReadOnly={readOnly}
        hasBegrunnelse={!!initialValues.begrunnelse}
        label={intl.formatMessage({ id: 'InnhentDokOpptjeningUtlandPanel.Begrunnelse' })}
      />
      <VerticalSpacer sixteenPx />
      <FaktaSubmitButton
        formName={form}
        isSubmittable={submittable}
        isReadOnly={readOnly}
        hasOpenAksjonspunkter={harApneAksjonspunkter}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
    </AksjonspunktBox>
  </form>
);

const transformValues = (values) => ({
  kode: aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK,
  ...values,
});

const mapStateToPropsFactory = (_initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback([transformValues(values)]);
  return (_state, ownProps) => ({
    onSubmit,
    initialValues: {
      dokStatus: ownProps.dokStatus,
      ...FaktaBegrunnelseTextField.buildInitialValues(ownProps.aksjonspunkt),
    },
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: 'InnhentDokOpptjeningUtlandPanel',
})(injectIntl(InnhentDokOpptjeningUtlandPanel)));
