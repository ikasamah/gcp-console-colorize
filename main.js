function getCurrentProjectId() {
  var match = window.location.pathname.match(/project\/([a-z\-]+)/)

  var projectId = null;
  if (match) {
    projectId = match[1];
  }
  return projectId;
}

function getCurrentHeader() {
  return document.querySelector('.dark-theme-container');
  //return document.querySelector('.fb-appbar');
}

function changeHeaderColor() {
  var defaultSetting = {
    conditions: []
  };
  chrome.storage.sync.get(defaultSetting, function(setting) {
    var header = getCurrentHeader();
    if (!header) {
      console.error("can't get valid header, retry after 1.5 sec");
      setInterval(changeHeaderColor, 1500);
      return;
    }

    var projectId = getCurrentProjectId();
    if (!projectId) {
      console.error("can't get projectId");
      return;
    }

    var conditions = setting.conditions;
    for (var i = 0; i < conditions.length; i++) {
      var condition = conditions[i];
      if (projectId.match(condition.pattern)) {
        var colorRgb = 'rgb(' + condition.color.r + ', '
                              + condition.color.g + ', '
                              + condition.color.b + ')';
        header.style.backgroundColor = colorRgb;
        return;
      }
    }

    // No patterns matched, so back to original color
    header.style.backgroundColor = null;
  });
}

(function() {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    changeHeaderColor();
  });
  changeHeaderColor();
}());
