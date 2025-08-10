/**
 * Defining constants
 */
const CONSTANTS = {
    USER_MESSAGE: 'div[class*="user-message"]',
    WAIT_TIME: 3000, // 3000 ms = 3 seconds
    MAX_MESSAGE_LENGTH: 70
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
        this.container.style.position = "absolute";   // overlay position
        this.container.style.maxHeight = "620px";
        this.container.style.overflowY = "auto"; // scroll if long
        this.container.style.overflowX = "hidden"; // hide width scroll bar
        this.container.style.zIndex = "1000";   // keep on top but adjust if needed

        // update width according to viewport
        const viewportWidth = window.innerWidth;
        const desiredWidth = Math.min(Math.max(viewportWidth * 0.15, 180), 400); // 20% of viewport width, clamped between 180 and 300 px

        this.container.style.width = `${desiredWidth}px`;
        this.container.style.minWidth = "180px";
        this.container.style.maxWidth = "400px";

        // Find layout container
        const layoutContainer = document.querySelector("#thread");
        if (!layoutContainer) {
            console.warn("Layout container not found");
            return;
        }

        // layoutContainer.style.display = "flex";
        // layoutContainer.style.flexDirection = "row";

        // Find sidebar & header
        const sidebar = layoutContainer.querySelector(
        'nav[class*="group/scrollport"].relative.flex.h-full.w-full.flex-1.flex-col.overflow-y-auto.transition-opacity.duration-500'
        );
        const page_header = document.querySelector("#page-header");
        if (!page_header) {
            console.warn("Header element not found");
            return;
        }
        if (!sidebar) {
            console.warn("Sidebar not found");
        }

        // Append TOC container to layoutContainer (so it’s positioned relative to it)
        layoutContainer.style.position = "relative";  // needed for absolute positioning inside
        layoutContainer.appendChild(this.container);

        // Function to update TOC position & height dynamically
        const updateTOCPosition = () => {
            const headerHeight = page_header.getBoundingClientRect().height;
            const sidebarWidth = sidebar ? sidebar.getBoundingClientRect().width : 0;
            const layoutRect = layoutContainer.getBoundingClientRect();

            // Update width dynamically on every call (on resize)
            const viewportWidth = window.innerWidth;
            const desiredWidth = Math.min(Math.max(viewportWidth * 0.15, 180), 400);
            this.container.style.width = `${desiredWidth}px`;

            // Position TOC container relative to #thread
            this.container.style.top = `${headerHeight}px`;
            this.container.style.left = `${sidebarWidth}px`;

            // Height: fill from below header to bottom of layout container viewport
            this.container.style.height = `${layoutRect.height - headerHeight}px`;
        };

        // Initial call
        updateTOCPosition();

        // Update on window resize
        window.addEventListener("resize", updateTOCPosition);

    }

    static updateTOC() {
        const userMessages = UserMessageExtractor.extractAllMessages();
        // Clear old TOC content before recreating list
        this.container.querySelector("#listContainer")?.remove();
        this.createList(userMessages);
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

// Mutation observer - updates the TOC
function setupMutationObserver() {

    const chatMessagesContainer = document.querySelector('div[class*="@thread-xl/thread:pt-header-height"]');

        if (chatMessagesContainer) {
            console.log('Chat messages container found. Setting up observer.');

        const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
            // Check added nodes
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'article') {
                console.log('New <article> added:', node);
                TOCDiv.updateTOC();
                }
            });
            }
        }
        });

        observer.observe(chatMessagesContainer, {
            childList: true,
            subtree: true
        });
    } else {
        console.warn('Chat message container NOT found.');
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
    setupMutationObserver();
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