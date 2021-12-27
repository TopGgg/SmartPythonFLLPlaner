function isPointInRect(xP, yP, xA, yA, xB, yB, xC, yC, xD, yD){

ABCD = 0.5 * Math.abs((yA - yC)*(xD - xB) + (yB - yD)*(xA - xC));

ABP = 0.5 * Math.abs(xA*(yB - yP) + xB*(yP - yA) + xP*(yA - yB));
BCP = 0.5 * Math.abs(xB*(yC - yP) + xC*(yP - yB) + xP*(yB - yC));
CDP = 0.5 * Math.abs(xC*(yD - yP) + xD*(yP - yC) + xP*(yC - yD));
DAP = 0.5 * Math.abs(xD*(yA - yP) + xA*(yP - yD) + xP*(yD - yA));

return !(ABCD < (ABP + BCP + CDP + DAP));
}

function radians_to_degrees(radians)
{
  var pi = Math.PI;
  return radians * (180/pi);
}

function AngleBtw2Points(pointA, pointB){
  changeInX = pointB[0] - pointA[0]
  changeInY = pointB[1] - pointA[1]
  return radians_to_degrees(Math.atan2(changeInY,changeInX))
}