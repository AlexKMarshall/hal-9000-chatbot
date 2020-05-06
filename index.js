const INITIAL_MESSAGES = [
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

const messageElement = ({ type, content }) => {
  const li = document.createElement("li");
  li.classList.add("message", type);
  li.appendChild(messageContent(content));
  return li;
};

const messageElements = INITIAL_MESSAGES.map((message) =>
  messageElement(message)
);

const messageContainer = document.getElementById("message-container");

messageElements.forEach((messageElement) =>
  messageContainer.append(messageElement)
);

const form = document.getElementById("input-form");

const inputField = document.getElementById("input-message");

const sendMessage = (content) => {
  const message = messageElement({
    type: "outbound",
    content: content,
  });
  messageContainer.append(message);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(inputField.value);
  inputField.value = "";
});
