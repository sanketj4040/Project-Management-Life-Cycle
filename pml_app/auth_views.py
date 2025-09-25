from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Admin, Manager, TeamMember

@api_view(['POST'])
def admin_login(request):
    try:
        admin_id = request.data.get('admin_id')
        password = request.data.get('password')
        
        if admin_id is None or not password:
            return Response(
                {'error': 'Please provide both admin ID and password'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Try converting admin_id to integer
        try:
            admin_id = int(admin_id)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Admin ID must be a number'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if admin exists with provided credentials
        try:
            admin = Admin.objects.get(admin_id=admin_id, password=password)
            
            # Return success response with admin details
            return Response({
                'status': 'success',
                'message': 'Login successful',
                'data': {
                    'admin_id': admin.admin_id,
                    'name': admin.name
                }
            }, status=status.HTTP_200_OK)
            
        except Admin.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def manager_login(request):
    try:
        manager_id = request.data.get('manager_id')
        password = request.data.get('password')
        
        if manager_id is None or not password:
            return Response(
                {'error': 'Please provide both manager ID and password'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Try converting manager_id to integer
        try:
            manager_id = int(manager_id)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Manager ID must be a number'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if manager exists with provided credentials
        try:
            manager = Manager.objects.get(manager_id=manager_id, password=password)
            
            # Return success response with manager details
            return Response({
                'status': 'success',
                'message': 'Login successful',
                'data': {
                    'manager_id': manager.manager_id,
                    'name': manager.name
                }
            }, status=status.HTTP_200_OK)
            
        except Manager.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def team_member_login(request):
    try:
        team_member_id = request.data.get('team_member_id')
        password = request.data.get('password')

        if team_member_id is None or not password:
            return Response(
                {'error': 'Please provide both team member ID and password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if team_member_id is None or not password:
            return Response(
                {'error': 'Please provide both team member ID and password'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Try converting team_member_id to integer
        try:
            team_member_id = int(team_member_id)
        except (ValueError, TypeError):
            return Response(
                {'error': 'Team Member ID must be a number'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if team member exists with provided credentials
        try:
            team_member = TeamMember.objects.get(team_member_id=team_member_id, password=password)
            
            # Return success response with team member details
            return Response({
                'status': 'success',
                'message': 'Login successful',
                'data': {
                    'team_member_id': team_member.team_member_id,
                    'name': team_member.team_member_name
                }
            }, status=status.HTTP_200_OK)
            
        except TeamMember.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
