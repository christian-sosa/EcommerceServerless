import json
from datetime import datetime
import boto3
import os

def save(email,nombre,apellido,descripcion):
    now = datetime.now()
    data = {
        "email": email,
        "name":   nombre,
        "apellido": apellido,
        "descripcion": descripcion,
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
    email = body['email']
    print('email: ',email)
    nombre = body['nombre']
    print('nombre: ',nombre)
    apellido = body['apellido']
    print('apellido: ',apellido)
    descripcion = body['descripcion']
    print('descripcion: ',descripcion)

    save(email,nombre,apellido,descripcion)

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps('its ok!')
    }

