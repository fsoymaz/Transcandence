import django.utils.timezone
import users.models
from django.db import migrations, models

class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('name', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('username', models.CharField(max_length=150, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('twofactorkey', models.CharField(max_length=255)),
                ('twofactoractive', models.BooleanField(blank=True, default=False, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
            managers=[
                ('objects', users.models.UserManager()),
            ],
        ),
    ]
