from django.urls import path
from django.contrib.auth.views import LogoutView
from .views import *


urlpatterns = [
    path('', list_all, name='users'),
    path('login/', login_user, name='login'),
    path('register/', register_user, name='register'),
    path('logout/', LogoutView.as_view(next_page='/'), name='logout'),
    path('user/<str:id>/', get_user_profile, name='user-profile'),
    path('profile/update', update_profile, name='update-profile'),
    path('change-password/', change_password, name='change-password'),
    path('update-relationship/<str:id>/', update_relationship, name='relationship'),
    path('subscriptions/<str:id>/', user_subscriptions, name='subscriptions'),
    path('followers/<str:id>/', user_followers, name='followers'),
    # path('profile', get_user_profile, name='users-profile'),
    # path('profile/update', views.update_user_profile, name='user-profile-update'),
    # path('', views.get_users, name='users'),
    # path('<str:pk>', views.get_user_by_id, name='user'),
    # path('update/<str:pk>', views.update_user, name='user-update'),
    # path('delete/<str:pk>', views.delete_user, name='user-delete'),

]