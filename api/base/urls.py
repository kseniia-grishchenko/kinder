from django.contrib.auth.views import LogoutView
from django.urls import path

from .views import *

urlpatterns = [
    path('users/', list_all, name='users'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('register/', register_user, name='register'),
    path('logout/', LogoutView.as_view(next_page='/'), name='logout'),
    path('user/<str:id>/', get_user_profile, name='user-profile'),
    path('profile/', get_my_profile, name='my-profile'),
    path('profile/update/', update_profile, name='update-profile'),
    path('change-password/', change_password, name='change-password'),
    path('update-relationship/<str:id>/', update_relationship, name='relationship'),
    path('subscriptions/<str:id>/', get_user_subscriptions, name='subscriptions'),
    path('followers/<str:id>/', get_user_followers, name='followers'),
    path('custom-user/<str:id>/', get_custom_user, name='custom-user'),
    path('get-user-place/<str:id>/', get_user_places, name='get-user-place'),
    path('add-user-place/<str:id>/', add_user_place, name='add-user-place'),
    path('delete-user-place/<str:id>/', delete_user_place, name='delete-user-place'),
    path('delete-all-maps/<str:id>/', delete_all_maps, name='delete-all-maps'),
    path('add-tag/<str:id>/', add_tag, name='add-tag'),
    path('get-user-tags/<str:id>/', get_user_tags, name='get-user-tags'),
    path('delete-tag/<str:id>/', delete_tag, name='delete-tag'),
    path('get-all-tags/', get_all_tags, name='get-all-tags'),
]
