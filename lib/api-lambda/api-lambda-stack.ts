import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack } from 'aws-cdk-lib';
import { Role, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import  AppProps  from '../../interfaces/app-props'
import { DynamoStack } from '../dynamo/dynamo-stack';

export class apiLambdaStack extends Stack {
    constructor(scope: App, id: string, props: AppProps, dynDB: DynamoStack){
        super(scope, id, props);
        const roleLambda = this.lambdaRole(props);

        const getAllUsersProps = {
            name: `getAllUser-${props.stage}`,
            component: 'user',
            folder: 'getObject',
            stage: props.stage,
            dynamo: dynDB.TableUser.tableName
        }
        const lambdaGetAll = this.Createlambda(getAllUsersProps,roleLambda.roleArn);

        const getOneUsersProps = {
            name: `getOneUser-${props.stage}`,
            component: 'user',
            folder: 'getOneObject',
            stage: props.stage,
            dynamo: dynDB.TableUser.tableName
        }
        const lambdaGetOne = this.Createlambda(getOneUsersProps,roleLambda.roleArn);

        const PutUserProps = {
            name: `putUser-${props.stage}`,
            component: 'user',
            folder: 'putObject',
            stage: props.stage,
            dynamo: dynDB.TableUser.tableName
        }
        const lambdaPutUser = this.Createlambda(PutUserProps,roleLambda.roleArn);

        const DeleteUserProps = {
            name: `deleteUser-${props.stage}`,
            component: 'user',
            folder: 'deleteObject',
            stage: props.stage,
            dynamo: dynDB.TableUser.tableName
        }
        const lambdaDelete = this.Createlambda(DeleteUserProps,roleLambda.roleArn);


        const getAllProductsProps = {
            name: `getAllProduct-${props.stage}`,
            component: 'product',
            folder: 'getObject',
            stage: props.stage,
            dynamo: dynDB.TableProduct.tableName
        }
        const lambdaGetAllProducts = this.Createlambda(getAllProductsProps,roleLambda.roleArn);

        const getOneProductProps = {
            name: `getOneProduct-${props.stage}`,
            component: 'product',
            folder: 'getOneObject',
            stage: props.stage,
            dynamo: dynDB.TableProduct.tableName
        }
        const lambdaGetOneProduct = this.Createlambda(getOneProductProps,roleLambda.roleArn);

        const PutProductProps = {
            name: `putProduct-${props.stage}`,
            component: 'product',
            folder: 'putObject',
            stage: props.stage,
            dynamo: dynDB.TableProduct.tableName
        }
        const lambdaPutProduct = this.Createlambda(PutProductProps,roleLambda.roleArn);

        const DeleteProductProps = {
            name: `deleteProduct-${props.stage}`,
            component: 'product',
            folder: 'deleteObject',
            stage: props.stage,
            dynamo: dynDB.TableProduct.tableName
        }
        const lambdaDeleteProduct = this.Createlambda(DeleteProductProps,roleLambda.roleArn);

        const apiGatewayName = `apigateway-ecommerce-serverless`;   
        const api = new apigateway.LambdaRestApi(this, `${apiGatewayName}-api`, {
            handler: lambdaGetAll,
            proxy: false,
            restApiName: apiGatewayName,
            deploy: true,
            deployOptions:{
              stageName: "prod"
            }
        });
      
          const root = api.root.addResource('api');

          const users = root.addResource('users')
          users.addMethod('GET', new apigateway.LambdaIntegration(lambdaGetOne), { apiKeyRequired: false });
          users.addMethod('PUT', new apigateway.LambdaIntegration(lambdaPutUser), { apiKeyRequired: false });
          const OneUser = users.addResource('{id}');
          OneUser.addMethod('GET', new apigateway.LambdaIntegration(lambdaGetOne), { apiKeyRequired: false });
          OneUser.addMethod('DELETE', new apigateway.LambdaIntegration(lambdaDelete), { apiKeyRequired: false });

          const products = root.addResource('products')
          products.addMethod('GET', new apigateway.LambdaIntegration(lambdaGetAllProducts), { apiKeyRequired: false });
          products.addMethod('PUT', new apigateway.LambdaIntegration(lambdaPutProduct), { apiKeyRequired: false });
          const oneProduct = products.addResource('{id}');
          oneProduct.addMethod('GET', new apigateway.LambdaIntegration(lambdaGetOneProduct), { apiKeyRequired: false });
          oneProduct.addMethod('DELETE', new apigateway.LambdaIntegration(lambdaDelete), { apiKeyRequired: false });
      
    };

    private lambdaRole(props: AppProps){
        const role = new iam.Role(this, `${props.project}lambda-role-${props.stage}`, {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
            roleName: `${props.project}lambda-role-${props.stage}`,
            managedPolicies: [ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
                iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')]
        });
        role.addToPolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ["lambda:InvokeFunction"],
            resources: ["*"]
        }));
        return role
    };

    private Createlambda(props: any,role: string){
        const roleLambda =  Role.fromRoleArn(this,`rolelambda-${props.name}`,role)
        const lambdaFunc = new lambda.Function(this, `Lambda-Handler-${props.name}`, {
            functionName: props.name,
            runtime: lambda.Runtime.PYTHON_3_8,
            code: lambda.Code.fromAsset(`microservice/${props.component}/${props.folder}`),
            handler: `${props.folder}.lambda_handler`,
            role: roleLambda,
            memorySize: 128,
            timeout: cdk.Duration.minutes(3),
            environment:{
                "stage": `${props.stage}`,
                "table": props.dynamo
            }
          });
        return lambdaFunc;
    };
}