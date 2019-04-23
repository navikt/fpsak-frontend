import ErrorMessage from './ErrorMessage';

// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export interface Formatter<A> {
  isOfType(type: string): boolean;
  format(errorData: A): ErrorMessage | undefined;
}
