const messages = [
  { type: "inbound", content: "a test message" },
  { type: "inbound", content: "next message" },
  { type: "outbound", content: "I sent this message" },
];

const messageContent = (content) => {
  const div = document.createElement("div");
  div.classList.add("message__content");
  div.innerText = content;
  return div;
};

const messageElement = (message) => {
  const li = document.createElement("li");
  li.classList.add("message", message.type);
  li.appendChild(messageContent(message.content));
  return li;
};

const messageElements = messages.map((message) => messageElement(message));

const messageContainer = document.getElementById("message-container");

messageElements.forEach((messageElement) =>
  messageContainer.append(messageElement)
);
