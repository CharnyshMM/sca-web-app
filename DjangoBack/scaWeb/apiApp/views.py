from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponseBadRequest
from py2neo import CypherSyntaxError
from . import response_objects

from . import neo_utilities

def index(request):
    return JsonResponse({'hello': 'world!'})


def get_status(request):
    try:
        return JsonResponse({'count': neo_utilities.get_nodes_count()})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def run_query(request):
    query = request.GET.get("query")
    if query is not None:
        try:
            return JsonResponse(neo_utilities.run_query(query), safe=False)
        except CypherSyntaxError as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "bad query"})

# Create your views here.
