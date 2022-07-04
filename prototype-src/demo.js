var selectedOC = null;
var exceptionsSelectedOc = {};

var selectedException = null;

var mode = "ODD";

setODDSpecificationTitles();
$(".arrow").next("li").children().next("ul").toggle();
$(".windowMainOcException").show();

refreshAFRequirements();
adaptAFRequirementMessage();

$('input[type="checkbox"]').change(function (e) {
  
  function checkSiblings(el) {
    console.log("TEST:"+el.children("label").text());
    if(el.children("label").text() == ""){
      return;
    }
    var parent = el.parent().parent(),
      all = true;

    el.siblings("li").each(function () {
      let returnValue = (all =
        $(this).children('input[type="checkbox"]').prop("checked") === checked);
      return returnValue;
    });
    console.log($(this).children("label"));
    if (all && checked) {
      parent.children('input[type="checkbox"]').prop({
        indeterminate: false,
        checked: checked
      });
      checkSiblings(parent);
    } else if (all && !checked) {
      parent.children('input[type="checkbox"]').prop("checked", checked);
      parent
        .children('input[type="checkbox"]')
        .prop(
          "indeterminate",
          parent.find('input[type="checkbox"]:checked').length > 0
        );
      checkSiblings(parent);
    } else {
      el.parents().children('input[type="checkbox"]').prop({
        indeterminate: true,
        checked: false
      });
    }
    
  }
  
  var checked = $(this).prop("checked"),
    container = $(this).parent(),
    siblings = container.siblings();
  

  container.find('input[type="checkbox"]').prop({
    indeterminate: false,
    checked: checked
  });
  
  checkSiblings(container);
  if(mode == "ODD"){
    adaptOCExceptionMessage(selectedOC);
  }
  
  else if(mode == "AF"){
    refreshAFRequirements();
    adaptAFRequirementMessage();
    console.log("CLICK3");
  }

});

$(".arrow").click(function () {
  $(this).next("li").children().next("ul").toggle("down");
});

var arrows = document.querySelectorAll(".arrow");
for (var i = 0, max = arrows.length; i < max; i++) {
  var e = arrows[i];
  e.addEventListener("click", function (event) {
    event.target.classList.toggle("down");
  });
}

//TODO change to adapt on JQuery
var labels = $(".labelAttribute");
var currentTarget = null;
labels.on("click", function () {
  if (currentTarget != null) {
    currentTarget.css("backgroundColor","transparent");
    console.log(getFullPath(currentTarget));
    $("#" + getFullPath(currentTarget).replaceAll("\\", "_")).hide();
  }
  currentTarget = $(this);
  currentTarget.css("backgroundColor","var(--theme-medium)");
  var ocFullPath = getFullPath(currentTarget).replaceAll("\\", "_");
  console.log("label:"+ocFullPath);
  $("#" + ocFullPath).show();
  
  if(mode=="ODD"){
    selectedOC = ocFullPath;
    adaptOCExceptionMessage(ocFullPath);
    refreshListOCExceptions();
  }
 });

$(".OCResearchSubmit").click(function(event) {
  event.preventDefault();
  var researchInput = $('#researchInput').val();
  var researchInputAncestors = getOCSuperclasses(researchInput.replaceAll("\\","_"));
  console.log(researchInputAncestors);
  for (var i = 0, max = researchInputAncestors.length - 1; i < max; i++) {
    var ancestor = researchInputAncestors[i];
    if(!$("#arrow_"+ancestor).hasClass("down")){
      $("#arrow_"+ancestor).trigger( "click" );
    }
  }
  $("#item_"+researchInputAncestors[researchInputAncestors.length - 1]).children().next("label").trigger( "click" );
});

$(".addOCException").click(function(event) {
  event.preventDefault();
  $(".ocExceptionCreation").show();
});

$(".removeOCException").click(function(event) {
  event.preventDefault();
  if(selectedException == null){ return; }
  var exceptions = exceptionsSelectedOc[selectedOC];
  for( var i = 0; i < exceptions.length; i++){
    if(exceptions[i]==selectedException.innerHTML){
      exceptions.splice(i, 1);
    }
  }
  refreshListOCExceptions();
});

