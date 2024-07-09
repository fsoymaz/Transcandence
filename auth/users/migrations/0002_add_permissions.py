from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        ('auth', '0001_initial'),  # veya ('admin', '0001_initial') eğer gerekiyorsa
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='groups',
            field=models.ManyToManyField(blank=True, related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups'),
        ),
        migrations.AddField(
            model_name='user',
            name='user_permissions',
            field=models.ManyToManyField(blank=True, related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions'),
        ),
    ]
