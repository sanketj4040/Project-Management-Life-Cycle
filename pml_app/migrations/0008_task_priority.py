# Generated migration for task priority field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pml_app', '0007_projectteammember'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='priority',
            field=models.CharField(choices=[('very_urgent', 'Very Urgent'), ('urgent', 'Urgent'), ('medium', 'Medium'), ('low', 'Low')], default='medium', max_length=20),
        ),
    ]