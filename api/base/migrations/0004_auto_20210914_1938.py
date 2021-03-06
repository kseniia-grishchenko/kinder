# Generated by Django 3.2.7 on 2021-09-14 16:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_auto_20210914_1654'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='followers',
            field=models.ManyToManyField(blank=True, related_name='_base_customuser_followers_+', to='base.CustomUser'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='subscriptions',
            field=models.ManyToManyField(blank=True, related_name='_base_customuser_subscriptions_+', to='base.CustomUser'),
        ),
    ]
