import React, { FunctionComponent } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Undertittel, Element } from 'nav-frontend-typografi';

import { behandlingForm, FaktaBegrunnelseTextField, FaktaSubmitButton } from '@fpsak-frontend/fp-felles';
import { AksjonspunktBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';

import styles from './innhentDokOpptjeningUtlandPanel.less';

interface OwnProps {
  readOnly: boolean;
}

const InnhentDokOpptjeningUtlandPanel: FunctionComponent<OwnProps> = ({
  behandlingId,
  behandlingVersjon,
  readOnly,
  harApneAksjonspunkter,
  dirty,
  submittable,
  initialValues,
  form,
}) => (
  <>
    <Undertittel>
      <FormattedMessage id="InnhentDokOpptjeningUtlandPanel.OpptjeningUtland" />
    </Undertittel>
    <VerticalSpacer sixteenPx />
    <AksjonspunktBox className={styles.aksjonspunktMargin} erAksjonspunktApent={!harApneAksjonspunkter}>
      <Element>
        <FormattedMessage id="InnhentDokOpptjeningUtlandPanel.InnhentelseDok" />
      </Element>
      <VerticalSpacer sixteenPx />
      <RadioGroupField name="skalInnhenteDokumentasjon" validate={[required]} direction="vertical">
        <RadioOption label={<FormattedMessage id="InnhentDokOpptjeningUtlandPanel.Innhentes" />} value />
        <RadioOption label={<FormattedHTMLMessage id="InnhentDokOpptjeningUtlandPanel.InnhentesIkke" />} value={false} />
      </RadioGroupField>
      <FaktaBegrunnelseTextField
        isDirty={dirty}
        isSubmittable={submittable}
        isReadOnly={readOnly}
        hasBegrunnelse={!!initialValues.begrunnelse}
      />
      <FaktaSubmitButton
        formName={form}
        isSubmittable={submittable}
        isReadOnly={readOnly}
        hasOpenAksjonspunkter={harApneAksjonspunkter}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
      />
    </AksjonspunktBox>
  </>
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitHandler(transformValues(values));
  return (state, ownProps) => ({
    onSubmit,
    initialValues: {
      ...FaktaBegrunnelseTextField.buildInitialValues(ownProps.aksjonspunkt),
    },
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: 'InnhentDokOpptjeningUtlandPanel',
})(InnhentDokOpptjeningUtlandPanel));
