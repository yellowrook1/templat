$(document).on("click", '.js-remodal-link', function(event) {
  var target = event.target.attributes["data-remodal-target"].value
  var inst = $('[data-remodal-id='+target+']').remodal();

  inst.open();
});

/////////////// Classroom Assignments //////////////////
const assignmentsToShow = 3

const toggleMoreEl = (moreEl, hidden = false, isShowMore = true)=>{
  if(!moreEl) {
    return
  }

  const more = moreEl.querySelectorAll('span')[0]
  const less = moreEl.querySelectorAll('span')[1]


  moreEl.hidden = hidden
  more.hidden = !isShowMore
  less.hidden = !more.hidden
}

const toggleAssignments = (collapseEl)=>{
  const assignmentsContainer = collapseEl.parentElement.querySelector('.assignments-expand-container')
  const classroomHeading = collapseEl.parentElement.querySelector('.gc-classroom__heading')
  const classroomContainer = collapseEl.parentElement
  const parentStyle = assignmentsContainer.style
  const currentHeight = parentStyle["height"]
  const style = collapseEl.style
  const moreEl = assignmentsContainer.parentElement.querySelector(".assignment-more")
  const addedChild = assignmentsContainer.querySelector(".assignments-expand-container__child")
  let expandHeight = 0

  // aggregate heights
  for(let i=0; i < assignmentsContainer.children.length; i++){
    if(i < assignmentsToShow) {
      expandHeight+=assignmentsContainer.children[i].clientHeight
    }
  }

  // add height if there's additional assignmentsContainer children to show
  if (addedChild) { expandHeight+=addedChild.clientHeight }

  // Close other opened assignments
  const assignmentsBlock = collapseEl.closest(".classroom-assignments-due")
  const assignments = assignmentsBlock.querySelectorAll('.assignment-collapse')
  for(const assignment of assignments) {
    const assignmentClassroomHeading = assignment.parentElement.querySelector('.gc-classroom__heading')
    const assignmentClassroomContainer = assignment.parentElement
    assignment.parentElement.querySelector('.assignments-expand-container').style["height"] = "0px"
    assignment.style.transform = "rotate(0deg)"

    const showMoreEl = assignment.parentElement.querySelector(".assignment-more")
    toggleMoreEl(showMoreEl, true)

    if (assignmentClassroomHeading) {
      assignmentClassroomHeading.classList.remove("border-bottom")
      assignmentClassroomHeading.classList.remove("pb-2")
    }

    if (assignmentClassroomContainer.classList.contains("gc-classroom--teacher")) {
      assignmentClassroomContainer.classList.remove("pb-1", "pt-2")
      assignmentClassroomContainer.classList.add("py-2")
    }
  }

  // set container height to assignments that are visible
  // and show the more button
  if(parseInt(currentHeight, 10) === 0) {
    parentStyle["height"] = `${expandHeight}px`
    style.transform = "rotate(90deg)"
    toggleMoreEl(moreEl, false)

    if (classroomContainer.classList.contains("gc-classroom--teacher")) {
      classroomContainer.classList.add("pb-1", "pt-2")
      classroomContainer.classList.remove("py-2")
    }

    if (classroomHeading) {
      classroomHeading.classList.add("pb-2")
      classroomHeading.classList.add("border-bottom")
    }
  } else {
    parentStyle["height"] = "0px"
    style.transform = "rotate(0deg)"
    toggleMoreEl(moreEl, true, false)

    if (classroomHeading) {
      classroomHeading.classList.remove("border-bottom")
      classroomHeading.classList.remove("pb-2")
    }

    if (classroomContainer.classList.contains("gc-classroom--teacher")) {
      classroomContainer.classList.remove("pb-1", "pt-2")
      classroomContainer.classList.add("py-2")
    }
  }
}

const toggleMoreAssignments = (moreEl)=> {
  const parent = moreEl.parentElement.querySelector('.assignments-expand-container')
  const more = moreEl.querySelectorAll('span')[0]
  const less = moreEl.querySelectorAll('span')[1]
  const els = parent.children
  let numToDisplay

  if(more.hidden) {
    numToDisplay = assignmentsToShow
  } else {
    numToDisplay = els.length
  }

  let height = 0

  for(let i=0; i < els.length; i++) {
    let el = els[i]
    if(i < numToDisplay || el === moreEl) {
      height+=el.clientHeight
    }
  }

  parent.style["height"] = `${height}px`

  more.hidden = !more.hidden
  less.hidden = !less.hidden
}