$(".editOCException").click(function(event) {
  event.preventDefault();
  if(selectedException == null){ return; }
  $(".ocExceptionEditionInput").val(selectedException.innerHTML);
  $(".ocExceptionEdition").show();
});

$(".ocExceptionCreationSubmit").click(function(event) {
  event.preventDefault();
  var exceptionSubmitted = $(".ocExceptionCreationInput").val();
  
  if(!exceptionSyntaxChecking(exceptionSubmitted)){
    return;
  }
  if(exceptionsSelectedOc[selectedOC] == null){
    exceptionsSelectedOc[selectedOC] = [exceptionSubmitted]
  }
  else{
    exceptionsSelectedOc[selectedOC].push(exceptionSubmitted);
  }
  refreshListOCExceptions();
  $(".ocExceptionCreationInput").val("");
  $(".ocExceptionCreation").hide();
  
});

$(".ocExceptionEditionSubmit").click(function(event) {
  event.preventDefault();
  var exceptionSubmitted = $(".ocExceptionEditionInput").val();
  if(!exceptionSyntaxChecking(exceptionSubmitted)){
    return;
  }
  
  var exceptions = exceptionsSelectedOc[selectedOC];
  for( var i = 0; i < exceptions.length; i++){
    if(exceptions[i]==selectedException.innerHTML){
      exceptions[i] = exceptionSubmitted;
    }
  }
  refreshListOCExceptions();
  $(".ocExceptionEdition").hide();
  
});

$(".ocExceptionCreationCancel").click(function(event) {
  event.preventDefault();
  $(".ocExceptionCreationInput").val("");
  console.log("cancel OC Exception");
  $(".ocExceptionCreation").hide();
});

$(".ocExceptionEditionCancel").click(function(event) {
  event.preventDefault();
  $(".ocExceptionEdition").hide();
});



$(".listOCExceptions").on("click", ".liOCException", function(event) {
  deselectException();
  event.target.style.backgroundColor = "var(--theme-medium)";
  selectedException = event.target;
});

$("#tab-odd").trigger("click");

$(".nextButton").click(function(event) {
  if(mode=="ODD"){
    $("#tab-af").trigger("click");
  }
  else if(mode=="AF"){
    $("#tab-ha").trigger("click");
  }
});

$(".backButton").click(function(event) {
  if(mode=="HARA"){
    $("#tab-af").trigger("click");
  }
  else if(mode=="AF"){
    $("#tab-odd").trigger("click");
  }
});

$("#tab-af").click(function(event) {
  switchSystemSpecificationMode();
});

$("#tab-odd").click(function(event) {
  switchODDMode();
});

$("#tab-ha").click(function(event) {
  switchHARAMode();
});

$("#tab-scenariosHA").click(function(event) {
  $(".table").hide();
  $("#table-scenariosHA").show();
});
$("#tab-misusesHA").click(function(event) {
  $(".table").hide();
  $("#table-misusesHA").show();
});
$("#tab-componentsHA").click(function(event) {
  $(".table").hide();
  $("#table-componentsHA").show();
});
$("#tab-functionalHA").click(function(event) {
  $(".table").hide();
  $("#table-functionalHA").show();
});
$("#tab-scenariosHA").trigger( "click" );

$(".addScenarioHA").click(function(event) {
  event.preventDefault();
  $(".scenarioCreation").show();
});

$(".scenarioCreationCancel").click(function(event) {
  event.preventDefault();
  $(".scenarioCreation").hide();
});

$(".scenarioCreationSubmit").click(function(event) {
  event.preventDefault();
  $(".scenarioCreation").hide();
  
  var scenarioSubmitted = $(".scenarioCreationInput").val();
  console.log("create Scenario:"+scenarioSubmitted);
  
  addScenarioHARows(scenarioSubmitted);
});

autocomplete($("#researchInput"), getAllOCs(), "autocomplete-items", true, false);

autocomplete($(".ocExceptionCreationInput"), getAllOCs(),"autocompleteOCRestriction-items", false, true);

autocomplete($(".ocExceptionEditionInput"), getAllOCs(),"autocompleteOCRestriction-items", false, true);


