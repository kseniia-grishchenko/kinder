from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, update_session_auth_hash
from django.http import HttpResponseRedirect
from .forms import UserForm, CustomUserRegisterForm, LoginForm, CustomUserForm
from .models import CustomUser
from django.contrib.auth.models import User


def register_user(request):
    context = {}

    user_form = UserForm(request.POST or None)
    custom_user_form = CustomUserRegisterForm(request.POST or None)

    if all((user_form.is_valid(), custom_user_form.is_valid())):
        user = user_form.save()
        password = user_form.cleaned_data['password']
        user.set_password(password)
        user = user_form.save()
        custom_user = custom_user_form.save(commit=False)
        custom_user.user = user
        custom_user.save()

    context['user_form'] = user_form
    context['custom_user_form'] = custom_user_form
    return render(request, "register_view.html", context)


def login_user(request):
    context = {}
    form = LoginForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        user = authenticate(
            username=username, password=password
        )
        if user:
            login(request, user)
            return HttpResponseRedirect('/')
    context['form'] = form
    return render(request, 'login.html', context)


def list_all(request):
    context = {}
    users = CustomUser.objects.select_related('user').all()
    context['users'] = users
    return render(request, 'home.html', context)


def get_user_profile(request, id):
    context = {}
    user = User.objects.get(id=id)
    custom_user = CustomUser.objects.get(user=user)
    context['user'] = custom_user
    return render(request, 'profile.html', context)


def update_profile(request):
    context = {}
    custom_user = CustomUser.objects.select_related('user').get(user=request.user)
    form = CustomUserForm(request.POST or None, instance=custom_user)
    if form.is_valid():
        form.save()
        return redirect('/')
    context['form'] = form
    return render(request, 'my_profile.html', context)


def change_password(request):
    context = {}
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important!
            messages.success(request, 'Your password was successfully updated!')
            return redirect('change_password')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = PasswordChangeForm(request.user)
    context['form'] = form
    return render(request, 'password_change.html', context)


def update_relationship(request, id):
    sender = CustomUser.objects.get(user=request.user.id)

    if request.method == "POST":
        user = User.objects.get(id=id)
        receiver = CustomUser.objects.get(user=user)
        subscriptions = sender.subscriptions.all()
        if receiver in subscriptions:
            sender.subscriptions.remove(receiver)
            receiver.followers.remove(sender)
        else:
            sender.subscriptions.add(receiver)
            receiver.followers.add(sender)

    return redirect('users')


def user_subscriptions(request, id):
    user_id = id
    user = User.objects.get(id=user_id)
    subscriptions = user.subscriptions.all()
    context = {"subscriptions": subscriptions, "username": user.username, "user_id": id}
    return render(request, 'subscriptions.html', context)
