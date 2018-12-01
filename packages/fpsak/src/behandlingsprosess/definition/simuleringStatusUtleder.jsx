import vut from 'kodeverk/vilkarUtfallType';
import featureToggle from 'app/featureToggle';

export const hasSimuleringOn = ({ featureToggles }) => featureToggles[featureToggle.SIMULER_OPPDRAG];
export const getStatusFromSimulering = () => vut.OPPFYLT;
