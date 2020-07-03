class TimeoutError extends Error {
  location: string

  constructor(location: string) {
    super('Maximum polling attempts exceeded');
    this.location = location;
  }
}

export default TimeoutError;
