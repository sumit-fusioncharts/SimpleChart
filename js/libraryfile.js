
function Multivariant(chartdata) {
    this.Chartdata = chartdata;
    this.separator = (chartdata.chartinfo.dataseparator === "") ? "|" : chartdata.chartinfo.dataseparator;
    this.svgWidth = (chartdata.chartinfo.width === '') ? "300" : chartdata.chartinfo.width;
    this.svgHeight = (chartdata.chartinfo.height === '') ? "400" : chartdata.chartinfo.height;
    this.chartHeight = this.svgHeight-100;
    this.chartWidth = this.svgWidth-60;
    this.graphData = chartdata.dataset;
    this.noOfGraphs = this.graphData.length;
    this.xaxisticksNames = (chartdata.timestamp.time).split(this.separator);
    this.xaxisticks = this.xaxisticksNames.length;
    xlen = this.xaxisticks;
    this.textColor = "#000";
    this.fontSize=17;
    this.marginxy = 50;
    this.yaxisticks =5;
    this.divId=document.getElementById(chartdata.chartinfo.divId);
    this.chartType = chartdata.chartinfo.chartType;
    this.marginLeft = 30;
    this.noOfGraphPlotted  = Number(((window.innerWidth/this.svgWidth).toString()).split(".")[0]);
};
var xCoor = [];
var xlen;
Multivariant.prototype.rearrange = function(operation){
  var sum=[],newsum=[],index=[],x=[];
  for(datai in this.graphData){
    dataArray = (this.graphData[datai].data).split(this.separator);
    dataArray = dataArray.map(function(num) {
      if(num==""){return 0;}
      else return Number(num);
    });
    sum.push(dataArray.reduce(add, 0)/dataArray.length);
  }
  for(i=0;i<sum.length;i++){
   x[i]=sum[i];
  }
  //console.log(x);
  function add(a, b){
    return a+b;
  }
  function maxtomin(a,b){
    return b-a;
  }
  function mintomax(a,b){
    return a-b;
  }
  if(operation=="mintomax"){
    newsum = sum.sort(mintomax);
  }
  else if(operation=="maxtomin"){
    newsum = sum.sort(maxtomin);
  }else if(operation=="normal"){
    newsum = sum;
  }

  for(var i=0;i<newsum.length;i++){
    var j=0;
    while(j<x.length){
      if(newsum[i]==x[j]){
        index.push(j);
       }
      j++;
    }
  }
  return(index);
}
Multivariant.prototype.render = function(){
   var url = "http://www.w3.org/2000/svg",dataArray,maxminArray,newmin,newmax,limits,calculationX,calculationY;
   var divisionX,divisiony,plotRatio,datasetStr="",ycord,xcord,y,barHight;
   this.createCaption(url);
   var rea = this.rearrange(this.Chartdata.chartinfo.chartsPositioning);
   console.log(rea);
   for(datai in this.graphData){
      xCoor[datai]=[];
      dataArray = (this.graphData[rea[datai]].data).split(this.separator);
      var dataArrayLen=dataArray.length;
      maxminArray = this.calculateMaxMin(dataArray);//returning Max And Min Array
      if(maxminArray[0]==maxminArray[1]){
         newmin = maxminArray[0]-10; newmax = maxminArray[0]+10;
      }else{
         limits = this.genLimits(maxminArray[0],maxminArray[1]);
         newmax = limits[0]; newmin = limits[1];
      }
      this.yaxisticks= this.calPicks(Number(limits[0]),Number(limits[1]));
      
      //console.log(newmin+" "+newmax);
      //we have data we have upper nad lower bound
      //now user will decide line chart or column chart

      
      divisiony = (this.chartHeight) / this.yaxisticks;
      plotRatio = this.chartHeight/(newmax-newmin);   
      var svgGraph = this.createSvg(url,this.svgWidth,this.svgHeight,"svgGraph","svgGraphClass",this.divId);
  

         for(i=0;i<=this.yaxisticks;i++){
            calculationY =(Number(divisiony)*i)+this.marginxy;
            if(i%2!=0 && i!=yaxisticks){
              //this.marginxy-5,this.marginxy-5,this.chartHeight+10,this.chartWidth-this.marginxy+10,
              this.createRect(url,svgGraph,this.marginxy-5,calculationY,divisiony,this.chartWidth-this.marginxy+10,"svgsRect","svGrectClass");                        
            }
                    var titleY =(newmax - (((newmax-newmin)/yaxisticks)*i));
                    if(titleY%1!=0){
                        titleY = titleY.toFixed(2);
                    }
                    var titleY_0 = titleY.toString().split(".")[0];
                    if (titleY_0.substring(0, 1) == '-') {
                      titleY_0 = Number(titleY_0.substring(1));
                      if (titleY_0 > 999 && titleY_0 < 999999) {
                        titleY = "-"+(titleY_0 / 1000).toFixed(1) + "K";
                      } else if (titleY_0 > 999999) {
                        titleY = "-"+(titleY_0 / 1000000).toFixed(1) + "M";
                      }
                    } else {
                      if (titleY_0 > 999 && titleY_0 < 999999) {
                        titleY = (titleY_0 / 1000).toFixed(1) + "K";
                      } else if (titleY_0 > 999999) {
                        titleY = (titleY_0 / 1000000).toFixed(1) + "M";
                      }
                    }
            this.createText(url,svgGraph,(this.marginxy-15),(calculationY+5),titleY,"#145255",11,'end',"yaxisticks");
            this.createLines(url,svgGraph,(this.marginxy-10),(calculationY),(this.marginxy-5),(calculationY),"yaxisticks","yaxisticks");                       
         }
      this.createRect(url,svgGraph,this.marginxy-5,2,35,this.chartWidth-this.marginxy+10,"graphTop","graphTopClass");
      this.createRect(url,svgGraph,this.marginxy-5,this.marginxy-5,this.chartHeight+10,this.chartWidth-this.marginxy+10,"axisRect","axisRectClass");
      this.createText(url,svgGraph,(this.chartWidth)/2+this.marginxy,25,this.Chartdata.dataset[datai].title,"#000",16,"middle","mainCaptionText");

      if(this.chartType=="line"){//line chart
        divisionX = (this.chartWidth) / (this.xaxisticks-1);
        if(datai>=(this.graphData.length-this.noOfGraphPlotted)){
        for(i=0;i<this.xaxisticks;i++){
          calculationX = divisionX*i+this.marginxy;
          this.createText(url,svgGraph,(calculationX),(this.chartHeight+this.marginxy+30),this.xaxisticksNames[i],"#000",11,"middle","xaxisticksNames");
        }
      } 
         for(var i=0;i<dataArrayLen;i++){
            
            if(typeof dataArray[i]!="undefined" && dataArray[i]!=""){
                y = Number(dataArray[i]);
                xcord= (divisionX*i)+this.marginxy;
                ycord = (this.chartHeight - ((y-newmin)*plotRatio))+this.marginxy;             
                datasetStr += xcord+","+ycord+" ";
                xCoor[datai][i]=[];
                xCoor[datai][i][0]=[xcord];
                xCoor[datai][i][1]=[ycord];
                xCoor[datai][i][2]=[y];
            }
         }//successfully displaying Data String for plotting
         //console.log(Multivariant.xCoor);
         for(i=0;i<this.xaxisticks;i++){
            this.createLines(url,svgGraph,(divisionX*i+this.marginxy),(this.chartHeight+5+this.marginxy),(divisionX*i+this.marginxy),(this.chartHeight+5+this.marginxy+5),"xaxisticks","xaxisticksClass");
         }        

         this.createPoly(url,svgGraph,datasetStr);

         var xy = datasetStr.split(" ");
         var xyCor,xyCorlen = xy.length-1;
         for(i=0;i<xyCorlen;i++){
            xyCor = xy[i].split(',');
            this.createeCirles(url,svgGraph,xyCor[0],xyCor[1],5);
            //url,svg,x1,y1,x2,y2,classname,lineId
         }   
      this.createLines(url,svgGraph,(this.marginxy-5),(this.marginxy-5),(this.marginxy-5),(this.chartHeight+5+this.marginxy),"crosshair","crosshair");    
      this.createRect(url,svgGraph,this.marginxy-5,this.marginxy-5,this.chartHeight+10,this.chartWidth-this.marginxy+10,"svgRect","svgCrosshairRect");
      }else{
      //column chart
      divisionX = (this.chartWidth) / (this.xaxisticks);
      for(i=0;i<this.xaxisticks+1;i++){
        this.createLines(url,svgGraph,(divisionX*i+this.marginxy),(this.chartHeight+5+this.marginxy),(divisionX*i+this.marginxy),(this.chartHeight+5+this.marginxy+5),"xaxisticks","xaxisticksClass");
      }
      if(datai>=(this.graphData.length-this.noOfGraphPlotted)){
        for(i=0;i<this.xaxisticks;i++){
          calculationX = divisionX*i+this.marginxy+divisionX/2;
          this.createText(url,svgGraph,(calculationX),(this.chartHeight+this.marginxy+30),this.xaxisticksNames[i],"#000",11,"middle","xaxisticksNames");
        }        
      }
        
      for(var i=0;i<dataArrayLen;i++){
        if(typeof dataArray[i]!="undefined" && dataArray[i]!=""){
                y = Number(dataArray[i]);
                xcord= (divisionX*i)+this.marginxy+5;
                barHight = ((y-newmin)*plotRatio); 
                ycord = (this.chartHeight - barHight+this.marginxy);             
                //console.log(xcord+" "+ycord+" "+barHight+" "+divisionX);

                //xCoor[datai][i]=[];
                //xCoor[datai][i][0]=[xcord];
                //xCoor[datai][i][1]=[ycord];
                //xCoor[datai][i][2]=[y];

                if(barHight<1){barHight=2;ycord=ycord-2;}
                this.createRect(url,svgGraph,xcord,ycord,barHight,divisionX-60,"columnRect","columnRectClass",y,datai+","+i+"");
            }
         }//successfully displaying Data String
      }
      //common rect,tooltip
      this.createRect(url,svgGraph,-90,-90,30,40,"tootltiprect","tootltiprect");
      this.createText(url,svgGraph,-90,-90,"",'rgb(22,77,96)',12,"middle","uppertext");
 
      datasetStr="";
   }//end of the graphs
}

