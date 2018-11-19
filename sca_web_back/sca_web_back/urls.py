"""sca_web_back URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from .sca_api_app.views import CustomQueryView, \
    GetStatusView, \
    IndexView, \
    login, \
    AuthoritiesQueryView, \
    ArticlesQueryView, \
    PopularDomainsQueryView

urlpatterns = [
    path('', view=IndexView.as_view(), name="index"),
    path('login/', view=login, name="login"),
    path('admin/', admin.site.urls),

    path('query/', view=CustomQueryView.as_view(), name='query'),
    path('query/authorities/', view=AuthoritiesQueryView.as_view(), name='authorities_query'),
    path('query/articles/', view=ArticlesQueryView.as_view(), name='articles_query'),
    path('query/domains_popularity/', view=PopularDomainsQueryView.as_view(), name='domains_popularity_query'),

    path('status/', view=GetStatusView.as_view(), name="status"),
]
