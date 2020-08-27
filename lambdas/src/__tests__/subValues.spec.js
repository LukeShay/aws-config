const lambda = require("../subValues");
const response = require("cfn-response-promise");

jest.mock("cfn-response-promise", () => ({
  send: jest.fn(),
  FAILED: "FAILED",
  SUCCESS: "SUCCESS",
}));

process.env.AWS_REGION = "us-east-1";

describe("handler", () => {
  it("should call response.send with FAILED when event is null", async () => {
    await lambda.handler(null, null);

    expect(response.send).toBeCalledTimes(1);
    expect(response.send).toBeCalledWith(null, null, "FAILED");
  });

  it("should call response.send with FAILED when event.ResourceProperties is null", async () => {
    const event = { someProps: "hello" };
    await lambda.handler(event, null);

    expect(response.send).toBeCalledTimes(1);
    expect(response.send).toBeCalledWith(event, null, "FAILED");
  });

  it("should call response.send with FAILED when event.ResourceProperties.Value is null", async () => {
    const event = { ResourceProperties: { someProps: "hello" } };
    await lambda.handler(event, null);

    expect(response.send).toBeCalledTimes(1);
    expect(response.send).toBeCalledWith(event, null, "FAILED");
  });

  it("should call response.send with SUCCESS when event.ResourceProperties.Value is defined and import values are valid", async () => {
    const event = {
      ResourceProperties: {
        Value: "${Import::Name-One} ${Import::Name-One} ${Import::Name-Three}",
      },
    };
    await lambda.handler(event, null);

    expect(response.send).toBeCalledTimes(1);
    expect(response.send).toBeCalledWith(
      event,
      null,
      "SUCCESS",
      {
        Plaintext: "Value One Value One Value Three",
      },
      "Value One Value One Value Three"
    );
  });
});
