#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BucketsStack } from '../lib/s3/s3-stack';
import { DynamoStack } from '../lib/dynamo/dynamo-stack';
import { apiLambdaStack } from '../lib/api-lambda/api-lambda-stack';
import { APP_PROPS } from './props/props';

const app = new cdk.App();

new BucketsStack(app, 'S3StackDEV',APP_PROPS.devProps);
const dynamoDev = new DynamoStack(app, 'DynamoStackDEV', APP_PROPS.devProps);
new apiLambdaStack(app, 'apiLambdaStackDEV', APP_PROPS.devProps, dynamoDev);
