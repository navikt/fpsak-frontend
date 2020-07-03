import { RestApiConfigBuilder, createRequestApi } from '@fpsak-frontend/rest-api-new';
import { getUseRestApi } from '@fpsak-frontend/rest-api-hooks';

export enum FpsakApiKeys {
  BEHANDLING_PERSONOPPLYSNINGER = 'BEHANDLING_PERSONOPPLYSNINGER',
  BEHANDLING_FAMILIE_HENDELSE = 'BEHANDLING_FAMILIE_HENDELSE',
  ANNEN_PART_BEHANDLING = 'ANNEN_PART_BEHANDLING',
}

const CONTEXT_PATH = 'fpsak';

const endpoints = new RestApiConfigBuilder(CONTEXT_PATH)
  .withRel('soeker-personopplysninger', FpsakApiKeys.BEHANDLING_PERSONOPPLYSNINGER)
  .withRel('familiehendelse-v2', FpsakApiKeys.BEHANDLING_FAMILIE_HENDELSE)
  .withGet('/api/behandlinger/annen-part-behandling', FpsakApiKeys.ANNEN_PART_BEHANDLING)
  .build();

export const requestApi = createRequestApi(endpoints);

export const useRestApi = getUseRestApi(requestApi);
