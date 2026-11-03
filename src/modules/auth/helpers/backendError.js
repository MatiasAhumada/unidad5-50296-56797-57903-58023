import { getApiErrorMessage } from '../../shared/api/apiError';

const frontendErrorMessage = (error) => getApiErrorMessage(error);

export { frontendErrorMessage };
