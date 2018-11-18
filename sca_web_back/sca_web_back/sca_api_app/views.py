from django.shortcuts import render
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
from .neo_utilities import run_cypher_query, get_nodes_count


CUSTOM_QUERY_REQUEST_PARAMETER = "query"


def getErrorResponce(err):
    return {"error": err}


def default_exception_handler(func):
    def wrapped(*args, **kwargs):
        try:
            return func(*args ,**kwargs)
        except Exception:
            return Response(getErrorResponce("PARDON MOI, inner error"), status=HTTP_500_INTERNAL_SERVER_ERROR)


class CustomQueryView(APIView):
    renderer_classes = (JSONRenderer,)

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

    def get(self, request):
        try:
            result = get_nodes_count()
        except Exception:
            return Response(getErrorResponce("internal error"), status=HTTP_500_INTERNAL_SERVER_ERROR)
        print("result:", result)
        return Response({"count": result})


class IndexView(APIView):
    renderer_classes = (JSONRenderer, )

    def get(self, request):
        return Response({"hello": "world! API server is alive"})