from django.contrib import admin
from .models import *


admin.site.register(CustomUser)
admin.site.register(UserTag)
admin.site.register(UserRelationship)
admin.site.register(Tag)
