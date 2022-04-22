import boto3
import json
import os
  
def lambda_handler(event, context):
    tableName = os.environ['table']
    body = json.loads(event['body'])
    codigo = body['codigo']
    print('codigo: ',codigo)
    nombre = body['nombre']
    print('nombre: ',nombre)
    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table(tableName)

    response = table.delete_item(
        Key = {
               'codigo': codigo,
               'nombre':nombre
               }
        )

    return {
        'statusCode': 200,
        'body': json.dumps('deleted')
    }


