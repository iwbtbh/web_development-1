from django.db import models
from drawingManageApp.models import * 
from django.db.models import Q
from django.http import HttpResponse
import json


def DrawingSearch(keywords):
    # Parse Keywords, print info on server 
    # Pass dictionary to filter  
    searchInput = keywords.GET.get("text")
    keys = searchInput.split(",")
    D = dict()
    for i in xrange(len(keys)):
        if ":" not in keys[i]:
            print "The keyword #" + str(i + 1) + " only has a value " + keys[i]
            D["attributeValue"] = keys[i] 
        else:
            keyValuePair = keys[i].split(":") 
            if keyValuePair[1] != "":
                key = keyValuePair[0]
                value = keyValuePair[1]
                if "[" in value and "]" in value and "-" in value:              
                    value = value[1:-1]
                    value = value.split("-")
                    D[key] = value
                    print ("The keyword #" + str(i + 1) + " uses attribute name " + key + 
                           ", and has a range value with low boundary " + value[0] + 
                            " and upper boundary " + value[1])
                else:
                    print ("The keyword #" + str(i + 1) + " uses attribute name " + key + 
                           ", and has a value " + value)
                    D[key] = value
    return filter(D)

def filter(D): 
    # Filiter drawings using the given dictionary
    # pass all drawing to send VIEW
    all_drawings = Drawing.objects.all() 
    for key in D.keys():
        v = D[key] 
        if key == "ConstructedYear":
            lower = int(v[0])
            upper = int(v[1])
            all_drawings = all_drawings.filter(ConstructedYear__gte = lower) 
            all_drawings = all_drawings.filter(ConstructedYear__lte = upper) 
        elif key == "attributeValue":
            all_drawings = all_drawings.filter(Q(DrawingID__contains = v) | 
                                               Q(BuildingName__contains = v) | 
                                               Q(ConstructedYear__contains = v) |
                                               Q(Contractor__contains = v) | 
                                               Q(Floor__contains = v) | 
                                               Q(Shop__contains = v))
        else:
            # key needs to match exactly
            if key == "DrawingID":
                all_drawings = all_drawings.filter(DrawingID__contains = v) 
            elif key == "BuildingName":
                all_drawings = all_drawings.filter(BuildingName__contains = v) 
            elif key == "Contractor":
                all_drawings = all_drawings.filter(Contractor__contains = v)
            elif key == "Floor":
                all_drawings = all_drawings.filter(Floor__contains = v)
            elif key == "Shop":
                all_drawings = all_drawings.filter(Shop__contains = v)
    return send(all_drawings) 

def send(all_drawings):
    # use filtered drawings to create a string object to pass in via JSON
    # send to viewer
    try: 
        result = ''
        for drawing in all_drawings:
            result = result + drawing.DrawingID+","
            result = result + drawing.BuildingName+","
            result = result + str(drawing.ConstructedYear)+","
            result = result + drawing.Contractor+","
            result = result + drawing.Floor+","
            result = result + drawing.Shop+";"
        result = result[:-1]
        if result != "":
            jsonText = json.dumps(result) 
            return HttpResponse(jsonText)
        else:
            result = "'No Search Result,Don't,Sweat,The,Small,Stuff"
            return HttpResponse(result)
    except:
        return HttpResponse("Failed")










