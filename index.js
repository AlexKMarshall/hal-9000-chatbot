const RESPONSES = ["response 1", "response 2", "response 3", "response x"];

const getBotResponse = () => {
  const randomIndex = Math.floor(Math.random() * RESPONSES.length);
  console.log(randomIndex);
  return RESPONSES[randomIndex];
};

const INITIAL_MESSAGES = [];

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
  appendMessage({ type: "outbound", content: content });
};

const receiveMessage = (content) => {
  appendMessage({ type: "inbound", content: content });
};

const appendMessage = ({ content, type }) => {
  const message = messageElement({
    type: type,
    content: content,
  });
  messageContainer.append(message);
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(inputField.value);
  inputField.value = "";
  receiveMessage(getBotResponse());
});
