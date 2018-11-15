from django.urls import path

from . import views

urlpatterns = [
    path(r'', view=views.index, name='index'),
    path(r'query', view=views.run_query, name='query'),
    path(r'status', view=views.get_status, name='status'),
]