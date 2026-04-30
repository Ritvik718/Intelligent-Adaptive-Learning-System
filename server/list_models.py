import requests
import json

API_KEY = "AIzaSyAWB-tHzY7-D-kF_Q2eo7RPFEoqR79VWD8"
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash?key={API_KEY}"
response = requests.get(url)
print(json.dumps(response.json(), indent=2))