Multivariant.prototype.calculateMaxMin = function(data){
   var max,min,j,temp;
      min = Number(data[0]);
      max=min;
      j = data.length;
      while(j>=0){
         temp = Number(data[j]);
         if(temp>max && typeof temp!="undefined" && temp!=""){max=temp;}
         if(temp<min && typeof temp!="undefined" && temp!=""){min=temp;} 
         j--;
      }
      return [max,min];
}
Multivariant.prototype.createCaption = function(url) {
   var svg = this.createSvg(url,'100%','50px',"svgCaption","svgCaptionClass",this.divId);
   this.createText(url,svg,'50%',20,this.Chartdata.chartinfo.caption,"#000",22,"middle","BigCaptionText");
   this.createText(url,svg,'50%',40,this.Chartdata.chartinfo.subCaption,"#717171",16,"middle","CaptionText");
};
Multivariant.prototype.createSvg = function(url,svgW,svgH,svgId,svgClass,svgAppend){
   var svg = document.createElementNS(url, "svg");
       svg.setAttribute('width',svgW);
       svg.setAttribute('height',svgH);
       svg.setAttribute('id',svgId);
       svg.setAttribute("class",svgClass);
   svgAppend.appendChild(svg);
   if(svgId=="svgGraph"){
    svg.addEventListener("mousedown",function(event){
      initDrag(event,svg);
    },false)
   }
   return svg;
}
function initDrag(event,svg){
  var startX = event.clientX;
  var startY = event.clientY;
  var dragable = document.createElement('div');
  dragable.className = 'dragableDiv';
  dragable.style.top = startY+"px";
  dragable.style.left = startX+"px";
  document.body.appendChild(dragable);
  //console.log(startX+" "+startY);
  svg.addEventListener("mousemove",function(e){
    dragdiv(e,dragable,startX,startY);
  });
  svg.addEventListener("mouseup",function(e){
    stopDrag(e,svg);
  });
}
function stopDrag(e,svg){
      //svg.removeEventListener('mousemove', dragdiv, false); 
      //svg.onmouseup=null;
}
function dragdiv(e,d,x,y){
  d.style.width = (e.pageX-x)+"px";
  d.style.height = (e.pageY-y)+"px";
  //console.log(d.width);
}
Multivariant.prototype.createText = function(url,svg,x,y,textVal,textColor,fontSize,pos,textClass){
        var newText = document.createElementNS(url,"text");
            svg.appendChild(newText);
            newText.setAttributeNS(null,"x",x);   
            newText.setAttributeNS(null,"y",y);
            newText.setAttributeNS(null,"class",textClass); 
            newText.setAttributeNS(null,"font-size",fontSize+"px");
            newText.setAttributeNS(null,"text-anchor",pos);
            newText.setAttributeNS(null, "fill", textColor);
            newText.innerHTML =textVal;
    };
