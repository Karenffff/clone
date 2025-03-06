from django.urls import path
from .views import receive_data,index,success

urlpatterns = [
    path("", index , name="home"),  # Renders the HTML template
    path("login/", receive_data, name="login"),  # Handles AJAX requests
    path("otp/", success, name="otp"),  # Renders the success page
]
