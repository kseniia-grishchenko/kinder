from django import forms
from .models import CustomUser
from django.contrib.auth.models import User


class UserForm(forms.ModelForm):
    # create meta class
    class Meta:
        # specify model to be used
        model = User

        # specify fields to be used
        fields = [
            "username",
            "password"
        ]


class CustomUserRegisterForm(forms.ModelForm):
    # create meta class
    class Meta:
        # specify model to be used
        model = CustomUser

        # specify fields to be used
        fields = [
            "first_name",
            "age",
            "sex",
            "location",
            "contact"
        ]

class CustomUserForm(forms.ModelForm):
    class Meta:
        # specify model to be used
        model = CustomUser

        # specify fields to be used
        fields = [
            "photo",
            "first_name",
            "age",
            "sex",
            "location",
            "contact",
            "description",
            "budget"
        ]


class LoginForm(forms.ModelForm):

    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username', 'password']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].label = 'Login'
        self.fields['password'].label = 'Password'

    def clean(self):
        username = self.cleaned_data['username']
        password = self.cleaned_data['password']
        if not User.objects.filter(username=username).exists():
            raise forms.ValidationError(f'User with login "{username} is not found in a system')
        user = User.objects.filter(username=username).first()
        if user:
            if not user.check_password(password):
                raise forms.ValidationError("Wrong password")
        return self.cleaned_data


