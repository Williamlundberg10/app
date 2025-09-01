from flask import Flask, request, jsonify
from pywebpush import webpush, WebPushException

app = Flask(__name__)

VAPID_PRIVATE_KEY = "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR0hBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJHMHdhd0lCQVFRZ2VEUHdJRTFTQURtV1B5UnEKbW8vcUlrZnVIUERIR3psVGVUVDRiQmRoOVVtaFJBTkNBQVFNN0t0Zkc3ZkVhdXJxN1JTU1lwK1NUd1BJdEZONgpxV0EvOTlxOCtzT0FpNVdDUFE5ZWdxakwvK3g0TWJ2M3NSWHhtVmk3dmg5Y0lPd3FIT1BzS2xRYwotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg=="
VAPID_PUBLIC_KEY = "BAzsq18bt8Rq6urtFJJin5JPA8i0U3qpYD_32rz6w4CLlYI9D16CqMv_7Hgxu_exFfGZWLu-H1wg7Coc4-wqVBw="
VAPID_CLAIMS = {
    "sub": "mailto:williamlundberg10.home@gmail.com"
}

subscriptions = []

@app.route("/subscribe", methods=["POST"])
def subscribe():
    subscription = request.json
    subscriptions.append(subscription)
    return jsonify({"status": "subscribed"}), 201

@app.route("/send", methods=["POST"])
def send():
    data = request.json
    for sub in subscriptions:
        try:
            webpush(
                subscription_info=sub,
                data=jsonify({"title": data["title"], "body": data["body"]}).data,
                vapid_private_key=VAPID_PRIVATE_KEY,
                vapid_claims=VAPID_CLAIMS
            )
        except WebPushException as ex:
            print("Push failed:", repr(ex))
    return jsonify({"status": "sent"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5540, ssl_context=("cert.pem", "key.pem"))