function setODDSpecificationTitles(){
    $(".ocInfos").prepend("<h3 class= ocInfosTitle>Operating Condition Information</h3>");

  $(".windowMainOcException").prepend("<h3 class= ocExceptionsTitle>Operating Condition Exceptions</h3>");

  $(".ocExceptionCreation").prepend("<h3 class= ocExceptionCreationTitle>Creation of Operating Condition Exceptions</h3>");

  $(".ocExceptionEdition").prepend("<h3 class= ocExceptionEditionTitle>Edition of Operating Condition Exceptions</h3>");
}

function connectHAdropdownList(){
  $(".dropbtn").off();
  $(".dropdown-item").off();
  $(".dropbtn").click(function(){
    var dropdownContent = $(this).next(".dropdown-content");
    if (!dropdownContent.is(":visible")){
      dropdownContent.show();
    }
    else{
      dropdownContent.hide();
    }
  });
  $(".dropdown-item").click(function(){
  var selectedItem = $(this).text();
  var dropbtn = $(this).parent().prev();
  dropbtn.get(0).childNodes[0].nodeValue = selectedItem;
  $(this).parent().hide();
  });
}

connectHAdropdownList();

setRiskColumnsInHARA();

function adaptOCExceptionMessage(ocFullPath){
  checked=$("#item_"+ocFullPath).children('input[type="checkbox"]').prop("checked");
  if(checked){
    $(".outOddOCExceptions").hide();
    $(".groupeButtonsOCExceptions").show();
    $(".listOCExceptions").show();
  }
  else{
    $(".outOddOCExceptions").show();
    $(".groupeButtonsOCExceptions").hide();
    $(".listOCExceptions").hide();
  }
}

function adaptAFRequirementMessage(){
  var noRequirement= $(".listAFRequirements li").length == 0;
  if(noRequirement){
    $(".listAFRequirements").hide();
    $(".noAFRequirementMessage").show();
  }
  else{
    $(".listAFRequirements").show();
    $(".noAFRequirementMessage").hide();
  }
}

function camelize(str) {
  return str
    .replaceAll("-"," ")
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return word.toUpperCase();
    })
    .replace(/\s+/g, "")
    .replaceAll("/","");
}

function getFullPath(label) {
  console.log("CURRENT LABEL:"+label.text())
  if (label.text() == "ODD") {
    //root name (we don't check null value to avoid infinite loop)
    return "ODD";
  }
  
  if(label.text() == "Autonomy Functions"){
    return "AF";
  }
  var parent_label = label.parent().parent().parent().children().next("label");
  return getFullPath(parent_label) + "\\" + camelize(label.text());
}


// function getAllOCs() {
//   console.log("START all attributes");
//   var array = [];
//   for (var i = 0, max = $(".ocInfos").length; i < max; i++) {
//     var id = $(".ocInfos").get(i).id.replaceAll("_", "\\");
//     array.push(id);  
//   }
//   return array;
// }
  
function getAllOCs() {
  return getAllAttributes("ODD");
}

function getAllAFs() {
  return getAllAttributes("AF");
}

function getAllAttributes(taxo){
  var array = [];
  for (var i = 0, max = $(".ocInfos").length; i < max; i++) {
    var id = $(".ocInfos").get(i).id.replaceAll("_", "\\");
    var taxoName = id.split("\\")[0];
    if(taxoName==taxo) {array.push(id);}   
  }
  return array;
}

