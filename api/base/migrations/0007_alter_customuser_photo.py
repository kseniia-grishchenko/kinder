# Generated by Django 3.2.7 on 2021-11-10 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0006_auto_20211027_2315'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='photo',
            field=models.ImageField(blank=True, default='default_image.jpeg', upload_to=''),
        ),
    ]