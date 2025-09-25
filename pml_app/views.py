from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Admin, Manager, TeamMember, Project, Task, Help
from .serializers import (UserSerializer, AdminSerializer, ManagerSerializer, 
                         TeamMemberSerializer, ProjectSerializer, TaskSerializer, 
                         HelpSerializer)

def index(request):
    return render(request,'index.html')
    #return HttpResponse("this is home page")

def about(request):
    return HttpResponse("this is about page")

def services(request):
    return HttpResponse("this is services page")

def contact(request):
    return render(request,'admindashboard.html')

#def home_page(request):
    #return render(request, 'home.html')

def insertuser(request):
    user_name = request.POST['name'];
    user_number = request.POST['number'];
    us=User(name=user_name,number=user_number);
    us.save();
    return render(request,'home.html',{})

def viewuser(request):
    user = User.objects.all()   #actual code to fetch data
    return render(request,"viewuser.html",{"userdata":user})

# API views
@api_view(['GET'])
def api_overview(request):
    api_urls = {
        'Users': {
            'List': '/api/users/',
            'Detail': '/api/users/<id>/',
            'Create': '/api/users/create/',
            'Update': '/api/users/update/<id>/',
            'Delete': '/api/users/delete/<id>/',
        },
        'Admins': {
            'List': '/api/admins/',
            'Detail': '/api/admins/<id>/',
            'Create': '/api/admins/create/',
            'Update': '/api/admins/update/<id>/',
            'Delete': '/api/admins/delete/<id>/',
        },
        'Managers': {
            'List': '/api/managers/',
            'Detail': '/api/managers/<id>/',
            'Create': '/api/managers/create/',
            'Update': '/api/managers/update/<id>/',
            'Delete': '/api/managers/delete/<id>/',
        },
        'TeamMembers': {
            'List': '/api/team-members/',
            'Detail': '/api/team-members/<id>/',
            'Create': '/api/team-members/create/',
            'Update': '/api/team-members/update/<id>/',
            'Delete': '/api/team-members/delete/<id>/',
        },
        'Projects': {
            'List': '/api/projects/',
            'Detail': '/api/projects/<id>/',
            'Create': '/api/projects/create/',
            'Update': '/api/projects/update/<id>/',
            'Delete': '/api/projects/delete/<id>/',
        },
        'Tasks': {
            'List': '/api/tasks/',
            'Detail': '/api/tasks/<id>/',
            'Create': '/api/tasks/create/',
            'Update': '/api/tasks/update/<id>/',
            'Delete': '/api/tasks/delete/<id>/',
        },
        'Help': {
            'List': '/api/help/',
            'Detail': '/api/help/<id>/',
            'Create': '/api/help/create/',
            'Update': '/api/help/update/<id>/',
            'Delete': '/api/help/delete/<id>/',
        }
    }
    return Response(api_urls)

@api_view(['GET'])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user)
    return Response(serializer.data)

@api_view(['POST'])
def user_create(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def user_update(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def user_delete(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

# Help API endpoints
@api_view(['GET'])
def help_list(request):
    help_requests = Help.objects.all()
    serializer = HelpSerializer(help_requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def help_detail(request, pk):
    try:
        help_request = Help.objects.get(pk=pk)
    except Help.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = HelpSerializer(help_request)
    return Response(serializer.data)

@api_view(['POST'])
def help_create(request):
    # Print all request information for debugging
    print("\n---- HELP CREATE REQUEST ----")
    print(f"Request method: {request.method}")
    print(f"Request headers: {request.headers}")
    print(f"Request data: {request.data}")
    # Don't access request.body here as it conflicts with request.data
    print("------------------------------\n")
    
    # Get the next available help_id
    last_help = Help.objects.all().order_by('-help_id').first()
    next_id = 1 if not last_help else last_help.help_id + 1
    
    # Add help_id to request data
    data = request.data.copy()
    data['help_id'] = next_id
    
    # Print debug info
    print("Processed data:", data)
    
    try:
        # Create help object directly
        help_obj = Help(
            help_id=next_id,
            name=data.get('name', ''),
            email=data.get('email', ''),
            number=data.get('number', data.get('mobile', '')),  # Try both 'number' and 'mobile'
            subject=data.get('subject', ''),
            description=data.get('description', '')
        )
        
        print(f"Creating help object: help_id={help_obj.help_id}, name={help_obj.name}, email={help_obj.email}, number={help_obj.number}")
        
        # Try to save
        help_obj.save()
        print("Help object saved successfully!")
        
        # Serialize for the response
        serializer = HelpSerializer(help_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("Error saving help object:", str(e))
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def help_update(request, pk):
    try:
        help_request = Help.objects.get(pk=pk)
    except Help.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    serializer = HelpSerializer(help_request, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def help_delete(request, pk):
    try:
        help_request = Help.objects.get(pk=pk)
    except Help.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    help_request.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


