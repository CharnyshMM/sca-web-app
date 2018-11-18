
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_404_NOT_FOUND, HTTP_200_OK
from .neo_utilities import run_cypher_query, get_nodes_count


CUSTOM_QUERY_REQUEST_PARAMETER = "query"


def getErrorResponce(err):
    return {"error": err}


class CustomQueryView(APIView):
    renderer_classes = (JSONRenderer,)
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        # there should be request filtering(maybe using decorator)
        if not request.query_params.get(CUSTOM_QUERY_REQUEST_PARAMETER):
            return Response(getErrorResponce("No query provided"), status=HTTP_400_BAD_REQUEST)
        try:
            result = run_cypher_query(request.query_params[CUSTOM_QUERY_REQUEST_PARAMETER])
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
            result = get_nodes_count()
        except Exception:
            return Response(getErrorResponce("internal error"), status=HTTP_500_INTERNAL_SERVER_ERROR)
        print("result:", result)
        return Response({"count": result})


class IndexView(APIView):
    renderer_classes = (JSONRenderer, )
    permission_classes = (AllowAny, )

    def get(self, request):
        return Response({"hello": "world! API server is alive"})


@csrf_exempt
@api_view
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
    return Response({'token': token.key},
                    status=HTTP_200_OK)