Multivariant.prototype.createLines = function(url,svg,x1,y1,x2,y2,classname,lineId){
        var lineXY = document.createElementNS(url, "line");
            lineXY.setAttributeNS(null, "x1",x1);
            lineXY.setAttributeNS(null, "y1",y1);
            lineXY.setAttributeNS(null, "x2",x2);
            lineXY.setAttributeNS(null, "y2",y2);
            lineXY.setAttributeNS(null, "class",classname);
            lineXY.setAttributeNS(null, "id",lineId);
            if(classname=="crosshair"){
                lineXY.setAttribute("visibility","hidden");
            }
            svg.appendChild(lineXY);
    };
Multivariant.prototype.createeCirles = function(url,svg,x,y,r){
            var shape = document.createElementNS(url, "circle");
            shape.setAttributeNS(null, "cx", x);
            shape.setAttributeNS(null, "cy", y);
            shape.setAttributeNS(null, "r",  r);
            shape.setAttributeNS(null, "id",  'graphCircle');
            shape.setAttributeNS(null, "fill", "#fff");  
            svg.appendChild(shape);
    };
Multivariant.prototype.createPoly = function(url,svg,dataset){
        var shape = document.createElementNS(url, "polyline");
            shape.setAttributeNS(null, "points", dataset);
            shape.setAttributeNS(null, "class",  "svgPoly");
            svg.appendChild(shape); 
    };
