from django.shortcuts import render
from django.http import HttpResponse
from search import *

def searchDrawing(request):
    try:
        searchInput = request.GET.get("text")
        return HttpResponse(DrawingSearch(searchInput))
    except:
        return HttpResponse("Failed")


    