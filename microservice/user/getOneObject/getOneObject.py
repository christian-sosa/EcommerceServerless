import boto3
import json
import os
  
def lambda_handler(event, context):
    tableName = os.environ['table']
    body = json.loads(event['body'])
    email = body['email']
    print('email: ',email)
    apellido = body['apellido']
    print('apellido: ',apellido)
    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table(tableName)

    response = table.get_item(
        Key = {
               'email': email,
               'apellido':apellido
               }
        )

    return {
        'statusCode': 200,
        'body': response['Item']
    }


