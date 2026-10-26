// Entry point for vendor/anthropic-sdk.js: the parts of the official Anthropic SDK that the bag scanner uses.
// The app loads that bundle only when you tap Scan bag.
export { default as Anthropic } from '@anthropic-ai/sdk';
export { jsonSchemaOutputFormat } from '@anthropic-ai/sdk/helpers/json-schema';
