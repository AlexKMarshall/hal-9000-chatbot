const messageListJQ = $("#message-list");
const formJQ = $("form");
const inputJQ = $("input");
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
  const message = inputJQ.val().trim();
  if (!message) return;

  addUserMessage(message);
  inputJQ.val("");
  botResponds();
});
