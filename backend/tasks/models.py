from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('completed', 'Completada'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks', null=True, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    category = models.CharField(max_length=50, blank=True, null=True)
    
    parent_task = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='subtasks'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title