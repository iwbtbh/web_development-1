function Drawing(id,bn,year,con,floor, shop)
{
    this.DrawingID = id;
    this.BuildingName = bn;
    this.ConstructedYear = year;
    this.Contractor = con;
    this.Floor = floor;
    this.Shop = shop;
}

var drawings = [];

function initDrawings()
{
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function()
    {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            var data = xhttp.responseText;
            var drawingStrings = data.split(";");

            for(var i=0;i<drawingStrings.length;i++)
            {
                var drawingString = drawingStrings[i];
                var attributeStrings = drawingString.split(",");
                var newDrawing = new Drawing(attributeStrings[0], attributeStrings[1], attributeStrings[2], attributeStrings[3], attributeStrings[4], attributeStrings[5]);
                drawings.push(newDrawing);

            }
            alert("A total of "+drawings.length+" drawings are added to the array.");
        }

    }

    xhttp.open("GET", "/loadDrawings/",true);
    xhttp.send();
}


function addDrawingInfoToList()
{
    if(drawings.length == 0)
    {
        alert("Please load the initial drawings to the array first.");
        return;
    }
    var HTMLDrawingList = document.getElementById("DrawingIDList");
    HTMLDrawingList.innerHTML = "";
    for(var i=0;i<drawings.length;i++)
    {
        var newOption = document.createElement("option");
        if (drawings[i].DrawingID != "") {
            newOption.innerText = drawings[i].DrawingID;
            newOption.value = i;
            HTMLDrawingList.appendChild(newOption);
        } 
    }
    alert("A total of "+drawings.length+" drawings are added to the HTML list.");

}


function drawingInfoListChange()
{
    var HTMLDrawingList = document.getElementById("DrawingIDList");
    var drawingIndex = HTMLDrawingList.selectedIndex;
    var selectedDrawing = drawings[drawingIndex];
    var buildingNameText = document.getElementById("buildingNameInput");
    buildingNameText.value = selectedDrawing.BuildingName;

    document.getElementById("constructedYearInput").value = selectedDrawing.ConstructedYear;
    document.getElementById("contractorInput").value = selectedDrawing.Contractor;
    document.getElementById("floorInput").value = selectedDrawing.Floor;

    if(selectedDrawing.Shop != undefined)
        document.getElementById("shopInput").value = selectedDrawing.Shop;
    else
        document.getElementById("shopInput").value = "";

}

function addDrawing()
{
    var newID = prompt("Please enter a new ID for the drawing");
    if(newID == undefined)
    {
        alert("Please enter the new ID.");
        return;
    }
    for(var i=0;i<drawings.length;i++)
    {
        if(drawings[i].DrawingID == newID)
        {
            alert("This ID exists.");
            return;
        }
    }
    var buildingNameText = document.getElementById("buildingNameInput").value;
    var constructedYearText = document.getElementById("constructedYearInput").value;
    var contractorText = document.getElementById("contractorInput").value;
    var floorText = document.getElementById("floorInput").value;
    var shopText = document.getElementById("shopInput").value;

    var newDrawing = new Drawing(newID, buildingNameText,constructedYearText,
        contractorText,floorText);
    newDrawing.Shop = shopText;
    drawings.push(newDrawing);
    addDrawingInfoToList();

    // Send data to database.
     var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function()
    {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            console.log(xhttp.responseText);
        }
    };
    var sendParameters = "?DrawingID="+newID+"&BuildingName="+buildingNameText
    +"&ConstructedYear="+constructedYearText+"&Contractor="+contractorText+"&Floor="+
            floorText+"&Shop="+shopText;
    xhttp.open("GET", "/addDrawing/" + sendParameters,true);
    xhttp.send();
}

function updateDrawing()
{
    var HTMLDrawingList = document.getElementById("DrawingIDList");
    var drawingIndex = HTMLDrawingList.selectedIndex;
    var selectedDrawing = drawings[drawingIndex];

    selectedDrawing.BuildingName = document.getElementById("buildingNameInput").value;
    selectedDrawing.ConstructedYear = document.getElementById("constructedYearInput").value;
    selectedDrawing.Contractor = document.getElementById("contractorInput").value;
    selectedDrawing.Floor = document.getElementById("floorInput").value;
    selectedDrawing.Shop = document.getElementById("shopInput").value;

    drawings[drawingIndex] = selectedDrawing;

    // Send data to database.
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function()
    {
        if(xhttp.readyState == 4 && xhttp.status == 200)
        {
            console.log(xhttp.responseText);
        }
    };

    var sendParameters = "?DrawingID="+selectedDrawing.DrawingID+"&BuildingName="+selectedDrawing.BuildingName
    +"&ConstructedYear="+selectedDrawing.ConstructedYear+"&Contractor="+selectedDrawing.Contractor+"&Floor="+
            selectedDrawing.Floor+"&Shop="+selectedDrawing.Shop;


    xhttp.open("GET", "/updateDrawing/"+sendParameters,true);
    xhttp.send();
}

function deleteDrawing()
{
    var HTMLDrawingList = document.getElementById("DrawingIDList");
    var drawingIndex = HTMLDrawingList.selectedIndex;
    drawings.splice(drawingIndex,1);
    addDrawingInfoToList();
    drawingInfoListChange();
}

function searchInputChange(){
    var x = document.getElementById("searchInput");
    drawings = [];
    if (x.value != "") 
    {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState == 4 && xhttp.status == 200)
            {
                var data = xhttp.responseText;
                var drawingStrings = data.split(";");                
                for (var i=0; i < drawingStrings.length; i++)
                {
                    var drawingString = drawingStrings[i];
                    var attributeStrings = drawingString.split(",");
                    if (i == 0) {
                        attributeStrings[0] = attributeStrings[0].substr(1);
                    }
                    if (i == drawingStrings.length - 1) {
                        attributeStrings[5] = attributeStrings[5].substr(0, attributeStrings[5].length - 1);
                    }
                    var newDrawing = new Drawing(attributeStrings[0], attributeStrings[1], attributeStrings[2], attributeStrings[3], attributeStrings[4], attributeStrings[5]);
                    drawings.push(newDrawing);
                }
                var HTMLDrawingList = document.getElementById("DrawingIDList");
                HTMLDrawingList.innerHTML = "";
                for(var i = 0; i < drawings.length; i++)
                {
                    var newOption = document.createElement("option");
                    newOption.innerText = drawings[i].DrawingID;
                    newOption.value = i;
                    HTMLDrawingList.appendChild(newOption);
                    drawingInfoListChange();
                };
            };
        };
        var sendParameters = "?text=" + x.value;
        xhttp.open("GET", "/searchDrawing/" + sendParameters, true);
        xhttp.send();
    }
}





