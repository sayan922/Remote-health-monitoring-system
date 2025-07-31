import asyncio
import websockets
import json
import boto3
import decimal
from dotenv import load_dotenv
import os
from flask import Flask
import threading

# ✅ Load AWS credentials from .env file
load_dotenv()
aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")

# ✅ Initialize DynamoDB
dynamodb = boto3.resource(
    "dynamodb",
    region_name="ap-south-1",
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key,
)

# ✅ Reference your table
table = dynamodb.Table("med-data-sayan922")

# ✅ Flask setup
app = Flask(__name__)

@app.route("/")
def home():
    return "🚀 WebSocket server is running!"

@app.route("/ping")
def ping():
    return "pong", 200

def run_flask():
    app.run(host="0.0.0.0", port=3000)

# ✅ Optional JSON encoder for Decimal handling
class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        return super().default(o)

# ✅ Fetch latest item based on numeric data_id
last_sent_data_id = None

async def fetch_data_from_dynamodb():
    global last_sent_data_id
    try:
        response = table.scan()
        items = response.get("Items", [])

        if not items:
            return {}

        latest_item = max(items, key=lambda x: int(x.get("data_id", 0)))
        data_id = latest_item.get("data_id")

        if data_id == last_sent_data_id:
            return {}

        last_sent_data_id = data_id

        sensor_data = latest_item.get("Sensordata", {})
        return {
            "SensorData": {
                "bmp_temp": float(sensor_data.get("bmp_temp", "0")),
                "probe_temp": float(sensor_data.get("probe_temp", "0")),
                "pressure": float(sensor_data.get("pressure", "0"))
            }
        }

    except Exception as e:
        print(f"❌ Error fetching data from DynamoDB: {e}")
        return {}

# ✅ Send data to WebSocket client
async def send_data_from_dynamodb(websocket):
    print("🟢 Client connected.")
    try:
        while True:
            data = await fetch_data_from_dynamodb()
            if data:
                await websocket.send(json.dumps(data))
            await asyncio.sleep(1)
    except websockets.exceptions.ConnectionClosed:
        print("🔌 Client disconnected.")
    except Exception as e:
        print(f"❌ WebSocket send error: {e}")

# ✅ Start everything
port = int(os.getenv("PORT", 5000))

async def main():
    # Start Flask server in a separate thread
    threading.Thread(target=run_flask, daemon=True).start()

    async with websockets.serve(send_data_from_dynamodb, "0.0.0.0", port):
        print(f"✅ WebSocket server running on ws://0.0.0.0:{port}")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
