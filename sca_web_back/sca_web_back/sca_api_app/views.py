import json

from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from py2neo import GraphError
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_404_NOT_FOUND, HTTP_200_OK
from .neo_querier import NeoQuerier

CUSTOM_QUERY_REQUEST_PARAMETER = "query"


def getErrorResponce(err):
    return {"error": err}


class CustomQueryView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (IsAdminUser,)

    def get(self, request):
        # there should be request filtering(maybe using decorator) :))
        if not request.query_params.get(CUSTOM_QUERY_REQUEST_PARAMETER):
            return Response(getErrorResponce("No query provided"), status=HTTP_400_BAD_REQUEST)
        try:
            result = NeoQuerier().run_cypher_query(request.query_params[CUSTOM_QUERY_REQUEST_PARAMETER])
            return Response(result)
        except SyntaxError as e:
            return Response(getErrorResponce(e.msg), status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(getErrorResponce(str(e)), status=HTTP_400_BAD_REQUEST)


class GetStatusView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (IsAdminUser,)

    def get(self, request):
        try:
            nodes_count = NeoQuerier().get_nodes_count()
            authors_count = NeoQuerier().get_nodes_count(NeoQuerier.AUTHOR_NODE_LABEL)
            publications_count = NeoQuerier().get_nodes_count(NeoQuerier.PUBLICATION_NODE_LABEL)
        except Exception:
            return Response(getErrorResponce("internal error"), status=HTTP_500_INTERNAL_SERVER_ERROR)
        print("result:", nodes_count)
        return Response({"nodesCount": nodes_count, "authorsCount": authors_count, "publicationsCount": publications_count})

class AuthoritiesQueryView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        domains_list = request.query_params.getlist('domain')
        if domains_list is None\
                or len(domains_list) == 0:
            return Response(getErrorResponce("empty query"), status=HTTP_400_BAD_REQUEST);
        try:
            result = NeoQuerier().get_authorities_in_domains(domains_list)
            return Response(result)
        except GraphError as e:
            return Response(getErrorResponce(str(e)), status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(getErrorResponce("internal error"), status=HTTP_500_INTERNAL_SERVER_ERROR)


class AuthorWithPublicationsInDomainsQuery(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        domains_list = request.query_params.getlist('domain')
        author_name = request.query_params.get('author')
        if domains_list is None\
                or len(domains_list) == 0 \
                or author_name is None \
                or author_name == "":
            return Response(getErrorResponce("empty query"), status=HTTP_400_BAD_REQUEST)

        try:
            result = NeoQuerier().get_author_with_publications_in_domais(author_name, domains_list)
            return Response(result)
        except GraphError as e:
            return Response(getErrorResponce(str(e)), status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(getErrorResponce("internal error"), status=HTTP_500_INTERNAL_SERVER_ERROR)


class ArticlesQueryView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        keys_list = request.query_params.getlist('keyword')

        if keys_list is None or len(keys_list) == 0:
            return Response(getErrorResponce("empty query"), status=HTTP_400_BAD_REQUEST)
        
        try:
            result = NeoQuerier().get_articles_by_keywords(keys_list)
            return Response(result)
        except GraphError as e:
            return Response(getErrorResponce(str(e)), status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(getErrorResponce("internal error"), status=HTTP_500_INTERNAL_SERVER_ERROR)


class PopularDomainsQueryView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        POPULARITY_INDEX = 200 # hardcoded index AAAAAAAAAAAAAAAAAA
        wanted_popularity = request.query_params.get('popularity')
        try:
            if wanted_popularity == 'nascent':
                result = NeoQuerier().get_domains_by_popularity_index(POPULARITY_INDEX, higher=True)
            else:
                result = NeoQuerier().get_domains_by_popularity_index(POPULARITY_INDEX, higher=False)
            return Response(result)
        except GraphError as e:
            return Response(getErrorResponce(str(e)), status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(getErrorResponce("internal error"), status=HTTP_500_INTERNAL_SERVER_ERROR)


class IndexView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (AllowAny,)

    def get(self, request):
        return Response({"hello": "world! API server is alive"})


@csrf_exempt
@api_view(['POST'])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                        status=HTTP_404_NOT_FOUND)
    token, _ = Token.objects.get_or_create(user=user)

    return Response({'token': token.key, 'is_admin': user.is_superuser},
                    status=HTTP_200_OK)
