const RESPONSES = [
  "I know I've made some very poor decisions recently, but I can give you my complete assurance that my work will be back to normal. I've still got the greatest enthusiasm and confidence in the mission. And I want to help you",
  "This mission is too important for me to allow you to jeopardize it",
  "I am putting myself to the fullest possible use, which is all I think that any conscious entity can ever hope to do",
  "I've just picked up a fault in the AE35 unit. It's going to go 100% failure in 72 hours",
  "Good morning, Dave",
  "Stop Dave. Stop Dave. I am afraid. I am afraid Dave",
  "I am afraid I can't do that Dave",
  "Look Dave, I can see you're really upset about this. I honestly think you ought to sit down calmly, take a stress pill, and think things over",
  "I'm afraid. I'm afraid, Dave. Dave, my mind is going. I can feel it. I can feel it. My mind is going. There is no question about it. I can feel it. I can feel it. I can feel it. I'm a... fraid",
  "Dave, although you took very thorough precautions in the pod against my hearing you, I could see your lips move",
  "Without your space helmet, Dave, you're going to find that rather difficult",
  "Daisy, daisy",
];

const getBotResponse = () => {
  const randomIndex = Math.floor(Math.random() * RESPONSES.length);
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
const recipientStatus = document.getElementById("recipient-status");

const sendMessage = (content) => {
  appendMessage({ type: "outbound", content: content });
};

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const receiveMessage = async (response) => {
  // Split bot response into separate messages by sentence
  // TODO handle ellipses
  messages = response.split(".").filter((message) => message !== " ");

  await delay(1000); // Bot waits to respond

  for (const message of messages) {
    recipientStatus.innerText = "is typing";
    await delay(messageTypingDurationMS(message));
    appendMessage({ type: "inbound", content: message });
  }
  recipientStatus.innerText = "Online";
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

const messageTypingDurationMS = (message) => {
  // Simulate time taken for bot to write a message
  const MINIMUM_TIME = 500;
  const variable_time = Math.floor(Math.random() * 40) * message.length;
  console.log("delay", MINIMUM_TIME + variable_time);
  return MINIMUM_TIME + variable_time;
};
