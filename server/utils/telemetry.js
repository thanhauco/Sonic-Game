const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Simple OTel setup for tracing
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'jordan-agents-api',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

function initTelemetry() {
  if (process.env.NODE_ENV === 'production' || process.env.ENABLE_TELEMETRY === 'true') {
    sdk.start()
      .then(() => console.log('Tracing initialized'))
      .catch((error) => console.log('Error initializing tracing', error));

    process.on('SIGTERM', () => {
      sdk.shutdown()
        .then(() => console.log('Tracing terminated'))
        .catch((error) => console.log('Error terminating tracing', error))
        .finally(() => process.exit(0));
    });
  }
}

module.exports = { initTelemetry };
