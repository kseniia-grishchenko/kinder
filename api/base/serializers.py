from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, Tag


class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_admin']

    def get_is_admin(self, obj):
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_admin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


class CustomUserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomUser
        fields = '__all__'

    def get_is_admin(self, obj):
        return obj.user.is_staff


class MapSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['favorite_places']


class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['tags']


class TagsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ['id', 'name']
