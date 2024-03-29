const GetExclusiveId = () => {
  let id = Math.trunc(+ new Date() * Math.random())
  return id;
}

const NumberFormat = (num) => {
  if(num == null || num == undefined) return "0,00";

  if((num+"").includes(",") && (num+"").includes(".")){
    num = (num+"").replace(".", "").replace(",", ".")
  }else{
    num = (num+"").replace(",", ".")
  }

  if(isNaN(num)){
    try { 
      return JSON.parse(num.toLocaleLowerCase()); }
    catch { 
      console.log('NumberFormat: Falha na converção de valor :>> ', num);
      return num
    }
  }
  num = parseFloat(num)
  num = num.toLocaleString('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 4});
  return num
}

const ParseNumber = (stNum) => {
  let value = '';
  if(!isNaN(stNum))
    return parseFloat(stNum)

  do{
    if(!value){
      value = stNum.replace(".", "");
    }else{
      value = value.replace(".", "");
    }
  }while(value.includes("."))
  value = parseFloat(value.replace(",", "."))
  return value
}

const GetSixConections = (node) => {
  const halfWidth = node.width / 6;
  const halfHeight = (node.height) / 6;
  let newY = node.y
  let top1 = { x: node.x + halfWidth * 1, y: newY, point: 'top1' };
  let top2 = { x: node.x + halfWidth * 3, y: newY, point: 'top2' };
  let top3 = { x: node.x + halfWidth * 5, y: newY, point: 'top3' };
  let left1 = { x: node.x, y: newY + halfHeight * 1, point: 'left1' };
  let left2 = { x: node.x, y: newY + halfHeight * 3, point: 'left2' };
  let left3 = { x: node.x, y: newY + halfHeight * 5, point: 'left3' };
  let bottom1 = { x: node.x + halfWidth * 1, y: node.y + node.height, point: 'bottom1' };
  let bottom2 = { x: node.x + halfWidth * 3, y: node.y + node.height, point: 'bottom2' };
  let bottom3 = { x: node.x + halfWidth * 5, y: node.y + node.height, point: 'bottom3' };
  let right1 = { x: node.x + node.width, y: newY + halfHeight * 1, point: 'right1' };
  let right2 = { x: node.x + node.width, y: newY + halfHeight * 3, point: 'right2' };
  let right3 = { x: node.x + node.width, y: newY + halfHeight * 5, point: 'right3' };
  return [ left1, left2, left3, right1, right2, right3, top1, top2, top3, bottom1, bottom2, bottom3 ];
};

const GetTransform = () => {
  let trasnform = document.querySelector('#board').getAttribute('transform')
  if(trasnform) {
    let scale = trasnform.split(' ')[1]
    trasnform = trasnform.slice(trasnform.indexOf('(') + 1, trasnform.indexOf(')'))

    scale = scale.slice(scale.indexOf('(') + 1, scale.indexOf(')'))
    let x = trasnform.split(',')[0]
    let y = trasnform.split(',')[1]
    return { x: parseFloat(x), y: parseFloat(y), scale: parseFloat(scale) }
  }
  return { x: 0, y: 0, scale: 1}
}

const GetSVGCoordinates = (event) => {
  let boundingClientRect = document.querySelector("#svg").getBoundingClientRect();
  let transform = GetTransform();
  let x;
  let y;

  if(event.type == "drag"){
    x = event.x - window.scrollX;
    y = event.y - window.scrollY;
  }else{
    x = event.pageX - boundingClientRect.left - window.scrollX;
    y = event.pageY - boundingClientRect.top - window.scrollY;
  }

  x -=  transform.x;
  y -=  transform.y;
  x /= transform.scale * 1;
  y /= transform.scale * 1;

  return [x, y]
}

const GetCoordinateDiff = function (coord, node){
  return {
    x: coord.x - node.x,
    y: coord.y - node.y
  }
}

const SetArea = async (node, adjust) => {
  let extremes = await GetExtremesCoordinates(node)
  node.x = extremes.min.x - node.r;
  node.y = extremes.min.y - node.r;
  node.height = Math.abs(extremes.max.y - extremes.min.y + adjust);
  node.width = Math.abs(extremes.max.x - extremes.min.x + adjust);
}

const GetExtremesCoordinates = async (node) => {
  let coord = await GetCoordinatePath(node.path)
  let minX = -1;
  let maxX = -1;
  let minY = -1;
  let maxY = -1;

  coord.forEach(c => {
    if(minX == -1){
      minX = c.x;
      minY = c.y;
    }
    
    if(c.x < minX)
      minX = c.x
    if(c.x > maxX)
      maxX = c.x

    if(c.y < minY)
      minY = c.y
    if(c.y > maxY)
      maxY = c.y
  });

  return ({ min:{x: minX, y: minY}, max: {x: maxX, y: maxY} })
}

export const GetDimentionsById = (id) => {
  let d = document.querySelector(`#${id}`);
  d = d ? d.getBoundingClientRect() : null;
  
  if (!d){
    return
  }

  let svg = document.querySelector("#svg").getBoundingClientRect();
  let transform = GetTransform();

  let x = d.x
  let y = d.y

  x -=  (transform.x + svg.left);
  y -=  (transform.y + svg.top);
  x /= transform.scale;
  y /= transform.scale;

  return {
   width: d.width / transform.scale,
   height: d.height / transform.scale,
   x,
   y
  }
}

const GetCoordinatePath = (path) =>{
  let strCoord = path.replace("M", "").split('L')
  let coord = new Array();

  strCoord.forEach(c => {
    let [x, y] = c.split(",")
    x = parseFloat(x);
    y = parseFloat(y);
    coord.push({x: x, y: y});
  })

  return coord;
}

export { 
  GetExclusiveId,
  NumberFormat, 
  GetSixConections,
  GetSVGCoordinates,
  GetCoordinateDiff,
  SetArea,
  GetExtremesCoordinates,
  GetCoordinatePath,
  ParseNumber
}