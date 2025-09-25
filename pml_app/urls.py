from django.contrib import admin
from django.urls import path, include
from pml_app import views
from pml_app import api_views
from pml_app import auth_views

urlpatterns = [
    path('', views.index, name = "home"),
    #path("home", views.home_page, name="home"),
    path('insertuser',views.insertuser,name="insertuser"),
    path('viewuser',views.viewuser,name="viewuser"),
    path('about', views.about, name = "about"),
    path('services', views.services, name = "services"),
    path('contact', views.contact, name = "contact"),
    
    # API overview
    path('api/', views.api_overview, name="api-overview"),
    
    # User endpoints (original model)
    path('api/users/', views.user_list, name="user-list"),
    path('api/users/<int:pk>/', views.user_detail, name="user-detail"),
    path('api/users/create/', views.user_create, name="user-create"),
    path('api/users/update/<int:pk>/', views.user_update, name="user-update"),
    path('api/users/delete/<int:pk>/', views.user_delete, name="user-delete"),
    
    # Help endpoints (replacing support requests)
    path('api/help/', views.help_list, name="help-list"),
    path('api/help/<int:pk>/', views.help_detail, name="help-detail"),
    path('api/help/create/', views.help_create, name="help-create"),
    path('api/help/update/<int:pk>/', views.help_update, name="help-update"),
    path('api/help/delete/<int:pk>/', views.help_delete, name="help-delete"),
    
    # Admin endpoints
    path('api/admins/', api_views.admin_list, name="admin-list"),
    path('api/admins/<int:pk>/', api_views.admin_detail, name="admin-detail"),
    path('api/admins/create/', api_views.admin_create, name="admin-create"),
    path('api/admins/update/<int:pk>/', api_views.admin_update, name="admin-update"),
    path('api/admins/delete/<int:pk>/', api_views.admin_delete, name="admin-delete"),
    
    # Manager endpoints
    path('api/managers/', api_views.manager_list, name="manager-list"),
    path('api/managers/<int:pk>/', api_views.manager_detail, name="manager-detail"),
    path('api/managers/create/', api_views.manager_create, name="manager-create"),
    path('api/managers/update/<int:pk>/', api_views.manager_update, name="manager-update"),
    path('api/managers/delete/<int:pk>/', api_views.manager_delete, name="manager-delete"),
    
    # TeamMember endpoints
    path('api/team-members/', api_views.team_member_list, name="team-member-list"),
    path('api/team-members/<int:pk>/', api_views.team_member_detail, name="team-member-detail"),
    path('api/team-members/create/', api_views.team_member_create, name="team-member-create"),
    path('api/team-members/update/<int:pk>/', api_views.team_member_update, name="team-member-update"),
    path('api/team-members/delete/<int:pk>/', api_views.team_member_delete, name="team-member-delete"),
    
    # Project endpoints
    path('api/projects/', api_views.project_list, name="project-list"),
    path('api/projects/<int:pk>/', api_views.project_detail, name="project-detail"),
    path('api/projects/create/', api_views.project_create, name="project-create"),
    path('api/projects/update/<int:pk>/', api_views.project_update, name="project-update"),
    path('api/projects/delete/<int:pk>/', api_views.project_delete, name="project-delete"),
    
    # Task endpoints
    path('api/tasks/', api_views.task_list, name="task-list"),
    path('api/tasks/<int:pk>/', api_views.task_detail, name="task-detail"),
    path('api/tasks/create/', api_views.task_create, name="task-create"),
    path('api/tasks/update/<int:pk>/', api_views.task_update, name="task-update"),
    path('api/tasks/delete/<int:pk>/', api_views.task_delete, name="task-delete"),
    
    # ProjectTeamMember endpoints
    path('api/project-team-members/', api_views.project_team_member_list, name="project-team-member-list"),
    path('api/project-team-members/project/<int:project_id>/', api_views.project_team_members_by_project, name="project-team-members-by-project"),
    path('api/project-team-members/create/', api_views.project_team_member_create, name="project-team-member-create"),
    path('api/project-team-members/bulk-create/', api_views.project_team_member_bulk_create, name="project-team-member-bulk-create"),
    path('api/project-team-members/delete/<int:pk>/', api_views.project_team_member_delete, name="project-team-member-delete"),
    
    # Authentication endpoints
    path('api/admin/login/', auth_views.admin_login, name="admin-login"),
    path('api/manager/login/', auth_views.manager_login, name="manager-login"),
    path('api/team-member/login/', auth_views.team_member_login, name="team-member-login"),
]