Multivariant.prototype.createRect = function(url,svg,rectX,rectY,rectHeight,rectWidth,rectId,rectClass,value,i){
       var rectLeft;
       var rect = document.createElementNS(url, "rect");
            rect.setAttributeNS(null, "x", rectX);
            rect.setAttributeNS(null, "y", rectY);
            rect.setAttributeNS(null, "height", rectHeight);
            rect.setAttributeNS(null, "width", rectWidth+50);
            rect.setAttributeNS(null, "id",  rectId);
            rect.setAttributeNS(null, "class",  rectClass);
            if(typeof value!=="undefined"){
              //console.log(value);
              rect.setAttributeNS(null, "value",  value);
              rect.setAttributeNS(null, "colno",  i);
            }
            svg.appendChild(rect);
            if(rectId=="svgRect"){
                rectLeft = rect.getBoundingClientRect().left;
                rect.addEventListener("mousemove", function(event){
                  callEventlistener(event,rectLeft);
                }, false);
                rect.addEventListener("mouserollover", moveCrosshair, false);
                rect.addEventListener("mouseout", hideCrossHair, false);

            }else if(rectId=="columnRect"){
                
                rect.addEventListener("mousemove", function(event){
                  highLightRect(event,rectX,rectY,value,i);
                }, false);
                rect.addEventListener("mouserollover", highLightColumn, false);
                rect.addEventListener("mouseout", resetCol, false);
            }
            return rect;
    };
