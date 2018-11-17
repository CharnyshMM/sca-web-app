from django.shortcuts import render
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_400_BAD_REQUEST
from .neo_utilities import run_cypher_query


CUSTOM_QUERY_REQUEST_PARAMETER = "query"
def getErrorResponce(err):
    return {"error": err}

class custom_query_view(APIView):
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

# Create your views here.
