from django.db import models
from django.contrib.auth.models import User

SEX_CHOICES = (
    ('Male', 'Male'),
    ('Female', 'Female'),
    ('Not chosen', 'Not chosen')
)


class CustomUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.TextField(blank=False, max_length=30)
    age = models.IntegerField(null=True, default=18)
    sex = models.CharField(choices=SEX_CHOICES, default='Not chosen', max_length=20)
    location = models.CharField(max_length=50)
    contact = models.CharField(max_length=30)
    photo = models.ImageField(default='image/default.jpg', blank=True)
    description = models.TextField(max_length=500, blank=True, null=True)
    budget = models.IntegerField(blank=True, null=True)
    subscriptions = models.ManyToManyField("self", related_name='user_subscriptions', blank=True, symmetrical=False)
    followers = models.ManyToManyField("self", related_name='user_followers', blank=True, symmetrical=False)

    def __str__(self):
        return self.first_name


class UserRelationship(models.Model):
    initiator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='initiator')
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='receiver')
    got_connected = models.BooleanField(default=False)


class Tag(models.Model):
    name = models.CharField(max_length=50)


class UserTag(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
