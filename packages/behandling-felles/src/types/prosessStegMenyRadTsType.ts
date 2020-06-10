import { StepType } from '@navikt/nap-process-menu/dist/Step';

interface ProsessStegMenyRad {
  labelId: string;
  isActive: boolean;
  isDisabled: boolean;
  isFinished: boolean;
  type?: StepType;
}

export default ProsessStegMenyRad;
