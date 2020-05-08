const messageList = document.querySelector("#message-list");
const messageListJQ = $("#message-list");
const form = document.getElementById("input-form");
const formJQ = $("form");
const inputField = document.getElementById("input-message");
const inputJQ = $("input");
const recipientStatus = document.getElementById("recipient-status");
const recipientStatusJQ = $("#recipient-status");

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

  if (getLatestBlockDirection() === "inbound") {
    getLatestMessageBlock().append(message);
  } else {
    const messageBlock = newMessageBlock("inbound").append(message);
    messageListJQ.append(messageBlock);
  }

  await delay(10); // Delay so that CSS can manage the transition from hidden
  message.removeClass("hidden");
};

const botResponds = async () => {
  // Split bot response into separate messages by sentence
  // TODO handle ellipses
  const messages = getBotResponse()
    .split(".")
    .filter((message) => message !== " ");

  await delay(1000); // Bot waits before responding

  for (const message of messages) {
    setRecipientStatus("typing");
    await delay(messageTypingDurationMS(message)); //Bot spends time typing
    addBotMessage(message);
  }
  setRecipientStatus("online");
};

const setRecipientStatus = (status) => {
  switch (status) {
    case "typing":
      recipientStatusJQ.addClass("typing");
      recipientStatusJQ.text("is typing");
      return;
    case "online":
      recipientStatusJQ.removeClass("typing");
      recipientStatusJQ.text("Online");
      return;
    default:
      return;
  }
};

formJQ.submit((event) => {
  event.preventDefault();
  addUserMessage(inputField.value);
  inputField.value = "";
  botResponds();
});

// STUFF BELOW THIS IS OLD

// const INITIAL_MESSAGES = [];

// const messageContent = (content) => {
//   const div = document.createElement("div");
//   div.classList.add("message__content");
//   div.innerText = content;
//   return div;
// };

// const messageElement = ({ type, content }) => {
//   const messageDiv = document.createElement("div");
//   messageDiv.classList.add("message", "animate-entry", type);
//   messageDiv.appendChild(messageContent(content));
//   return messageDiv;
// };

// const messageElements = INITIAL_MESSAGES.map((message) =>
//   messageElement(message)
// );

// messageElements.forEach((messageElement) => messageList.append(messageElement));

// const sendMessage = (content) => {
//   appendMessage({ type: "outbound", content: content });
// };

// const receiveMessage = async (response) => {
//   // Split bot response into separate messages by sentence
//   // TODO handle ellipses
//   messages = response.split(".").filter((message) => message !== " ");

//   await delay(1000); // Bot waits to respond

//   for (const message of messages) {
//     setRecipientStatus("typing");
//     await delay(messageTypingDurationMS(message));
//     appendMessage({ type: "inbound", content: message });
//   }
//   setRecipientStatus("online");
// };

// const appendMessage = async ({ content, type }) => {
//   const message = messageElement({
//     type: type,
//     content: content,
//   });
//   message.classList.add("hidden"); // Hide message when first adding to DOM to allow animation
//   messageList.append(message);
//   await delay(10); // Delay so that CSS can manage the transition from hidden
//   message.classList.remove("hidden");
// };

// // form.addEventListener("submit", (event) => {
// //   event.preventDefault();
// //   sendMessage(inputField.value);
// //   inputField.value = "";
// //   receiveMessage(getBotResponse());
// // });
