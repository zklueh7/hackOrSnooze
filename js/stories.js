"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, deleteBtn=false, fav=false) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${fav ? showStar(true) : showStar(false)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        ${deleteBtn ? "<button class='delete'>X</button>" : ""}
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function showStar(fav) {
  if(fav === false) {
    return `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Empty_Star.svg/640px-Empty_Star.svg.png" class="empty-star star">`;
  }
  return `<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Star_empty.svg/471px-Star_empty.svg.png" class="filled-star star">`
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

async function removeStoryFromPage(event) {
  console.debug("deleteButtonClick");
  const storyId = $(event.target).closest("li").attr("id");
  await storyList.deleteStory(currentUser, storyId);
  await putStoriesOnPage();
}

$("body").on("click", ".delete", removeStoryFromPage);

async function favOrUnfavStory(event) {
  console.debug("favButtonClick");
  const storyId = $(event.target).closest("li").attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($(event.target).hasClass("empty-star")) {
    await currentUser.favoriteStory(story);
    $(event.target).toggleClass("empty-star filled-star");
    $(event.target).attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Star_empty.svg/471px-Star_empty.svg.png");
  } else {
    await currentUser.unfavoriteStory(story);
    $(event.target).toggleClass("filled-star empty-star");
    $(event.target).attr("src", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Empty_Star.svg/640px-Empty_Star.svg.png")
  }
  console.debug($(event.target));
}

$("body").on("click", ".star", favOrUnfavStory);

/** Gets info from submit story form and adds new story to page */
async function addNewStoryToPage(event) {
  console.debug("addNewStoryToPage");
  event.preventDefault();

  //get info from story submit form
  const title = $('#story-title').val();
  const author = $('#story-author').val();
  const url = $('#story-url').val();
  const storyData = {title, author, url};

  //pass info to addStory function and generate HTML
  const newStory = await storyList.addStory(currentUser, storyData);
  console.log(newStory);

  //add new story to story list, add new story to page, hide story submit form
  storyList.stories.push(newStory);
  hidePageComponents();
  putStoriesOnPage();
}

$storyForm.on("submit", addNewStoryToPage);

/******************************************************************************
 * Functionality for list of user's own stories
 */

function showUserStories() {
  console.debug("showUserStories");

  $userStories.empty();

    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $newStory = generateStoryMarkup(story, true);
      $userStories.append($newStory);
  }
  console.log($userStories);
  $userStories.show();
}