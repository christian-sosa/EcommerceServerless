#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { EcommerceServerlessStack } from '../lib/ecommerce_serverless-stack';

const app = new cdk.App();
new EcommerceServerlessStack(app, 'EcommerceServerlessStack');
