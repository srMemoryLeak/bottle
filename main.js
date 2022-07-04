
function add(id){
    surface = document.getElementById(id)
    //console.log(id);
    var height = surface.style.height
    var cur = parseInt(height.substring(0,height.length-1)); 
    if(isNaN(cur))cur=28;
    console.log(cur);
    cur += 10;
    if(cur>100)cur=26;
    if(cur>=80)cur=98;
    surface.style.height = cur+"%";
}

function changeColor(color){
    surface = document.getElementsByClassName("surface");
    for(var i=0;i<surface.length;i++){
        s = surface[i];
        s.style.backgroundColor=color;
    }
}

function screenshot(){
    img = document.getElementById("img");
    var w = img.offsetWidth;
    var h = img.offsetHeight;
    html2canvas(img,{width : w,height : h,tainttest : true,allowTaint: true,useCORS:true}).then(function(canvas) {
        url = canvas.toDataURL("image/png");// 
        //以下代码为下载此图片功能 

        var triggerDownload = document.createElement("a");
        triggerDownload.setAttribute("href",url);
        triggerDownload.setAttribute("download", "img.png");
        
        document.body.appendChild(triggerDownload);

        triggerDownload.click(); 
        triggerDownload.remove();
    });
}

function fill(){
    lastcaption = document.getElementById("lastcaption");
    var str = prompt("请填写这个瓶子吧~");
    if(str.length==0){
        str="(______)"
    }
    lastcaption.innerText = str;
}

function addColor(){
    colorList=[
        //blue
        "navy",
        "DarkBlue ",
        "royalblue",
        "SlateBlue",
        "steelblue",
        "lightskyblue",
        "LightSteelBlue",
        "PaleTurquoise",
        "aqua",
        "DarkSlateGray",
        //green
        "aquamarine",
        "LightSeaGreen",
        "lightgreen",
        "olivedrab",
        "LightGreen",
        "SeaGreen",
        "Teal",
        "YellowGreen",
        "LimeGreen",
        "Green",
        //other
        "coral",
        "darkorange",
        "firebrick",
        "indianred",
        "Salmon",
        "BurlyWood",
        "Khaki ",
        "PaleVioletRed",
        "Plum",
        "pink",
    ]
    var row_cnt=10;
    var curList=null;
    for(var i=0;i<colorList.length;i++){
        if(i%row_cnt==0){
            curList = document.createElement("tr");
            curList.setAttribute("height","50px");
            document.getElementById("colorlist_tbody").appendChild(curList)
        }
        var color = colorList[i];
        colortd = document.createElement("td");
        colorbox = document.createElement("div");
        colortd.appendChild(colorbox)
        colorbox.setAttribute("class","colorbox");
        colorbox.setAttribute("style","background-color:"+color);
        colorbox.setAttribute("onclick","changeColor('"+color+"');");
        curList.appendChild(colortd);
    }

}


window.onload = function(){
    loadingbox = document.getElementById("loadingblock");
    loadingbox.remove();
    addColor();
}