function highLightRect(event,rectX,rectY,value,i){
  var col = document.getElementsByClassName("columnRectClass");
  var colrollover = new CustomEvent("mouserollover",{
        "detail":{x:rectX,y:rectY,v:value,c:i}
        });
  for( var i=0;i<col.length;i++){
    //console.log(this.xCoor+"hi");
    if(col[i]!=event.target)
      col[i].dispatchEvent(colrollover);
    }
}
function highLightColumn(e){
  var col = document.getElementsByClassName("columnRectClass");
  var eRect = document.getElementsByClassName("tootltiprect");
  var uppertext = document.getElementsByClassName("uppertext");
  var height,width,xdisplacement;

  //console.log(e.detail.c);
  //cole= e.detail.c.split(",");
  //console.log(Number(cole[0]));

    for(var j=0;j<col.length;j++){
      //if(col[j].getAttribute("colno")==cole[1]){
        xdisplacement = col[j].getAttribute("x");
        if(e.detail.x==xdisplacement){
          col[j].style.fill = '#BC4445';
        }
    }
    // for(j=0;j<eRect.length;j++){
    //   if(j==Number(cole[0])){

    //   }
    // }


  // for( var i=0,j=0;i<col.length;i++){
  //   xdisplacement = col[i].getAttribute("x");
  //   //coln=col[i].getAttribute("colno");
  //   height = col[i].getAttribute("y");
  //    //for(var j=0;j<eRect.length;j++){
  //       if(e.detail.x==xdisplacement){
  //         col[i].style.fill = '#BC4445';
  //         if(typeof uppertext[j]!=="undefined"){
  //         uppertext[j].setAttribute("y",e.detail.y+18);
  //         eRect[j].setAttribute("y",e.detail.y);

  //         eRect[j].setAttribute("x",e.detail.x);
  //         uppertext[j].setAttribute("x",e.detail.x+45);

  //         uppertext[j].innerHTML = col[i].getAttribute("value");
          
  //     // }
  //    }//end of if
  //    j++;
  //  }//end of for 
  // }
}
function resetCol(e){
  var col = document.getElementsByClassName("columnRectClass");
  for( var i=0;i<col.length;i++){
    col[i].style.fill = "#1E7ACD";
  }
}
function callEventlistener(event,rectLeft){
  var cArr = document.getElementsByClassName("svgCrosshairRect");
  var rollover = new CustomEvent("mouserollover",{
      "detail":{x:event.clientX,y:event.clientY, left:rectLeft}
    });
    for( var i=0;i<cArr.length;i++){
      if(cArr[i]!=event.target)
       cArr[i].dispatchEvent(rollover);
  }
}
 
function moveCrosshair(e){
        var x = e.detail.x-e.detail.left-8;
        var yT1,xT1,cdata,CtopX1,CtopX2,CtopY2,yT;
        var elements = document.getElementsByClassName("crosshair");
        var eRect = document.getElementsByClassName("tootltiprect");
        var uppertext = document.getElementsByClassName("uppertext");
        var crosshair = document.getElementsByClassName("crosshair");
        var svgRect = document.getElementsByClassName("svgCrosshairRect"),i,j;
        //Y = ( ( X - X1 )( Y2 - Y1) / ( X2 - X1) ) + Y1
        //console.log(eRect.length);
        for(i = 0; i<elements.length; i++){
            elements[i].setAttribute("visibility","visible");
            elements[i].setAttribute("x1",x+53);
            elements[i].setAttribute("x2",x+53);
            

            CtopY2=crosshair[i].getAttribute("y2");
            CtopX2=svgRect[i].getAttribute("width");

          for(j=0;j<7;j++){
            if(typeof xCoor[i][j]!=="undefined"){
              yT = xCoor[i][j][1];
              xT = xCoor[i][j][0];
              
               if(xCoor[i][j][0]<=(x+58) && xCoor[i][j][0]>=(x+50)){
                
                uppertext[i].setAttribute("visibility","visible");
                eRect[i].setAttribute("visibility","visible");
                   
                   //console.log("found"+xT+" "+yT);
                   uppertext[i].setAttribute("y",yT-20);
                   eRect[i].setAttribute("y",yT-40);

                   eRect[i].setAttribute("x",xT-100);
                   uppertext[i].setAttribute("x",xT-55);

                   uppertext[i].innerHTML=xCoor[i][j][2];
               }
              }
              // else{
              // eRect[i].setAttribute("visibility","hidden");
              // uppertext[i].setAttribute("visibility","hidden");}
            }
            
            /*if(typeof xCoor[i][j]!=="undefined"){
              if(typeof xCoor[i][j]!=="undefined"  xCoor[i][j][0]-10<x && xCoor[i][j][0]+10>x){
                yT = xCoor[i][j][1];
                xT = xCoor[i][j][0];

                //yT1 = Multivariant.xCoor[i][j+1][1];
                //xT1 = Multivariant.xCoor[i][j+1][0];
                //.log(yT+","+xT+"  "+yT1+","+xT1);
                //console.log(interpolate(x,xT,yT,Multivariant.xCoor[i][j+1][0],Multivariant.xCoor[i][j+1][1]));
                //uppertext[i].setAttribute("visibility","visible");
                
                
                 if((CtopY2-60)<yT){
                    uppertext[i].setAttribute("y",yT-20);
                    eRect[i].setAttribute("y",yT-40);
                 }else{
                    uppertext[i].setAttribute("y",yT+30);
                    eRect[i].setAttribute("y",yT+10);
                 }
                 
                 if((CtopX2-80)<(x+10)){
                    eRect[i].setAttribute("x",xT-100);
                    uppertext[i].setAttribute("x",xT-55);
                 }else{
                    eRect[i].setAttribute("x",xT+10);
                    uppertext[i].setAttribute("x",xT+55);
              }  uppertext[i].innerHTML=xCoor[i][j][2];
            }
          }*/
        }
      }
