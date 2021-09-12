# Generated by Django 3.2.7 on 2021-09-12 14:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.TextField(max_length=30)),
                ('age', models.IntegerField(default=18, null=True)),
                ('sex', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('Not chosen', 'Not chosen')], default='Not chosen', max_length=20)),
                ('location', models.CharField(max_length=50)),
                ('contact', models.CharField(max_length=30)),
                ('photo', models.ImageField(default='image/default.jpg', upload_to='')),
                ('description', models.TextField(blank=True, max_length=500)),
                ('budget', models.IntegerField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='UserTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.tag')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='base.customuser')),
            ],
        ),
        migrations.CreateModel(
            name='UserRelationship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('got_connected', models.BooleanField(default=False)),
                ('initiator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='initiator', to='base.customuser')),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='receiver', to='base.customuser')),
            ],
        ),
    ]
