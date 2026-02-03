from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_world, name='hello_world'),
    path('test/', views.test_endpoint, name='test_endpoint'),
    path('avis/', views.submit_avis, name='submit_avis'),
    path('login/', views.login, name='login'),
    path('users/', views.manage_users, name='manage_users'),
    path('users/<int:user_id>/', views.manage_users, name='manage_user'),
    path('dashboard/', views.get_all_avis, name='get_all_avis'),
]