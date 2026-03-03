from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    subtasks = serializers.SerializerMethodField()
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Task
        fields = [
            'id', 'user', 'title', 'description', 
            'status', 'category', 'parent_task', 
            'subtasks', 'created_at'
        ]

    def get_subtasks(self, obj):
        serializer = TaskSerializer(obj.subtasks.all(), many=True)
        return serializer.data