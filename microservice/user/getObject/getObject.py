import boto3
import json
import os

  
def get_dynamo(dynamodb, table_dynamo):
    table = dynamodb.Table(table_dynamo)
    
    response_table = table.scan()
    return response_table


def lambda_handler(event, context):
    dynamo = boto3.resource("dynamodb")
    tableName = os.environ['table']

    listTable = get_dynamo(dynamo, tableName)
    print(listTable['Items'])

    return {
        'statusCode': 200,
        'body': json.dumps(listTable['Items'])
    }
