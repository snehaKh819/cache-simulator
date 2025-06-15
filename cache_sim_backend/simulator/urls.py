from django.urls import path
from . import views
from .views import upload_file_simulation

urlpatterns = [
    path('simulate/', views.simulate_cache),
    path('upload/', views.upload_file_simulation),
]
