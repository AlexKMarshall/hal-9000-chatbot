const INITIAL_MESSAGES = [
  { type: "inbound", content: "a test message" },
  { type: "inbound", content: "next message" },
  { type: "outbound", content: "I sent this message" },
];

const TEST_MESSAGE = { type: "outbound", content: "a sent message" };

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

const messageElements = INITIAL_MESSAGES.map((message) =>
  messageElement(message)
);

const messageContainer = document.getElementById("message-container");

messageElements.forEach((messageElement) =>
  messageContainer.append(messageElement)
);

const sendButton = document.getElementById("send");

sendButton.addEventListener("click", () => {
  const message = messageElement(TEST_MESSAGE);
  messageContainer.append(message);
});
