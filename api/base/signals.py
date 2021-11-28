from django.db.models.signals import post_save, pre_delete
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import CustomUser, Place


@receiver(post_save, sender=User)
def create_custom_user(sender, instance, created, **kwargs):
    if created:
        # fav = Place.objects.get(default=True)
        CustomUser.objects.create(user=instance)
        # instance.customer.favorite_places.set(fav)
        instance.customuser.first_name = instance.username
        instance.customuser.save()


# @receiver(post_save, sender=Place)
# def get_default_fav_place(sender, instance, created, **kwargs):
#     all_places = Place.objects.filter(default=True)
#     if instance.default:
#         for place in all_places:
#             if place != instance:
#                 place.default = False
#                 place.save()
#         all_custom_users = CustomUser.objects.all()
#         for user in all_custom_users:
#             if not user.favorite_places:
#                 user.favorite_places = instance
#                 user.save()