function autocomplete(inp, arr, autocompleteItems, withFullPath, positionUnderCursor) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.on("input", function () {
    
    var a,b,i,val = this.value;
    
    var splitVal = val.split(/[\s,\.\[\]]+/);
    val = splitVal[splitVal.length - 1];// consider only the last word
    
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id +  "autocomplete-list");
    a.setAttribute("class", autocompleteItems);
    
    
    
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    
    if(positionUnderCursor){
      var N_CHAR_ON_LINE = 44;
      var ORIGIN_TOP = -290;
      var HEIGHT_CHAR = 20;
      var ORIGIN_LEFT = 20;
      var WIDTH_CHAR = 9;
      //TODO correct problem when line overflow (last word cutted)/ search number of line and length of last line
      var cursorPosition = $(inp).prop("selectionStart");
      var lineCursorPosition = Math.floor(cursorPosition/N_CHAR_ON_LINE);
      var columnsCursorPosition = cursorPosition % N_CHAR_ON_LINE;
      var cursorLine = (ORIGIN_TOP+HEIGHT_CHAR*(lineCursorPosition+1));
      var cursorColumn = (ORIGIN_LEFT+WIDTH_CHAR*columnsCursorPosition);
      $("."+autocompleteItems).css("top",""+cursorLine+"px");
      $("."+autocompleteItems).css("left",""+cursorColumn+"px");
    }
    
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      var name_item= arr[i].split('\\');
      name_item = name_item[name_item.length - 1];
      /*check if the item starts with the same letters as the text field value:*/
      if (name_item.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        if(withFullPath){
          b.innerHTML = arr[i].substr(0, arr[i].length - name_item.length);
        }
        else{
          b.innerHTML = ""
        }
        b.innerHTML += "<strong>" + name_item.substr(0, val.length) + "</strong>";
        b.innerHTML += name_item.substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          
          var inpValue =  this.getElementsByTagName("input")[0].value;
          /*insert the value for the autocomplete text field:*/
          
          inp.val(inp.val().substring(0, inp.val().length - val.length));
          //remove the last word in the current inputbeore replacing it by the autocompletion
          
          if(withFullPath){
            inp.val(inp.val()+ inpValue);
          }
          else{
            var split = inpValue.split("\\");
            inp.val(inp.val() + split[split.length -1]);
          }
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.on("keydown", function (e) {
    var x = document.getElementById(this.id +  "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName(autocompleteItems);
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

function getOCSuperclasses(ocPath){
  splittedPath = ocPath.split("_")
  
  var strCurrentAncestor = splittedPath[0]
  var arrAncestors = [strCurrentAncestor]
  for (i = 1; i < splittedPath.length; i++) {
    strCurrentAncestor+="_"+splittedPath[i];
    arrAncestors.push(strCurrentAncestor);
  }
  return arrAncestors;
}

function refreshListOCExceptions(){
  $(".listOCExceptions").empty();
  var listOCExceptions = exceptionsSelectedOc[selectedOC];
  if(listOCExceptions == null){
    return;
  }
  
  for (var i = 0, max = listOCExceptions.length; i < max; i++){
    var ocException = listOCExceptions[i];
    $(".listOCExceptions").append("<li class=\"liOCException\">"+ocException+"</li>");
  }
  
  deselectException();
}

function addAFRequirement(requirement){
  $(".listAFRequirements").append("<li>"+requirement+"</li>");
}

function refreshAFRequirements(){
  $(".listAFRequirements").empty();
  var checkboxSensing = ($("#item_AF_Sensing input").prop("checked")||$("#item_AF_Sensing input").prop("indeterminate"));
  
  var checkboxPerception = $("#item_AF_Perception input").prop("checked")||$("#item_AF_Perception input").prop("indeterminate");
  var checkboxDecision = $("#item_AF_DecisionPlanningAndControl_BehavioralDecisions input").prop("checked")||$("#item_AF_DecisionPlanningAndControl_BehavioralDecisions input").prop("indeterminate");
  var checkboxPlanning = $("#item_AF_DecisionPlanningAndControl_MotionPlanning input").prop("checked")||$("#item_AF_DecisionPlanningAndControl_MotionPlanning input").prop("indeterminate");
  
  if(!checkboxSensing){
    addAFRequirement("At least one Sensing function shall be covered.");
  }
  if(!checkboxPerception){
    addAFRequirement("At least one Perception function shall be covered.");
  }
  
  if(!checkboxDecision){
    addAFRequirement("At least one Behavioral Decision function shall be covered.");
  }
  
  if(!checkboxPlanning){
    addAFRequirement("At least one Motion Planning function shall be covered.");
  }
  // if(!checkboxSensing||!checkboxPerception||!checkboxDecisionPlanningAndControl){
  //   addAFRequirement("At least one Sensing, Perception,Decision/Planning/control functions shall be covered.");
  //   // console.log("CLICK6:"+$(".listAFRequirements li").length);
  // }
}

function deselectException(){
  if (selectedException != null) {
    selectedException.style.backgroundColor = "transparent";
  }
  selectedException = null;
}

function exceptionSyntaxChecking(exceptionSubmitted){
  //fake checking TODO replace by real checking
  if(exceptionSubmitted.includes("Rainfalll")){
     $(".ocExceptionSyntaxError").text("Unrecognized attribute \"Rainfalll\"");
    $(".ocExceptionSyntaxError").show();
    return false;
  }
  else{
     $(".ocExceptionSyntaxError").hide();
    return true;
  }
}

function switchSystemSpecificationMode(){
  mode="AF";
  $(".ocInfos").hide();
  $(".ocInfosTitle").text("Autonomy Function Information");
  $(".windowMainOcException").hide();
  $(".windowAFRequirements").show();
  $(".outOddOCExceptions").text("Exceptions can’t be specified on an attribute outside the Autonomy Functions domain.");
  $(".autonomyFunctionsTaxoView").show();
  $(".oddTaxoView").hide();
  $("#researchInput").attr("placeholder","Search Autonomy Function");
  
  $("#researchInput").off();
  $(".ocExceptionCreationInput").off();
  $(".ocExceptionEditionInput").off();
  $("#researchInput").val("");
  autocomplete($("#researchInput"), getAllAFs(), "autocomplete-items", true, false);
  
  $(".HARAtableContainer").hide();
}

function switchHARAMode(){
  mode="HARA"
  $(".autonomyFunctionsTaxoView").hide();
  $(".oddTaxoView").hide();
  $(".HARAtableContainer").show();
  $(".windowMainOcException").hide();
  $(".windowAFRequirement").hide();
  $(".ocInfos").hide();
  $("#researchInput").attr("placeholder","Search Hazardous Event");
}

function appendHARows(){
  // $(".table-row").append($("#exposure-row"));
  // $(".table-row").append($("#severity-row"));
  // $(".table-row").append($("#controlability-row"));
  $(".table-row").append($("#riskclass-row"));
}
function setRiskColumnsInHARA(){
  // $(".table-header").append(
  //   "<div class=\"header_item\">Exposure</div>\
  //    <div class=\"header_item\">Severity</div>\
  //    <div class=\"header_item\">Controllability</div>");
  $(".table-header").append("<div class=\"header_item\">Risk Classification</div>");
  
  $("#riskclass-row").show();
  // $("#exposure-row").show();
  // $("#severity-row").show();
  // $("#controlability-row").show();
  appendHARows();
}

function switchODDMode(){
  mode = "ODD";
  $(".ocInfos").hide()
  $(".ocInfosTitle").text("Operating Conditions Information");
  $(".windowMainOcException").show();
  $(".windowAFRequirements").hide();
  $(".outOddOCExceptions").text("Exceptions can’t be specified on an attribute outside ODD.");
  $(".autonomyFunctionsTaxoView").hide();
  $(".oddTaxoView").show();
  $("#researchInput").attr("placeholder","Search Operating Conditions");
  
  $("#researchInput").off();
  $(".ocExceptionCreationInput").off();
  $(".ocExceptionEditionInput").off();
  $("#researchInput").val("");
  autocomplete($("#researchInput"), getAllOCs(), "autocomplete-items", true, false);
  
  $(".HARAtableContainer").hide();
}

function interpeteScenarioExpression(strScenario){
  var regExp = /\[\[([^\]]+)\]\]/;
  var matches = regExp.exec(strScenario);
  if (matches==null){
    return strScenario;
  }
  var splitedMatch = matches[1].split(",");
  var allScenarios = [];
  for (var i = 0, max = splitedMatch.length; i < max; i++) {
    var e = splitedMatch[i];
    var replacedMatch = strScenario.replaceAll(matches[0],e);
    allScenarios = allScenarios.concat(interpeteScenarioExpression(replacedMatch));
  }
  return allScenarios;
}

console.log(interpeteScenarioExpression("[[MinorRoad,Parking,SharedSpace]], [[Day,Night]], EgoVehicle: {speed: AdaptedSpeed}"));

var globalScenarioCounter = 0;

function addScenarioHARows(strScenario){
  globalScenarioCounter +=1;//TODO delete in final version
  
  var relevantManeuvers = getRelevantManeuvers(strScenario);
  var relevantKeywords = getRelevantKeywords(strScenario);
  var allScenarios = interpeteScenarioExpression(strScenario);
  console.log("ALL MANEUVERS:",relevantManeuvers);
  for (var i = 0; i < allScenarios.length; i++) {
    for (var j = 0; j < relevantManeuvers.length; j++) {
      for (var k = 0; k < relevantKeywords.length; k++) {
        var scenario = allScenarios[i];
        var maneuver = relevantManeuvers[j];
        var keyword = relevantKeywords[k];
        var malfunction = getMalfunction(maneuver,keyword);
         $("#table-scenariosHA .table-content").append(
        "<div class=\"table-row\">\
        <div class=\"table-data\">"+scenario+"</div>\
        <div class=\"table-data\">yes</div>\
        <div class=\"table-data\">"+maneuver+"</div>\
        <div class=\"table-data\">"+keyword+"</div>\
        <div class=\"table-data\">"+malfunction+"</div>\
        <div class=\"table-data\">"+$("#riskclass-row").html()+"</div></div>");
        // <div class=\"table-data\">"+$("#riskclass-row").html()+"</div>\
        // <div class=\"table-data\">"+$("#severity-row").html()+"</div>\
        // <div class=\"table-data\">"+$("#controlability-row").html()+"</div>\
        // </div>");
        console.log("SCENARIO:"+scenario);
        console.log("MANEUVER:"+maneuver);
        console.log("KEYWORD:"+keyword);
      }
    }
  }
  connectHAdropdownList();
}

  const FAKE_CRITICAL_SCENARIO1_KEYWORDS=["no","too late","too few", "physically not possible","stopped too soon"];
  const FAKE_CRITICAL_SCENARIO2_KEYWORDS=["too many","inappropriate"];
  const FAKE_CRITICAL_SCENARIO1_MANEUVERS=["safe stop","turn left","turn right"];
  const FAKE_CRITICAL_SCENARIO2_MANEUVERS=["safe stop"];

function getRelevantManeuvers(strScenario){//TODO modify in final version
  if(globalScenarioCounter == 1){
    return FAKE_CRITICAL_SCENARIO1_MANEUVERS;
  }
  if(globalScenarioCounter == 2){
    return FAKE_CRITICAL_SCENARIO2_MANEUVERS;
  }
}

function getRelevantKeywords(strScenario){//TODO modify in final version
  if(globalScenarioCounter == 1){
    return FAKE_CRITICAL_SCENARIO1_KEYWORDS;
  }
  if(globalScenarioCounter == 2){
    return FAKE_CRITICAL_SCENARIO2_KEYWORDS;
  }
}

function getMalfunction(maneuver,keyword){//TODO modify in final version
  const malfunctionDic = {
    "safe stop": {"no":"necessary braking maneuver not initiated ",
                 "too late": "delayed braking maneuver",
                 "too few": "braking maneuver not strong enough",
                  "physically not possible": "impossible braking maneuver",
                  "stopped too soon": "ego vehicle not fully stopped",
                  "too many": "unexpected too strong braking",
                  "inappropriate": "unexpected unjustified braking"
                 },
    "turn left": {"no":"necessary avoidance maneuver not initiated ",
                 "too late": "delayed avoidance maneuver",
                 "too few": "avoidance maneuver not strong enough",
                  "physically not possible": "impossible avoidance maneuver",
                  "stopped too soon": "interrupted avoidance"
                 },
    "turn right": {"no":"necessary avoidance maneuver not initiated ",
                 "too late": "delayed avoidance maneuver",
                 "too few": "avoidance maneuver not strong enough",
                  "physically not possible": "impossible avoidance maneuver",
                  "stopped too soon": "interrupted avoidance"
                 }
  }
  return malfunctionDic[maneuver][keyword];
}

function fakeCompletenessCheck(){
  
}
