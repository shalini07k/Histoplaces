// Toggle the visibility of the chatbot window
function toggleChat() {
    const chatWindow = document.getElementById("chatWindow");
    chatWindow.style.display = chatWindow.style.display === "block" ? "none" : "block";
}

// Fetch monument information from Wikipedia and generate a Google Image search link
async function getMonumentInfo() {
    const query = document.getElementById("chatInput").value.trim();
    const chatLog = document.getElementById("chatLog");

    if (query === "") return;

    // Display user's question in the chat log
    chatLog.innerHTML += `<div><strong>You:</strong> ${query}</div>`;
    chatLog.innerHTML += `<div><em>Bot is typing...</em></div>`;

    try {
        // Call Wikipedia REST API for summary
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        const data = await response.json();

        let summary = data.extract || "Sorry, I couldn't find information about that monument.";

        // Limit the summary to about 800 characters (~200 words)
        if (summary.length > 800) {
            summary = summary.substring(0, 800) + "...";
        }

        // Generate a Google Image search URL
        const imageSearchUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query + " monument")}`;

        // Replace the "Bot is typing..." message with the actual response
        chatLog.innerHTML = chatLog.innerHTML.replace(
            `<em>Bot is typing...</em>`,
            `<div><strong>Bot:</strong> ${summary}</div>
             <div><a href="${imageSearchUrl}" target="_blank">🖼️ Click here to view an image</a></div>`
        );
    } catch (error) {
        // In case of an error, show fallback message
        chatLog.innerHTML = chatLog.innerHTML.replace(
            `<em>Bot is typing...</em>`,
            `<div><strong>Bot:</strong> Sorry, something went wrong while fetching the information. Please try again.</div>`
        );
        console.error("Error fetching data:", error);
    }

    // Clear input and scroll chat to the bottom
    document.getElementById("chatInput").value = "";
    chatLog.scrollTop = chatLog.scrollHeight;
}
