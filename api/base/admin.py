from django.contrib import admin
from .models import *


admin.site.register(CustomUser)
admin.site.register(UserRelationship)
admin.site.register(Tag)
admin.site.register(Place)
