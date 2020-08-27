const { CloudFormation } = require("aws-sdk");
const response = require("cfn-response-promise");

const cloudformation = new CloudFormation({ region: process.env.AWS_REGION });

exports.handler = async (event, context) => {
  if (!event || !event.ResourceProperties || !event.ResourceProperties.Value) {
    return await response.send(event, context, response.FAILED);
  }

  try {
    let resourceValue = event.ResourceProperties.Value;
    const exports = await cloudformation.listExports().promise();
    const exportsObject = {};

    exports.Exports.forEach((value) => {
      exportsObject[value.Name] = value.Value;
    });

    const imports = resourceValue.match(/\${Import::[^}]+}/g);

    console.log(`Imported values: ${imports}`);

    imports.forEach((value) => {
      const exportName = value.replace("${Import::", "").replace("}", "");
      if (!exportName) throw "";

      resourceValue = resourceValue
        .split(value)
        .join(exportsObject[exportName]);
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
