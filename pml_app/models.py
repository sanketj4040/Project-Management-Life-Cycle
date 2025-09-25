from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Models mapped to your database tables
class Admin(models.Model):
    admin_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = "admins"
        
    def __str__(self):
        return self.name

class Manager(models.Model):
    manager_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    password = models.CharField(max_length=255)

    class Meta:
        db_table = "managers"
        
    def __str__(self):
        return self.name

class TeamMember(models.Model):
    team_member_id = models.IntegerField(primary_key=True)
    team_member_name = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    position = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = "team_members"
        
    def __str__(self):
        return self.team_member_name

class Project(models.Model):
    project_id = models.IntegerField(primary_key=True)
    project_name = models.CharField(max_length=150)
    description = models.CharField(max_length=200, null=True, blank=True)
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE, null=True, blank=True)
    team_member_id = models.IntegerField(null=True, blank=True)
    deadline = models.DateField(null=True, blank=True)
    progress = models.IntegerField(
        default=0, 
        null=True, 
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )

    class Meta:
        db_table = "projects"
        
    def __str__(self):
        return self.project_name

class ProjectTeamMember(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    team_member = models.ForeignKey(TeamMember, on_delete=models.CASCADE)
    
    class Meta:
        db_table = "project_team_members"
        unique_together = ['project', 'team_member']  # Prevent duplicate assignments
        
    def __str__(self):
        return f"{self.project.project_name} - {self.team_member.team_member_name}"

class Task(models.Model):
    PRIORITY_CHOICES = [
        ('very_urgent', 'Very Urgent'),
        ('urgent', 'Urgent'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    
    STATUS_CHOICES = [
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    task_id = models.AutoField(primary_key=True)
    task_name = models.CharField(max_length=150)
    manager = models.ForeignKey(Manager, on_delete=models.CASCADE, null=True, blank=True)
    team_member_id = models.IntegerField(null=True, blank=True)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')

    class Meta:
        db_table = "tasks"
        
    def __str__(self):
        return self.task_name

class Help(models.Model):
    help_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=150)
    number = models.CharField(max_length=20)
    subject = models.CharField(max_length=200)
    description = models.CharField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "help"
        
    def save(self, *args, **kwargs):
        if not self.created_at:
            from django.utils import timezone
            self.created_at = timezone.now()
        super().save(*args, **kwargs)
        
    def __str__(self):
        return f"{self.subject} - {self.name}"

# Keep the original User model for backward compatibility
class User(models.Model):
    name = models.CharField(max_length=20)
    number = models.CharField(max_length=100)

    class Meta:
        db_table = "user"
        
    def __str__(self):
        return self.name