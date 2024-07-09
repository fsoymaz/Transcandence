from django.contrib.auth.models import AbstractBaseUser, UserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
import qrcode, pyotp, string, random

def key_generator(size=100, chars=string.ascii_uppercase + string.ascii_lowercase):
    return ''.join(random.choice(chars) for _ in range(size))

class UserManager(UserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(
            email=email, 
            twofactorkey=key_generator(),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255) 
    twofactorkey = models.CharField(max_length=255)
    twofactoractive = models.BooleanField(null=True, blank=True, default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)   

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = UserManager()
