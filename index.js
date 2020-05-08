const messageList = document.querySelector("#message-list");
const messageListJQ = $("#message-list");

const getLatestMessageBlock = () => $(".message-block").last();

const getLatestBlockDirection = () => {
  const possibleDirections = ["inbound", "outbound"];
  for (direction of possibleDirections) {
    if (getLatestMessageBlock().hasClass(direction)) return direction;
  }
  return null;
};

const newMessageBlock = (direction) => {
  return $(`<div class="message-block ${direction}"></div>`);
};

const newMessage = (messageContent, direction) => {
  return $(`
    <div class="message hidden animate-entry ${direction}">
      <div class="message__content">${messageContent}</div>
    </div>
  `);
};

const addUserMessage = async (messageContent) => {
  const message = newMessage(messageContent, "outbound");

  if (getLatestBlockDirection() === "outbound") {
    getLatestMessageBlock().append(message);
  } else {
    const messageBlock = newMessageBlock("outbound").append(message);
    messageListJQ.append(messageBlock);
  }

  await delay(10); // Delay so that CSS can manage the transition from hidden
  message.removeClass("hidden");
};

const addBotMessage = async (messageContent) => {
  const message = newMessage(messageContent, "inbound");
  console.log("message", message);
  console.log("latest block dir", getLatestBlockDirection());
  //await some time
  if (getLatestBlockDirection() === "inbound") {
    getLatestMessageBlock().append(message);
  } else {
    const messageBlock = newMessageBlock("inbound").append(message);
    console.log("messageBlock", messageBlock);
    messageListJQ.append(messageBlock);
  }

  await delay(10); // Delay so that CSS can manage the transition from hidden
  message.removeClass("hidden");
};

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
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "animate-entry", type);
  messageDiv.appendChild(messageContent(content));
  return messageDiv;
};

const messageElements = INITIAL_MESSAGES.map((message) =>
  messageElement(message)
);

messageElements.forEach((messageElement) => messageList.append(messageElement));

const form = document.getElementById("input-form");
const inputField = document.getElementById("input-message");
const recipientStatus = document.getElementById("recipient-status");

const sendMessage = (content) => {
  appendMessage({ type: "outbound", content: content });
};

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const setRecipientStatus = (status) => {
  switch (status) {
    case "typing":
      recipientStatus.classList.add("typing");
      recipientStatus.innerText = "is typing";
      return;
    case "online":
      recipientStatus.classList.remove("typing");
      recipientStatus.innerText = "Online";
      return;
    default:
      return;
  }
};

const receiveMessage = async (response) => {
  // Split bot response into separate messages by sentence
  // TODO handle ellipses
  messages = response.split(".").filter((message) => message !== " ");

  await delay(1000); // Bot waits to respond

  for (const message of messages) {
    setRecipientStatus("typing");
    await delay(messageTypingDurationMS(message));
    appendMessage({ type: "inbound", content: message });
  }
  setRecipientStatus("online");
};

const appendMessage = async ({ content, type }) => {
  const message = messageElement({
    type: type,
    content: content,
  });
  message.classList.add("hidden"); // Hide message when first adding to DOM to allow animation
  messageList.append(message);
  await delay(10); // Delay so that CSS can manage the transition from hidden
  message.classList.remove("hidden");
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
