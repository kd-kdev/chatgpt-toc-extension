/**
 * Defining constants
 */
const CONSTANTS = {
    USER_MESSAGE: 'div[class*="user-message"]',
    WAIT_TIME: 3000, // 3000 ms = 3 seconds
    MAX_MESSAGE_LENGTH: 80
};

/**
 * Extracts user messages from ChatGPT frontend
 */
class UserMessageExtractor {
    static extractAllMessages () {
        const userMessages = document.querySelectorAll(
            CONSTANTS.USER_MESSAGE,
        );
        //console.log(userMessages); - will output user messages!
        return Array.from(userMessages)
        .map((el) => el.textContent.trim());
    }
}

/**
 * Creates the table of contents div
 */
class TOCDiv {

    static createContainer() {

    }

    static createHeader() {

    }

    static createList() {

    }
}


/**
 * Main class
 */
class TOCExtension {
    constructor() {
        console.log(UserMessageExtractor.extractAllMessages());

        TOCDiv.createContainer();
        TOCDiv.createHeader();
        TOCDiv.createList();
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