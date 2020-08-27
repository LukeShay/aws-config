class CloudFormation {
  constructor(...args) {
    this.args = args;
  }

  listExports() {
    return {
      promise: async () => ({
        Exports: [
          {
            Name: "Name-One",
            Value: "Value One",
          },
          {
            Name: "Name-Two",
            Value: "Value Two",
          },
          {
            Name: "Name-Three",
            Value: "Value Three",
          },
        ],
      }),
    };
  }
}

module.exports = {
  CloudFormation,
};
