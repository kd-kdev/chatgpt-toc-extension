/**
 * Defining constants
 */
const CONSTANTS = {
    USER_MESSAGE: 'div[class*="user-message"]',
    WAIT_TIME: 3000, // 3000 ms = 3 seconds
    MAX_MESSAGE_LENGTH: 50
};

/**
 * Extracts user messages from ChatGPT frontend
 */
class UserMessageExtractor {
    static extractAllMessages() {
        return Array.from(document.querySelectorAll(CONSTANTS.USER_MESSAGE)).map((el, index) => {
            const id = `user-message-${index}`; // these are backticks ALT GR + 7 = `
            el.id = id;
            return { id, text: el.textContent.trim() };
        });
    }
}

/**
 * Creates the table of contents div
 */
class TOCDiv {
    static container = null;
    static createContainer(targetSelector) {
        this.container = document.createElement("div");
        this.container.id = "tocContainer";
        this.container.style.overflowY = "auto"; // scroll if long
        this.container.style.zIndex = "1000";
        this.container.style.position = "absolute";
        this.container.style.width = "100%";      
        this.container.style.maxWidth = "250px";  
        this.container.style.minWidth = "180px";
        this.container.style.height = "100%";  
        this.container.style.maxHeight = "620px";


        const chatContainer = document.querySelector('div[class*="relative"][class*="flex-col"][class*="grow"]');
        if (chatContainer) {
            chatContainer.style.position = "relative"; // create positioning context
            chatContainer.appendChild(this.container);
        } else {
            console.warn("Chat container not found");
            document.body.appendChild(this.container);
        }

        //document.body.appendChild(this.container);
    }

    static createHeader() {
        const header = document.createElement("div");
        const title = document.createElement("h1");
        title.textContent = "Table of contents";
        header.appendChild(title);
        this.container.appendChild(header);
    }

    static createList(userMessages) {
        const listContainer = document.createElement("div");
        listContainer.id = "listContainer"
        const orderedList = document.createElement("ol");
        orderedList.style.listStyle = "decimal";
        orderedList.style.paddingLeft = "20px"; // ensures spacing for numbers
        orderedList.style.margin = "1em 0"; // optional for spacing


        for (const item of userMessages) {
            const list = document.createElement("li");
            const anchor = document.createElement("a");

            anchor.href = `#${item.id}`; // links to every user message

            const isTooLong = item.text.length > CONSTANTS.MAX_MESSAGE_LENGTH;
            const trimmedText = item.text.slice(0, CONSTANTS.MAX_MESSAGE_LENGTH);
            anchor.textContent = isTooLong ? trimmedText + '...' : item.text;


            list.appendChild(anchor);
            orderedList.appendChild(list);
        }
        listContainer.appendChild(orderedList);
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

        TOCDiv.createContainer('#page-header');
        TOCDiv.createHeader();
        TOCDiv.createList(userMessages);
    }
}

setTimeout(() => {
    const tocExtension = new TOCExtension();
}, CONSTANTS.WAIT_TIME);


// test - adds a div to the page
// console.log("Content script loaded from ChatGPT ToC extension!");
// const testDiv = document.createElement("div");
// testDiv.textContent = "If you see this content script is loaded successfully!";
// document.body.appendChild(testDiv); // this is required so the div shows up