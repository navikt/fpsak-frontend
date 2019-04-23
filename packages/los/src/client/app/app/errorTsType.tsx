// TODO (TOR) default export feilar for yarn:coverage
// eslint-disable-next-line import/prefer-default-export
export type Error = Readonly<{
  response?: {
    data: {
      type?: string;
    };
    status?: string;
  };
  type?: string;
}>;
