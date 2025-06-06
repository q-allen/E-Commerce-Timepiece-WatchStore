from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

# Custom User Manager
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)

    def get_by_natural_key(self, email):
        return self.get(email=email)

# Custom User Model
class CustomUser(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )

    first_name = models.CharField(max_length=30)
    middle_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30)
    username = models.CharField(max_length=30, unique=True)
    contact = models.CharField(max_length=15)
    address = models.TextField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    email = models.EmailField(unique=True)
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    # Permissions
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Attach the custom manager
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'contact', 'address', 'gender']

    def __str__(self):
        return self.email