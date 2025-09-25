from rest_framework import serializers
from .models import User, Admin, Manager, TeamMember, Project, Task, Help, ProjectTeamMember

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = '__all__'
        
class ManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manager
        fields = '__all__'
        
class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'
        
class ProjectSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True)
    manager_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Project
        fields = '__all__'
    
    def create(self, validated_data):
        manager_id = validated_data.pop('manager_id', None)
        if manager_id:
            try:
                manager = Manager.objects.get(manager_id=manager_id)
                validated_data['manager'] = manager
            except Manager.DoesNotExist:
                raise serializers.ValidationError(f"Manager with id {manager_id} does not exist")
        return super().create(validated_data)
        
class TaskSerializer(serializers.ModelSerializer):
    manager = ManagerSerializer(read_only=True)
    manager_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Task
        fields = '__all__'
    
    def create(self, validated_data):
        manager_id = validated_data.pop('manager_id', None)
        if manager_id:
            try:
                manager = Manager.objects.get(manager_id=manager_id)
                validated_data['manager'] = manager
            except Manager.DoesNotExist:
                raise serializers.ValidationError(f"Manager with id {manager_id} does not exist")
        return super().create(validated_data)
        
class HelpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Help
        fields = '__all__'

class ProjectTeamMemberSerializer(serializers.ModelSerializer):
    project = ProjectSerializer(read_only=True)
    team_member = TeamMemberSerializer(read_only=True)
    project_id = serializers.IntegerField(write_only=True)
    team_member_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = ProjectTeamMember
        fields = '__all__'
    
    def create(self, validated_data):
        project_id = validated_data.pop('project_id')
        team_member_id = validated_data.pop('team_member_id')
        
        try:
            project = Project.objects.get(project_id=project_id)
            team_member = TeamMember.objects.get(team_member_id=team_member_id)
        except Project.DoesNotExist:
            raise serializers.ValidationError(f"Project with id {project_id} does not exist")
        except TeamMember.DoesNotExist:
            raise serializers.ValidationError(f"Team member with id {team_member_id} does not exist")
        
        validated_data['project'] = project
        validated_data['team_member'] = team_member
        return super().create(validated_data)
