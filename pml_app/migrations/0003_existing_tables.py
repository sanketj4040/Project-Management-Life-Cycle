from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('pml_app', '0002_supportrequest'),
    ]

    operations = [
        migrations.RunSQL(
            "SELECT 1",  # This is a no-op SQL statement
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
