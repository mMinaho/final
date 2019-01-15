function getAssignmentsByType(type){
  var assignments = localStorage.getItem(type).split("|");
  if (assignments[0] == ""){
    return assignments.slice(1);
  }
  return assignments;
}

function showAssignments(assignments){
  var result = "";

  for (var i =0; i < assignments.length; i++){
    result = result + "," + JSON.parse(assignments[i])["content"];
  }
  alert(result);
}
