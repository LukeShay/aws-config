const { CloudFormation } = require("aws-sdk");
const response = require("cfn-response-promise");

const cloudformation = new CloudFormation({ region: process.env.AWS_REGION });

exports.handler = async (event, context) => {
  if (!event || !event.ResourceProperties || !event.ResourceProperties.Value) {
    return await response.send(event, context, response.FAILED);
  }

  try {
    let { Value: resourceValue } = event.ResourceProperties;
    const exports = await (await cloudformation.listExports().promise())
      .Exports;

    const exportsObject = {};

    exports.forEach((value) => {
      exportsObject[value.Name] = value.Value;
    });

    const subs = resourceValue.match(/\${[^}]+}/g);

    console.log(`Sub values: ${subs}`);

    subs.forEach((value) => {
      const subName = value.replace(/(\${(Import::)?|})?/g, "");
      if (!subName) throw "";

      resourceValue = resourceValue
        .split(value)
        .join(
          value.includes("${Import::")
            ? exportsObject[subName]
            : event.ResourceProperties[subName]
        );
    });

    await response.send(
      event,
      context,
      response.SUCCESS,
      { Plaintext: resourceValue },
      resourceValue
    );
  } catch (error) {
    console.error(error.message);
    await response.send(event, context, response.FAILED);
  }
};
