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

        //this.container.style.position = "relative"; // or just don't set it at all
        this.container.style.width = "250px";
        this.container.style.maxWidth = "250px";
        this.container.style.minWidth = "180px";
        this.container.style.flexShrink = "0"; // keep width fixed
        this.container.style.height = "100%";
        this.container.style.maxHeight = "620px";
        this.container.style.overflowY = "auto";


        // Find layout container
        // this one below will make the TOC to the right side, doesn't look too bad ?
        //const layoutContainer = document.querySelector("div.relative.flex.h-full.max-w-full.flex-1.flex-col");
        const layoutContainer = document.querySelector("#thread");
        if (!layoutContainer) {
            console.warn("Layout container not found");
            return;
        }

        layoutContainer.style.display = "flex";
        layoutContainer.style.flexDirection = "row"; // make sure sidebar + TOC + chat are side-by-side

        // Find sidebar
        const sidebar = layoutContainer.querySelector("#stage-slideover-sidebar");


        // Instead of inserting TOC inside sidebar,
        // insert TOC **after sidebar** so it appears between sidebar and main chat
        if (sidebar) {
            sidebar.insertAdjacentElement("afterend", this.container);
        } else {
            console.warn("Sidebar not found");
            // fallback: add TOC as first child of #thread
            layoutContainer.insertAdjacentElement("afterbegin", this.container);
        }


        const page_header = document.querySelector("#page-header");
        if (!page_header) {
            console.warn("Header element not found");
            return;
        }

        const updateTOCTopOffset = () => {
            const headerHeight = page_header.getBoundingClientRect().height;
            this.container.style.marginTop = `${headerHeight}px`;
        };

        // Initial call to set margin-top
        updateTOCTopOffset();

        // Update on window resize
        window.addEventListener("resize", updateTOCTopOffset);

    }

    static createHeader() {
        const header = document.createElement("div");
        header.id="tocheader";
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

/**
 * TODO:
 * Add mutator to watch for changes & update when user inputs more messages
 * Fix offset from top
 * Add smooth scroll up to element, no jerkiness
 * Make responsive
 * Style so it looks like a part of ChatGPT
 * Make icons
 * Package & release on store
 */



// test - adds a div to the page
// console.log("Content script loaded from ChatGPT ToC extension!");
// const testDiv = document.createElement("div");
// testDiv.textContent = "If you see this content script is loaded successfully!";
// document.body.appendChild(testDiv); // this is required so the div shows up