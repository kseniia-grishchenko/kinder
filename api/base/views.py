from base.serializers import UserSerializer, CustomUserSerializer, UserSerializerWithToken
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v

        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def register_user(request):
    data = request.data

    try:
        user = User.objects.create(
            username=data['username'],
            email=data['email'],
            password=make_password(data['password'])
        )
        custom_user = CustomUser.objects.get(user=user)
        serializer = CustomUserSerializer(custom_user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def list_all(request):
    users = CustomUser.objects.select_related('user').all()
    if request.user.is_authenticated:
        user = User.objects.get(id=request.user.id)
        users = users.exclude(user=user)
    serializer = CustomUserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_user_profile(request, id):
    try:
        user = User.objects.get(id=id)
        custom_user = CustomUser.objects.select_related('user').get(user=user)
        serializer = CustomUserSerializer(custom_user, many=False)
        if request.user.is_authenticated:
            current_user = CustomUser.objects.select_related('user').get(user=request.user)
            subscribed = custom_user in current_user.subscriptions.all()
            mutually_subscribed = subscribed and custom_user in current_user.followers.all()
            serializer.data.subscribed = subscribed
            serializer.data.mutually_subscribed = mutually_subscribed
        return Response(serializer.data)
    except:
        message = {'detail': 'User does not exist'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_profile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user

    data = request.data

    user.username = data['username'] or request.user.username
    user.email = data['email'] or request.user.email

    custom_user = CustomUser.objects.select_related('user').get(user=user)
    custom_user.first_name = data['first_name'] or custom_user.first_name
    custom_user.sex = data['sex'] or custom_user.sex
    custom_user.location = data['location'] or custom_user.location
    custom_user.budget = data['budget'] or custom_user.budget
    custom_user.description = data['description'] or custom_user.description
    custom_user.contact = data['contact'] or custom_user.contact

    serializer = CustomUserSerializer(custom_user, many=False, partial=True)
    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()
    custom_user.save()
    return Response(serializer.data)


def change_password(request):
    # context = {}
    # if request.method == 'POST':
    #     form = PasswordChangeForm(request.user, request.POST)
    #     if form.is_valid():
    #         user = form.save()
    #         update_session_auth_hash(request, user)  # Important!
    #         messages.success(request, 'Your password was successfully updated!')
    #         return redirect('users')
    #     else:
    #         messages.error(request, 'Please correct the error below.')
    # else:
    #     form = PasswordChangeForm(request.user)
    # context['form'] = form
    # return render(request, 'password_change.html', context)
    pass


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_relationship(request, id):
    if request.user.id == int(id):
        return
    sender = CustomUser.objects.get(user=request.user.id)

    user = User.objects.get(id=id)
    receiver = CustomUser.objects.get(user=user)
    subscriptions = sender.subscriptions.all()
    if receiver in subscriptions:
        sender.subscriptions.remove(receiver)
        receiver.followers.remove(sender)
    else:
        sender.subscriptions.add(receiver)
        receiver.followers.add(sender)

    serializer = CustomUserSerializer(receiver, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def get_user_subscriptions(request, id):
    user = CustomUser.objects.get(user_id=id)
    subscriptions = user.subscriptions.all()
    serializer = CustomUserSerializer(subscriptions, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_user_followers(request, id):
    user = CustomUser.objects.get(user_id=id)
    followers = user.followers.all()
    serializer = CustomUserSerializer(followers, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_custom_user(request, id):
    user = CustomUser.objects.get(user_id=id)
    serializer = CustomUserSerializer(user, many=False)
    return Response(serializer.data)
