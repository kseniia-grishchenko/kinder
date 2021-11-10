from base.serializers import UserSerializer, CustomUserSerializer, \
    UserSerializerWithToken, UserPlacesSerializer, UserTagsSerializer, TagSerializer, PlaceSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from decimal import Decimal
import json

from .models import CustomUser, Tag, Place


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
def list_all(request, search=''):
    try:
        all_tags = Tag.objects.all()
        length = len(search)
        users = CustomUser.objects.select_related('user').all()

        if len(search) == 0:
            if request.user.is_authenticated:
                user = User.objects.get(id=request.user.id)
                users = users.exclude(user=user)
            serializer = CustomUserSerializer(users, many=True)
            return Response(serializer.data)

        else:
            user_list = []

            for tag in all_tags:
                if tag.name[:length].lower() == search.lower():
                    for user in users:
                        if tag in user.tags.all():
                            user_list.append(user)

            new_user_list = list(set(user_list))
            print('1', new_user_list)
            print('4', request)
            user = User.objects.get(id=request.user.id)
            print(user)
            user_by_username = CustomUser.objects.get(first_name=user.username)

            if request.user.is_authenticated and user_by_username in new_user_list:
                new_user_list.remove(user_by_username)
            print('2', new_user_list)
            serializer = CustomUserSerializer(new_user_list, many=True)
            print('3', serializer.data)
            return Response(serializer.data)
    except:
        users = CustomUser.objects.select_related('user').all()
        if request.user.is_authenticated:
            user = User.objects.get(id=request.user.id)
            users = users.exclude(user=user)
        serializer = CustomUserSerializer(users, many=True)
        return Response(serializer.data)


# def get_user_tags(request, id):
#     user = CustomUser.objects.get(user_id=id)
#     all_user_tags = user.tags.all()
#     serializer = TagSerializer(all_user_tags, many=True)
#     return Response(serializer.data)


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
def get_user_places(request, id):
    user = CustomUser.objects.get(user_id=id)
    all_user_places = user.favorite_places.all()
    serializer = PlaceSerializer(all_user_places, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_user_place(request, id):
    if request.user.id != int(id):
        return
    user = CustomUser.objects.get(user_id=id)
    data = request.data
    latitude = Decimal(data['latitude'])
    longitude = Decimal(data['longitude'])
    received_place = {
        'name': data['name'],
        'latitude': latitude,
        'longitude': longitude
    }
    fav_places = user.favorite_places.all()
    all_places = Place.objects.all()

    if fav_places.count() < 5:
        user_result = filter(lambda x: x.name == received_place['name']
                                       and x.longitude == received_place['longitude']
                                       and x.latitude == received_place['latitude'], fav_places)

        if list(user_result) != list():
            message = {'detail': 'This place is already in your favorites!'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        place_result = filter(lambda x: x.name == received_place['name']
                                        and x.longitude == received_place['longitude']
                                        and x.latitude == received_place['latitude'], all_places)

        if list(place_result) == list():
            place = Place.objects.create(
                name=data['name'],
                latitude=data['latitude'],
                longitude=data['longitude']
            )
        else:
            place = Place.objects.get(
                name=received_place['name']
            )

        user.favorite_places.add(place)
        user.save()
        serializer = PlaceSerializer(user.favorite_places.all(), many=True)
        return Response(serializer.data)
    else:
        message = {'detail': 'You can add only 5 favorite places!'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user_place(request, id):
    user = CustomUser.objects.get(user_id=request.user.id)
    fav_places = user.favorite_places.all()
    place = Place.objects.get(id=id)
    if place in fav_places:
        user.favorite_places.remove(place)
        user.save()
        serializer = PlaceSerializer(user.favorite_places.all(), many=True)
        return Response(serializer.data)
    else:
        message = {'detail': 'Such place does not exit in your list!'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
# def delete_all_maps(request, id):
#     if request.user.id != int(id):
#         return
#     user = CustomUser.objects.get(user_id=id)
#     user.favorite_places = [[]]
#     user.save()
#     serializer = UserPlacesSerializer(user, many=False)
#     return Response(serializer.data)


@api_view(['GET'])
def get_user_tags(request, id):
    user = CustomUser.objects.get(user_id=id)
    all_user_tags = user.tags.all()
    serializer = TagSerializer(all_user_tags, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_tag(request, id):
    if request.user.id != int(id):
        return
    user = CustomUser.objects.get(user_id=id)
    all_user_tags = user.tags.all()
    data = request.data
    tag_name = data['tag_name']
    tag = Tag.objects.get(name=tag_name)
    if tag not in all_user_tags:
        user.tags.add(tag)
        user.save()
        serializer = TagSerializer(user.tags.all(), many=True)
        return Response(serializer.data)
    else:
        message = {'detail': 'Such tag does not exist or it is already in list of your tags!'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_tag(request, id):
    user = CustomUser.objects.get(user_id=request.user.id)
    all_user_tags = user.tags.all()
    tag = Tag.objects.get(id=id)
    if tag in all_user_tags:
        user.tags.remove(tag)
        user.save()
        serializer = TagSerializer(user.tags.all(), many=True)
        return Response(serializer.data)
    else:
        message = {'detail': 'Something went wrong!'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_all_tags(request):
    tags = Tag.objects.all()
    serializer = TagSerializer(tags, many=True)
    return Response(serializer.data)
