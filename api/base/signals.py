from django.db.models.signals import post_save, pre_delete
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import CustomUser


@receiver(post_save, sender=User)
def create_custom_user(sender, instance, created, **kwargs):
    if created:
        CustomUser.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_custom_user(sender, instance, **kwargs):
    instance.customuser.first_name = instance.username
    instance.customuser.save()
