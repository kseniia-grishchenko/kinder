from base.serializers import UserSerializer, CustomUserSerializer, UserSerializerWithToken, MapSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from decimal import Decimal

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
        serializer = UserSerializer(user, many=False)
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
        custom_user = CustomUser.objects.select_related('user').get(user_id=id)
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
    print('Hello')

    data = request.data
    if data:
        user.username = data.get('username') or request.user.username
        user.email = data.get('email') or request.user.email

        custom_user = CustomUser.objects.select_related('user').get(user=user)
        custom_user.first_name = data.get('username') or custom_user.first_name
        custom_user.sex = data.get('sex') or custom_user.sex
        custom_user.location = data.get('location') or custom_user.location
        custom_user.budget = data.get('budget') or custom_user.budget
        custom_user.description = data.get('description') or custom_user.description
        custom_user.contact = data.get('contact') or custom_user.contact

        serializer = CustomUserSerializer(custom_user, many=False, partial=True)

        user.save()
        custom_user.save()
        return Response(serializer.data)
    else:
        message = {'detail': 'Nothing to update'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


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


@api_view(['GET'])
def get_map_info(request, id):
    user = CustomUser.objects.get(user_id=id)
    serializer = MapSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_map(request, id):
    if request.user.id != int(id):
        return
    user = CustomUser.objects.get(user_id=id)
    data = request.data
    fav_places = user.favorite_places
    latitude = Decimal(data['latitude'])
    longitude = Decimal(data['longitude'])
    if len(fav_places) < 5:
        if [latitude, longitude] in fav_places:
            message = {'detail': 'This place is already in your favorites!'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
        fav_places.append([latitude, longitude])
        user.save()
        serializer = MapSerializer(user, many=False)
        return Response(serializer.data)
    else:
        message = {'detail': 'You can add only 5 favorite places!'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_map(request, id):
    if request.user.id != int(id):
        return
    user = CustomUser.objects.get(user_id=id)
    data = request.data
    fav_places = user.favorite_places
    latitude = Decimal(data['latitude'])
    longitude = Decimal(data['longitude'])
    if [latitude, longitude] in fav_places:
        fav_places.remove([latitude, longitude])
        user.save()
        serializer = MapSerializer(user, many=False)
        return Response(serializer.data)
    else:
        message = {'detail': 'Such place does not exit in your list!'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