function hideCrossHair(e){
        var elements = document.getElementsByClassName("crosshair");
        for(var i = 0; i<elements.length; i++){
                elements[i].setAttribute("visibility","hidden");
            }
    }
Multivariant.prototype.calPicks = function(ub,lb){
   if((ub-lb)==ub){
      yaxisticks = 4;
   }else if((ub-lb)==0){
      yaxisticks = 2;
   }else{
      if((ub/lb)<3){
         yaxisticks = 4
      }else if((ub/lb)<6){
         yaxisticks = 5;
      }else{
         yaxisticks = 6;
      }  
   }
   return yaxisticks;
}
Multivariant.prototype.genLimits = function(max,min){
        var cnt=0,negMax=false,negMin=false;//typeval solid,single
            if(max<0){negMax=true;
                   max=removeNeg(max); 
                }
            if(max%1!=0){//decimal                    
                if(max<1){
                    newmax = max.toString().split(".")[1];
                    cnt=countzeros(newmax);//counting leading zeros
                    newmax = newmax.replace(/^0+/, '');//removing leading zeros
                    if(negMax==true){
                        newmax = genDown(newmax);
                        newmax = "-0."+addLeadingzeros(newmax,cnt);
                    }else{
                        newmax = genUp(newmax);
                        newmax = "0."+addLeadingzeros(newmax,cnt);
                    }
                }else{
                        newmax = max.toString().split(".")[0];
                        if(negMax==true){
                            newmax = "-"+genDown(newmax);
                        }else{
                            newmax = genUp(newmax);
                        }
                    }           
            }else{
                newmax = max.toString();
                if(negMax==true){
                    newmax = "-"+genDown(newmax);
                }else{
                    newmax = genUp(newmax);
                }
            }
            //+++++++++++++++++++++++
            if(min<0){negMin=true;
                    min=removeNeg(min);
                }
            if(min%1!=0){
                
                if(min<1){
                    newmin = min.toString().split(".")[1];//0.002,0.2,-0.5
                    cnt=countzeros(newmin);//counting leading zeros
                    newmin = newmin.replace(/^0+/, '');//removing leading zeros
                    if(negMin==true){
                        newmin = genUp(newmin);
                        newmin = "-0."+addLeadingzeros(newmin,cnt);
                    }else{
                        newmin = genDown(newmin);
                        newmin = "0."+addLeadingzeros(newmin,cnt);
                    }

                }else{
                    newmin = min.toString().split(".")[0];//2.34-down,(-2.34,neg=up) single-1
                        if(negMin==true){
                            newmin = "-"+genUp(newmin);
                        }else{
                            newmin = genDown(newmin);
                        }
                    }
                }else{
                    newmin = min.toString();//normal 200-down,234-down,(200,neg=up)
                    if(negMin==true){
                        newmin = "-"+genUp(newmin);
                    }else{
                        newmin = genDown(newmin);
                    }
                }  

                return[newmax,newmin]; 
    };
