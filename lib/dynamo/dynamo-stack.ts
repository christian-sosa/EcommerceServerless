import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import  AppProps  from '../../interfaces/app-props'

export class DynamoStack extends Stack {
  public readonly TableUser:Table;
  public readonly TableProduct:Table;

  constructor(scope: Construct, id: string, props: AppProps) {
    super(scope, id, props);

    const baseNameUser = `${props.project}-dynamo-user-${props.stage}`;

    this.TableUser = new Table(this, `${baseNameUser}`, {
      tableName: `${baseNameUser}`,
      partitionKey: { name: 'email', type: AttributeType.STRING },
      sortKey: { name: 'apellido', type: AttributeType.STRING },
      billingMode: BillingMode.PROVISIONED,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const baseNameProduct = `${props.project}-dynamo-product-${props.stage}`;

    this.TableProduct = new Table(this, `${baseNameProduct}`, {
      tableName: `${baseNameProduct}`,
      partitionKey: { name: 'codigo', type: AttributeType.STRING },
      sortKey: { name: 'nombre', type: AttributeType.STRING },
      billingMode: BillingMode.PROVISIONED,
      removalPolicy: RemovalPolicy.DESTROY
    });

  }
}
