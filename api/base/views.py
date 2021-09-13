from django.shortcuts import render

# relative import of forms
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect
from .models import CustomUser
from .forms import UserForm, CustomUserForm, LoginForm
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password


def HomePage(request):
    return render(request, "basic.html")


def register_user(request):
    context = {}

    user_form = UserForm(request.POST or None)
    custom_user_form = CustomUserForm(request.POST or None)

    if all((user_form.is_valid(), custom_user_form.is_valid())):
        user = user_form.save()
        password = make_password(user_form.cleaned_data['password'])
        print(password)
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
        password = make_password(form.cleaned_data['password'])
        user = authenticate(
            username=username, password=password
        )
        if user:
            login(request, user)
            return HttpResponseRedirect('/')
    context['form'] = form
    return render(request, 'login.html', context)
