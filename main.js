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
    static container = null;
    static createContainer() {
        this.container = document.createElement("div");
        document.body.appendChild(this.container);
    }

    static createHeader() {
        const header = document.createElement("div")
        const title = document.createElement("h1");
        title.textContent = "Table of contents";
        header.appendChild(title);
        this.container.appendChild(header);
    }

    static createList(userMessages) {
        const listContainer = document.createElement("div");
        for (const item of userMessages) {
            const list = document.createElement("li");
            list.textContent = item.slice(0, CONSTANTS.MAX_MESSAGE_LENGTH);
            listContainer.appendChild(list);
        }
        this.container.appendChild(listContainer);
    }
}


/**
 * Main class
 */
class TOCExtension {
    constructor() {
        const userMessages = UserMessageExtractor.extractAllMessages();
        console.log(userMessages);

        TOCDiv.createContainer();
        TOCDiv.createHeader();
        TOCDiv.createList(userMessages);
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