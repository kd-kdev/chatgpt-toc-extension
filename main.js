/**
 * Defining constants
 */
const CONSTANTS = {
    USER_MESSAGE: 'div[data-message-author-role="user"]'
}

/**
 * Extracts user messages from ChatGPT frontend
 */
class UserMessageExtractor {

}

/**
 * Main class
 */
class TOCExtension {

}


// test - adds a div to the page
console.log("Content script loaded from ChatGPT ToC extension!");
const testDiv = document.createElement("div");
testDiv.textContent = "If you see this content script is loaded successfully!";
document.body.appendChild(testDiv); // this is required so the div shows up