from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer
from .service.ai_service import analyze_task_with_ai

from rest_framework import viewsets, permissions

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user, parent_task__isnull=True)

    def perform_create(self, serializer):
        task = serializer.save(user=self.request.user)

        if not task.parent_task:
            ai_results = analyze_task_with_ai(task.title, task.description)
            task.category = ai_results.get('category', 'General')
            task.save()

            subtasks_data = ai_results.get('subtasks', [])
            for sub_title in subtasks_data:
                Task.objects.create(
                    title=sub_title,
                    parent_task=task,
                    user=self.request.user,
                    status='pending'
                )