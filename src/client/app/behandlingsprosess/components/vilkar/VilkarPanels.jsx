import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ElementWrapper from 'sharedComponents/ElementWrapper';
import { getBehandlingVilkarCodes } from 'behandling/behandlingSelectors';
import ErOmsorgVilkaarOppfyltForm from './omsorg/ErOmsorgVilkaarOppfyltForm';
import ErSoknadsfristVilkaretOppfyltForm from './soknadsfrist/ErSoknadsfristVilkaretOppfyltForm';
import ErForeldreansvar2LeddVilkaarOppfyltForm from './foreldreansvar/ErForeldreansvar2LeddVilkaarOppfyltForm';
import ErForeldreansvar4LeddVilkaarOppfyltForm from './foreldreansvar/ErForeldreansvar4LeddVilkaarOppfyltForm';
import SokersOpplysningspliktForm from './sokersOpplysningsplikt/SokersOpplysningspliktForm';
import FodselVilkarForm from './fodsel/FodselVilkarForm';
import AdopsjonVilkarForm from './adopsjon/AdopsjonVilkarForm';
import OpptjeningVilkarView from './opptjening/OpptjeningVilkarView';
import VilkarresultatMedOverstyringForm from './VilkarresultatMedOverstyringForm';

/*
 * VilkarPanels
 *
 * Presentasjonskomponent.
 */
export const VilkarPanels = ({
  aksjonspunktCodes,
  vilkarTypeCodes,
  behandlingspunkt,
  isAksjonspunktOpen,
  readOnly,
  readOnlySubmitButton,
  submitCallback,
}) => (
  <ElementWrapper>
    {VilkarresultatMedOverstyringForm.supports(aksjonspunktCodes, behandlingspunkt)
      && <VilkarresultatMedOverstyringForm key={behandlingspunkt} submitCallback={submitCallback} />
    }
    {SokersOpplysningspliktForm.supports(behandlingspunkt)
      && (
      <SokersOpplysningspliktForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
    }
    {ErSoknadsfristVilkaretOppfyltForm.supports(aksjonspunktCodes)
    && (
    <ErSoknadsfristVilkaretOppfyltForm
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
    />
    )
     }
    {ErOmsorgVilkaarOppfyltForm.supports(behandlingspunkt, aksjonspunktCodes)
      && <ErOmsorgVilkaarOppfyltForm submitCallback={submitCallback} readOnly={readOnly} readOnlySubmitButton={readOnlySubmitButton} />
    }
    {ErForeldreansvar2LeddVilkaarOppfyltForm.supports(behandlingspunkt, aksjonspunktCodes, vilkarTypeCodes)
      && (
      <ErForeldreansvar2LeddVilkaarOppfyltForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
    }
    {ErForeldreansvar4LeddVilkaarOppfyltForm.supports(behandlingspunkt, aksjonspunktCodes, vilkarTypeCodes)
      && (
      <ErForeldreansvar4LeddVilkaarOppfyltForm
        submitCallback={submitCallback}
        behandlingspunkt={behandlingspunkt}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )
    }
    {FodselVilkarForm.supports(behandlingspunkt, aksjonspunktCodes)
      && (
      <FodselVilkarForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        isAksjonspunktOpen={isAksjonspunktOpen}
      />
      )
    }
    {AdopsjonVilkarForm.supports(behandlingspunkt, aksjonspunktCodes)
      && (
      <AdopsjonVilkarForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        isAksjonspunktOpen={isAksjonspunktOpen}
      />
      )
    }
    {OpptjeningVilkarView.supports(behandlingspunkt)
      && (
      <OpptjeningVilkarView
        submitCallback={submitCallback}
        readOnly={readOnly}
        isAksjonspunktOpen={isAksjonspunktOpen}
      />
      )
    }
  </ElementWrapper>
);

VilkarPanels.propTypes = {
  aksjonspunktCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  behandlingspunkt: PropTypes.string.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  vilkarTypeCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = state => ({
  vilkarTypeCodes: getBehandlingVilkarCodes(state),
});

export default connect(mapStateToProps)(VilkarPanels);
