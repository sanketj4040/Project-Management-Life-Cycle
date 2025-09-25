from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Admin, Manager, TeamMember, Project, Task, ProjectTeamMember
from .serializers import (AdminSerializer, ManagerSerializer, 
                         TeamMemberSerializer, ProjectSerializer, TaskSerializer, ProjectTeamMemberSerializer)

# Admin API views
@api_view(['GET'])
def admin_list(request):
    admins = Admin.objects.all()
    serializer = AdminSerializer(admins, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def admin_detail(request, pk):
    try:
        admin = Admin.objects.get(pk=pk)
    except Admin.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = AdminSerializer(admin)
    return Response(serializer.data)

@api_view(['POST'])
def admin_create(request):
    # Get the next available admin_id
    last_admin = Admin.objects.all().order_by('-admin_id').first()
    next_id = 1 if not last_admin else last_admin.admin_id + 1
    
    # Add admin_id to request data
    data = request.data.copy()
    data['admin_id'] = next_id
    
    serializer = AdminSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def admin_update(request, pk):
    try:
        admin = Admin.objects.get(pk=pk)
    except Admin.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = AdminSerializer(admin, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def admin_delete(request, pk):
    try:
        admin = Admin.objects.get(pk=pk)
    except Admin.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    admin.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

# Manager API views
@api_view(['GET'])
def manager_list(request):
    managers = Manager.objects.all()
    serializer = ManagerSerializer(managers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def manager_detail(request, pk):
    try:
        manager = Manager.objects.get(pk=pk)
    except Manager.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ManagerSerializer(manager)
    return Response(serializer.data)

@api_view(['POST'])
def manager_create(request):
    # Check if manager_id is provided in request data
    data = request.data.copy()
    
    # If manager_id is provided, use it; otherwise auto-generate
    if 'manager_id' not in data or not data['manager_id']:
        # Get the next available manager_id
        last_manager = Manager.objects.all().order_by('-manager_id').first()
        next_id = 1 if not last_manager else last_manager.manager_id + 1
        data['manager_id'] = next_id
    else:
        # Check if the provided manager_id already exists
        manager_id = data['manager_id']
        if Manager.objects.filter(manager_id=manager_id).exists():
            return Response(
                {'error': f'Manager with ID {manager_id} already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    serializer = ManagerSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def manager_update(request, pk):
    try:
        manager = Manager.objects.get(pk=pk)
    except Manager.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ManagerSerializer(manager, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def manager_delete(request, pk):
    try:
        manager = Manager.objects.get(pk=pk)
    except Manager.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    manager.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

# TeamMember API views
@api_view(['GET'])
def team_member_list(request):
    team_members = TeamMember.objects.all()
    serializer = TeamMemberSerializer(team_members, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def team_member_detail(request, pk):
    try:
        team_member = TeamMember.objects.get(pk=pk)
    except TeamMember.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = TeamMemberSerializer(team_member)
    return Response(serializer.data)

@api_view(['POST'])
def team_member_create(request):
    # Check if team_member_id is provided, otherwise auto-generate
    data = request.data.copy()
    
    if 'team_member_id' in data and data['team_member_id']:
        # Manual team_member_id provided - check if it already exists
        team_member_id = data['team_member_id']
        if TeamMember.objects.filter(team_member_id=team_member_id).exists():
            return Response(
                {'error': f'Team Member with ID {team_member_id} already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        # Auto-generate team_member_id
        last_team_member = TeamMember.objects.all().order_by('-team_member_id').first()
        next_id = 1 if not last_team_member else last_team_member.team_member_id + 1
        data['team_member_id'] = next_id
    
    serializer = TeamMemberSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def team_member_update(request, pk):
    try:
        team_member = TeamMember.objects.get(pk=pk)
    except TeamMember.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = TeamMemberSerializer(team_member, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def team_member_delete(request, pk):
    try:
        team_member = TeamMember.objects.get(pk=pk)
    except TeamMember.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    team_member.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

# Project API views
@api_view(['GET'])
def project_list(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def project_detail(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = ProjectSerializer(project)
    return Response(serializer.data)

@api_view(['POST'])
def project_create(request):
    # Get the next available project_id
    last_project = Project.objects.all().order_by('-project_id').first()
    next_id = 1 if not last_project else last_project.project_id + 1
    
    # Add project_id to request data
    data = request.data.copy()
    data['project_id'] = next_id
    
    serializer = ProjectSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
def project_update(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    print(f"Updating project {pk} with data: {request.data}")  # Debug log
    
    # Use partial=True for PATCH requests or when only some fields are provided
    partial = request.method == 'PATCH' or len(request.data) < 3
    serializer = ProjectSerializer(project, data=request.data, partial=partial)
    
    if serializer.is_valid():
        serializer.save()
        print(f"Project {pk} updated successfully with progress: {serializer.data.get('progress')}")
        return Response(serializer.data)
    
    print(f"Serializer errors: {serializer.errors}")  # Debug log
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def project_delete(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    project.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

# Task API views
@api_view(['GET'])
def task_list(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def task_detail(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = TaskSerializer(task)
    return Response(serializer.data)

@api_view(['POST'])
def task_create(request):
    serializer = TaskSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def task_update(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = TaskSerializer(task, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def task_delete(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    task.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

# ProjectTeamMember API views
@api_view(['GET'])
def project_team_member_list(request):
    project_team_members = ProjectTeamMember.objects.all()
    serializer = ProjectTeamMemberSerializer(project_team_members, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def project_team_members_by_project(request, project_id):
    """Get all team members for a specific project"""
    try:
        project_team_members = ProjectTeamMember.objects.filter(project__project_id=project_id)
        serializer = ProjectTeamMemberSerializer(project_team_members, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def project_team_member_create(request):
    """Assign a team member to a project"""
    serializer = ProjectTeamMemberSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def project_team_member_bulk_create(request):
    """Assign multiple team members to a project"""
    project_id = request.data.get('project_id')
    team_member_ids = request.data.get('team_member_ids', [])
    
    if not project_id or not team_member_ids:
        return Response({'error': 'project_id and team_member_ids are required'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    created_assignments = []
    errors = []
    
    for team_member_id in team_member_ids:
        data = {
            'project_id': project_id,
            'team_member_id': team_member_id
        }
        serializer = ProjectTeamMemberSerializer(data=data)
        if serializer.is_valid():
            try:
                assignment = serializer.save()
                created_assignments.append(ProjectTeamMemberSerializer(assignment).data)
            except Exception as e:
                errors.append(f"Team member {team_member_id}: {str(e)}")
        else:
            errors.append(f"Team member {team_member_id}: {serializer.errors}")
    
    return Response({
        'created': created_assignments,
        'errors': errors
    }, status=status.HTTP_201_CREATED if created_assignments else status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def project_team_member_delete(request, pk):
    """Remove a team member from a project"""
    try:
        project_team_member = ProjectTeamMember.objects.get(pk=pk)
    except ProjectTeamMember.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    project_team_member.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
