const messageList = $("#message-list");
const form = $("form");
const input = $("input");
const recipientStatus = $("#recipient-status");
const avatar = $(".avatar");

const getLatestMessageBlock = () => $(".message-block").last();

const getLatestBlockDirection = () => {
  const possibleDirections = ["inbound", "outbound"];
  for (direction of possibleDirections) {
    if (getLatestMessageBlock().hasClass(direction)) return direction;
  }
  return null;
};

const newMessageBlock = (direction) =>
  $(`
    <div class="message-block ${direction}">
      <section class="messages">
      </section>
      <aside class="timestamp"></aside>
    </div>
  `);

const newMessage = (messageContent, direction) =>
  $(`
    <div class="message hidden animate-entry ${direction}">
      <div class="message__content">${messageContent}</div>
    </div>
  `);

const updateTimestamp = (messageBlock) =>
  messageBlock.children("aside.timestamp").text(currentTime());

const addMessage = async (messageContent, direction) => {
  const message = newMessage(messageContent, direction);

  let messageBlock;
  if (getLatestBlockDirection() === direction) {
    // Latest block is same direction so use it
    messageBlock = getLatestMessageBlock();
  } else {
    // Latest block is in other direction so create new block
    messageBlock = newMessageBlock(direction);
    messageList.append(messageBlock);
  }

  messageBlock.children("section.messages").append(message);
  updateTimestamp(messageBlock);

  await delay(10); // Delay so that CSS can manage the transition from hidden
  message.removeClass("hidden");
};

const addUserMessage = async (messageContent) => {
  addMessage(messageContent, "outbound");
};

const addBotMessage = async (messageContent) => {
  addMessage(messageContent, "inbound");
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
      recipientStatus.addClass("typing");
      recipientStatus.text("is typing");
      avatar.addClass("typing");
      return;
    case "online":
      recipientStatus.removeClass("typing");
      recipientStatus.text("Online");
      avatar.removeClass("typing");
      return;
    default:
      return;
  }
};

form.submit((event) => {
  event.preventDefault();
  const message = input.val().trim();
  if (!message) return;

  addUserMessage(message);
  input.val("");
  botResponds();
});