function countzeros(val){
        var cnt=0,len;
        for(var i=0;i<val.length;i++){
            if(val[i]=="0"){
                cnt++;
            }else{
                break;
            }
        }
        return cnt;
    }
function addLeadingzeros(val,cnt){
    if(typeof val!="string"){val=val.toString();}
        while (val.length <= cnt){
            val = "0" + val;
        }
        return val;
    };
function removeNeg(val){
        val = val.toString();
            if (val.substring(0, 1) == '-') {
            val = Number(val.substring(1));        
        }//now max does not contains "-"
        return val;
    };
function genUp(val){
          var len = val.length,temp;
          if (len > 3) {
            temp = (Number(val[len - 3]) + 1) * 100;
            temp = Number(val.substr(0, (len - 3))) * 1000 + temp;
          } else {
            temp = (Number(val[0]) + 1) * Math.pow(10, (len - 1));
          }
          return temp;
    };
function genDown(val){
         var len = val.length,temp;
          if (len == 1) {
            temp = 0;
          } else {
             if (len > 3) {
                temp = (Number(val[len - 3])) * 100;
                temp = Number(val.substr(0, (len - 3))) * 1000 + temp;
              } else {
                temp = (Number(val[0])) * Math.pow(10, (len - 1));
              }
        }//if(val==temp){temp=temp-5;}
         return temp;
    };

   /* 


console.log(Multivariant.xaxisticks);

        for(var j=0;j<Multivariant.xaxisticks;j++){

            if(Multivariant.xCoor[i][j][0]-10<x && Multivariant.xCoor[i][j][0]+10>x){
                yT = Multivariant.xCoor[i][j][1];
                xT = Multivariant.xCoor[i][j][0];

                //yT1 = Multivariant.xCoor[i][j+1][1];
                //xT1 = Multivariant.xCoor[i][j+1][0];
                //.log(yT+","+xT+"  "+yT1+","+xT1);
                //console.log(interpolate(x,xT,yT,Multivariant.xCoor[i][j+1][0],Multivariant.xCoor[i][j+1][1]));
                //uppertext[i].setAttribute("visibility","visible");
                
                CtopY2=crosshair[i].getAttribute("y2");
                CtopX2=svgRect.getAttribute("width");
                 if((CtopY2-60)<yT){
                    uppertext[i].setAttribute("y",yT-20);
                    eRect[i].setAttribute("y",yT-40);
                 }else{
                    uppertext[i].setAttribute("y",yT+30);
                    eRect[i].setAttribute("y",yT+10);
                 }
                 
                 if((CtopX2-80)<(x+10)){
                    eRect[i].setAttribute("x",xT-100);
                    uppertext[i].setAttribute("x",xT-55);
                 }else{
                    eRect[i].setAttribute("x",xT+10);
                    uppertext[i].setAttribute("x",xT+55);
                 }   
                           
            uppertext[i].innerHTML=Multivariant.xCoor[i][j][3];
          }
        }
  for(var i=0;i<eRect.length;i++){
    for(var j=0;j<xlen;j++){
      if(typeof xCoor[i][j]!=="undefined"){
        //console.log(xCoor[i][j]);
        for(var k=0;k<col.length;k++){
          xdisplacement = col[k].getAttribute("x");
          if(e.detail.x==xdisplacement){
            col[k].style.fill = '#BC4445';
          }
          
        }uppertext[i].setAttribute("y",e.detail.y+18);
          eRect[i].setAttribute("y",e.detail.y);

          eRect[i].setAttribute("x",e.detail.x);
          uppertext[i].setAttribute("x",e.detail.x+45);

          uppertext[i].innerHTML = xCoor[i][j][2];
      }else{
        console.log(false);
      }
    }
  }
*/




