import { Stack } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib'
import  AppProps  from '../../interfaces/app-props'

export class BucketsStack extends Stack {
  public readonly artifactsBucket:Bucket;

  constructor(scope: Construct, id: string,props: AppProps) {
    super(scope, id);
    
    this.artifactsBucket = new Bucket(this, `img-christian-sosa-serverless-${props.stage}`, {
      bucketName: `img-csosa-serverless-${props.stage}`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN
    });

  }
}
