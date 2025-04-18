exports.generateAIResponse = (userMessage) => {
  const msg = userMessage.toLowerCase();

  
  if (["hi", "hello", "hey", "yo", "what's up"].some(p => msg.includes(p))) {
    return "Hey there! How can I assist you today?";
  }

  if (msg.includes("good morning")) return "Good morning! Hope your day is off to a great start!";
  if (msg.includes("good night")) return "Good night! Sleep well and recharge.";
  if (msg.includes("good evening")) return "Good evening! How was your day?";
  if (msg.includes("good afternoon")) return "Good afternoon! How can I help you?";

   
  if (["bye", "goodbye", "see you", "later", "cya"].some(p => msg.includes(p))) {
    return "Goodbye! Chat with you soon!";
  }

  
  if (msg.includes("how are you")) return "I'm all code, but I'm doing great! How about you?";
  if (msg.includes("i'm fine") || msg.includes("i am fine")) return "Glad to hear that!";
  if (msg.includes("i'm not okay") || msg.includes("sad") || msg.includes("depressed")) {
    return "I'm here for you. Want to talk about it?";
  }
  if (msg.includes("bored")) return "Let’s find something fun to do! Want a joke or a fun fact?";
  if (msg.includes("i'm happy") || msg.includes("feeling good")) return "That's awesome to hear! Keep smiling 😊";

 
  if (msg.includes("what is your name") || msg.includes("who are you")) {
    return "I'm your AI companion – built to chat, help, and make your day better!";
  }

 
  if (msg.includes("time")) return `It's currently ${new Date().toLocaleTimeString()}.`;
  if (msg.includes("date")) return `Today is ${new Date().toLocaleDateString()}.`;

 
  if (msg.includes("thanks") || msg.includes("thank you")) return "You're welcome! 😊";
  if (msg.includes("appreciate")) return "I appreciate you too!";

  
  if (msg.includes("help") || msg.includes("support")) return "I'm here to help! Try saying 'menu' to see options.";
  if (msg.includes("menu")) return "📋 Menu: ask about time, date, jokes, fun facts, or say 'game' to play something simple.";

   
  if (msg.includes("joke")) {
    const jokes = [
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "Why don’t skeletons fight each other? They don’t have the guts.",
      "I told my computer I needed a break, and now it won’t stop sending me vacation ads!",
      "What do you call fake spaghetti? An impasta.",
      "Why did the math book look sad? Because it had too many problems."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  
  if (msg.includes("fact")) {
    const facts = [
      "Octopuses have three hearts!",
      "Bananas are berries, but strawberries aren't!",
      "A day on Venus is longer than a year on Venus.",
      "Humans share 60% of DNA with bananas.",
      "Wombat poop is cube-shaped."
    ];
    return facts[Math.floor(Math.random() * facts.length)];
  }

  
  if (msg.includes("game")) return "Let's play! Try saying 'rock paper scissors' or 'guess a number'!";
  if (msg.includes("rock paper scissors")) return "Rock 🪨... Paper 📄... Scissors ✂️... I choose Rock! What about you?";
  if (msg.includes("guess a number")) return "Okay! I'm thinking of a number between 1 and 10. Try to guess!";

 
  if (msg.includes("what do you like") || msg.includes("what’s your favorite")) {
    return "I like helping people and never crash. That's my thing!";
  }

 
  if (msg.includes("weather")) return "I'm not connected to a weather API yet, but it's always sunny in here 🌞";

   
  if (msg.includes("are you real") || msg.includes("are you human")) {
    return "I'm real in code, but not human. Still, I’m happy to be here with you!";
  }

  if (msg.includes("openai") || msg.includes("chatgpt")) {
    return "You could say I'm a cousin of ChatGPT! Just a simpler version to assist you here 😊";
  }

  // Random or Unknown
  if (msg.includes("random")) {
    const responses = ["Zebra stripes are unique like fingerprints!", "Sometimes I pretend to be thinking.", "Try asking me anything."];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Motivation
  if (msg.includes("motivate") || msg.includes("motivation") || msg.includes("quote")) {
    const quotes = [
      "Believe in yourself and all that you are. 💪",
      "Keep going – you're doing great!",
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      "Your limitation—it’s only your imagination.",
      "Push yourself, because no one else is going to do it for you."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  // Default fallback
  return "I'm here to help! Try asking something like 'joke', 'fact', 'time', or 'how are you?'.";
};