// We load classroom assignments async. After assignments are loaded we convert dates into
// the local timezone of the user.
document.addEventListener("assignments-loaded", function(event) {
  const timeElements = document.querySelectorAll(".classroom-assignments .js-time-to-tz")

  for(const el of timeElements) {
    if(el.innerText) {
      const isoDate = new Date(el.innerText).toISOString()
      const dateTime = luxon.DateTime.fromISO(isoDate)

      if (el.classList.contains("js-time-to-tz--date")) {
        const formattedDate = dateTime.toLocaleString({
          year: "numeric",
          month: "long",
          day: "numeric"
        })
        el.innerText = formattedDate
      } else {
        const formattedDate = dateTime.toLocaleString({
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short"
        })
        el.innerText = formattedDate
      }
    }
  }
});

// Delegate click handler classroom assignments toggle and more button
document.addEventListener("click", (evt)=>{
  let collapseEl = evt.target.closest(".assignment-collapse")
  let moreEl = evt.target.closest(".assignment-more")

  if(collapseEl) {
    toggleAssignments(collapseEl)
  }

  if(moreEl) {
    toggleMoreAssignments(moreEl)
  }
})

/////////////// ToDo List //////////////////
const csrfData = new FormData();
const csrfParam = document.querySelector("meta[name=csrf-param]").getAttribute("content");
const csrfToken = document.querySelector("meta[name=csrf-token]").getAttribute("content");
csrfData.append(csrfParam, csrfToken);

function completeToDo(id) {
  navigator.sendBeacon(`/to_dos/${id}/toggle_completed`, csrfData);
}

$(document).on("click", '.js-to-do-item', function(event) {
  const item = event.currentTarget;
  const itemData = item.dataset;
  completeToDo(itemData.toDoId);
});

$(document).on("click", '#to-do-list-toggle', function (event) {
  const button = event.target.closest("#to-do-list-toggle");
  const toDoLists = document.querySelectorAll('.to-do-list-incomplete');

  if (toDoLists[0].classList.contains('to-do-list-show-less')) {
    toDoLists.forEach(function(el) {
      el.classList.remove('to-do-list-show-less');
      button.classList.remove('to-do-list-show-less');
    });
  } else {
    toDoLists.forEach(function(el) {
      el.classList.add('to-do-list-show-less');
      button.classList.add('to-do-list-show-less');
    });
  }
});

/////////////// Location Popover //////////////////
$(document).on("click", '#dismiss-location', function(event) {
  $('#update-location-popover').hide();
});

/////////////// Event description popover //////////////////
$(document).on("mouseover", '.short-event', function(event) {
  event.target.parentElement.querySelector(".Popover").hidden = false
})

$(document).on("mouseleave", '.short-event', function(event) {
  event.target.parentElement.querySelector(".Popover").hidden = true
})

$(document).on("click", ".js-expand-event-description", function(event) {
  event.preventDefault();
  event.stopPropagation();
  event.target.closest(".gc-card__description--no-hover").querySelector(".mobile-full-event").hidden = false;
  event.target.closest(".gc-card__description--no-hover").querySelector(".mobile-short-event").hidden = true;
});

$(document).on("click", ".js-collapse-event-description", function(event) {
  event.preventDefault();
  event.stopPropagation();
  event.target.closest(".gc-card__description--no-hover").querySelector(".mobile-full-event").hidden = true;
  event.target.closest(".gc-card__description--no-hover").querySelector(".mobile-short-event").hidden = false;
});

/////////////// Twitch Live Banner Dismissal //////////////////

$(document).on("click", '#twitch-dismiss', function(event) {
  let banner = document.querySelector("#twitch-banner");
  let id = banner.attributes["data-dismissed-id"].value
  localStorage.setItem('dismissedId', id)
  banner.hidden = true;
});

window.addEventListener('load', (event) => {
  let banner = document.querySelector("#twitch-banner");
  let id = banner.attributes["data-dismissed-id"].value
  if (localStorage.getItem('dismissedId') != id ){
    banner.hidden = false;
  }
});


/////////////// Handling async load failures //////////////////
document.addEventListener('discussions-error-event', function() {
  $('#discussions-error-message').show();
})

document.addEventListener('upgradeable-orgs-error-event', function() {
  $('#upgradeable-orgs-error-message').show();
})

document.addEventListener('to-dos-error-event', function() {
  $('#to-dos-error-message').show();
})

document.addEventListener('to-dos-error-event-full-size', function() {
  $('#to-dos-error-message-full-size').show();
})

document.addEventListener('classroom-error-event-full-size', function() {
  $('#classroom-error-message-full-size').show();
})

document.addEventListener('classroom-error-event', function() {
  $('#classroom-error-message').show();
})

document.addEventListener('classroom-teacher-assignments-error-event', function() {
  $('#classroom-teacher-assignments-error-message').show();
})

document.addEventListener('not-explored-error-event', function() {
  $('#not-explored-error-message').show();
})

document.addEventListener('explored-error-event', function() {
  $('#explored-error-message').show();
})
;
