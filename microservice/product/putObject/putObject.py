import json
from datetime import datetime
import boto3
import os

def save(codigo,nombre,cantidad,descripcion):
    now = datetime.now()
    data = {
        "codigo": codigo,
        "name":   nombre,
        "descripcion": descripcion,
        "cantidad": cantidad,
        "time": now.strftime("%Y-%m-%d"),
    }
    send_to_dynamo(data)
    return True


def send_to_dynamo(data):
    print("Enviando a Dynamo de Tracking")
    tableName = os.environ['table']
    dynamo = boto3.resource("dynamodb")
    table = dynamo.Table(tableName)
    table.put_item(Item=data)
    print("Se envio de forma correcta")
    print("ServerlessProject-dynamo-dev")
    return True


def lambda_handler(event, context):
    body = json.loads(event['body'])
    codigo = body['codigo']
    print('codigo: ',codigo)
    nombre = body['nombre']
    print('nombre: ',nombre)
    cantidad = body['cantidad']
    print('cantidad: ',cantidad)
    descripcion = body['descripcion']
    print('descripcion: ',descripcion)

    save(codigo,nombre,cantidad,descripcion)

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps('its ok!')
    }

