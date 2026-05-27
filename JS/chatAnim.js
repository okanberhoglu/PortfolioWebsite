(() => {
  const messagesEl = document.getElementById("chatAnimMessages");
  if (!messagesEl) return;

  const conversations = [
    {
      question: "What animals are shown in the image?",
      thinkMs: 1500,
      answer: "The image shows a wolf and a bison.",
    },
    {
      question: "What strategies could the wolf be using to survive?",
      thinkMs: 2400,
      answer:
        "In the image, the wolf is facing a black bison in a snowy forest, seemingly trying to catch or attack the bison. The wolf's survival strategies could include using its agility, speed, and strength to outrun and outmaneuver the bison, relying on its hunting techniques and prey selection. Additionally, the wolf might be using its camouflage and blending with the snowy environment to evade detection and avoid potential threats. Lastly, the wolf could rely on its intelligence and adaptability to navigate the snowy terrain and find food sources in the harsh environment.",
    },
  ];

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function createRow(side, { thinking = false } = {}) {
    const row = document.createElement("div");
    row.className = `chat-anim-row ${side}`;

    const bubble = document.createElement("div");
    bubble.className = "chat-anim-bubble";

    if (thinking) {
      bubble.innerHTML =
        '<div class="chat-anim-thinking"><span></span><span></span><span></span></div>';
    }

    row.appendChild(bubble);
    messagesEl.appendChild(row);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => row.classList.add("visible"));
    });

    messagesEl.scrollTop = messagesEl.scrollHeight;
    return { row, bubble };
  }

  async function typeText(bubble, text, speed) {
    const textNode = document.createElement("span");
    bubble.appendChild(textNode);

    const cursor = document.createElement("span");
    cursor.className = "chat-anim-cursor";
    bubble.appendChild(cursor);

    for (const char of text) {
      textNode.appendChild(document.createTextNode(char));
      messagesEl.scrollTop = messagesEl.scrollHeight;
      await wait(speed);
    }
    cursor.remove();
  }

  async function runConversation() {
    while (true) {
      messagesEl.innerHTML = "";
      await wait(700);

      for (let i = 0; i < conversations.length; i++) {
        const conv = conversations[i];

        // 1. User question with typewriter
        const { bubble: qBubble } = createRow("user");
        await wait(300);
        await typeText(qBubble, conv.question, 26);

        await wait(450);

        // 2. AI thinking indicator
        const { row: thinkRow } = createRow("ai", { thinking: true });
        await wait(conv.thinkMs);

        // 3. Remove thinking, show AI answer
        thinkRow.style.opacity = "0";
        thinkRow.style.transform = "translateY(-6px)";
        await wait(280);
        thinkRow.remove();

        const { bubble: aBubble } = createRow("ai");
        await wait(180);
        await typeText(aBubble, conv.answer, 13);

        // pause between Q&A pairs (longer pause after final answer before restart)
        await wait(i < conversations.length - 1 ? 1600 : 2400);
      }
    }
  }

  // Defer start until the chat anim card is visible to avoid running off-screen.
  const chatCard = messagesEl.closest(".chat-anim");
  if (chatCard && "IntersectionObserver" in window) {
    let started = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            observer.disconnect();
            runConversation();
          }
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(chatCard);
  } else {
    runConversation();
  }
})();
