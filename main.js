/**
 * Defining constants
 */
const CONSTANTS = {
    USER_MESSAGE: 'div[class*="user-message"]',
    WAIT_TIME: 3000
};

/**
 * Extracts user messages from ChatGPT frontend
 */
class UserMessageExtractor {
    static extractAllMessages () {
        const userMessages = document.querySelectorAll(
            CONSTANTS.USER_MESSAGE,
        );
        console.log(userMessages);
    }
}

/**
 * Main class
 */
class TOCExtension {
    constructor() {
        UserMessageExtractor.extractAllMessages();
    }
    
}

setTimeout(() => {
    const tocExtension = new TOCExtension();
}, CONSTANTS.WAIT_TIME);


// test - adds a div to the page
console.log("Content script loaded from ChatGPT ToC extension!");
const testDiv = document.createElement("div");
testDiv.textContent = "If you see this content script is loaded successfully!";
document.body.appendChild(testDiv); // this is required so the div shows up