# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2017-03-29 16:49
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    def populate_config_column(apps, schema_editor):
        Job = apps.get_model('jobs', 'Job')
        for job in Job.objects.all():
            job.config = job.configs.first()
            job.save()

    dependencies = [
        ('jobs', '0032_merge'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='config',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='config', to='jobs.ExportConfig'),
        ),
        migrations.RunPython(populate_config_column)
    ]




