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

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <button class="delete" type="button">X</button>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
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
  const newStoryHTML = generateStoryMarkup(newStory);

  //add new story to story list, add new story to page, hide story submit form
  storyList.prepend(newStoryHTML);
  putStoriesOnPage();
  hidePageComponents();
}

$storyForm.on("submit", addNewStoryToPage);

function deleteStory(event) {
  console.debug("delete button");
}

$deleteButton.on("click", deleteStory);