(function () {
  const button = document.getElementById("openSurprise");
  const giftBox = document.getElementById("giftBox");
  const giftSparkles = document.getElementById("giftSparkles");
  const status = document.getElementById("surpriseStatus");
  const welcomeSection = document.getElementById("welcomeSection");
  const wishSection = document.getElementById("wishSection");
  const memorySection = document.getElementById("memorySection");
  const admireSection = document.getElementById("admireSection");
  const surpriseSection = document.getElementById("surpriseSection");
  const letterSection = document.getElementById("letterSection");
  const finaleSection = document.getElementById("finaleSection");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sparklePoints = [
    [-72, -94],
    [-42, -122],
    [-12, -104],
    [24, -132],
    [58, -98],
    [86, -118],
    [-92, -62],
    [92, -68],
  ];

  const confettiPoints = [
    [-112, -94, "#c9b6ff"],
    [-82, -140, "#fff9fc"],
    [-52, -110, "#c88673"],
    [-18, -154, "#f8d7e8"],
    [22, -128, "#c9b6ff"],
    [56, -160, "#fff9fc"],
    [92, -112, "#c88673"],
    [122, -86, "#f8d7e8"],
    [-34, -78, "#b86b8e"],
    [38, -82, "#b86b8e"],
  ];

  function createParticle(className, x, y, index, color) {
    const particle = document.createElement("span");
    particle.className = className;
    particle.style.setProperty("--x", `${x}px`);
    particle.style.setProperty("--y", `${y}px`);
    particle.style.animationDelay = `${index * 28}ms`;

    if (className === "confetti-piece") {
      particle.style.setProperty("--confetti-color", color);
      particle.style.setProperty("--rotation", `${160 + index * 37}deg`);
    }

    giftSparkles.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }

  function burstSparkles() {
    sparklePoints.forEach(([x, y], index) => {
      createParticle("gift-particle", x, y, index);
    });

    confettiPoints.forEach(([x, y, color], index) => {
      createParticle("confetti-piece", x, y, index, color);
    });
  }

  window.goToNextPage = function goToNextPage() {
    welcomeSection.classList.add("is-transitioning");

    window.setTimeout(
      () => {
        welcomeSection.classList.add("is-fading-out");
        wishSection.classList.add("is-active");
        wishSection.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      },
      reduceMotion ? 20 : 240
    );

    window.setTimeout(
      () => {
        wishSection.focus({ preventScroll: true });
        window.dispatchEvent(new CustomEvent("birthday-surprise-ready"));
      },
      reduceMotion ? 80 : 760
    );
  };

  function openGift() {
    if (giftBox.classList.contains("is-open")) {
      return;
    }

    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
    button.textContent = "Opening...";
    giftBox.classList.add("is-open");
    status.textContent = "Your birthday surprise is opening.";

    if (!reduceMotion) {
      burstSparkles();
    }

    window.setTimeout(
      () => {
        button.textContent = "Surprise Ready";
        status.textContent = "Your birthday surprise is ready.";
        window.goToNextPage();
      },
      reduceMotion ? 120 : 780
    );
  }

  button.addEventListener("click", openGift);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            wishSection.classList.add("is-active");
          }
        });
      },
      { threshold: 0.35 }
    );

    sectionObserver.observe(wishSection);
  }

  // ===== WISH BOWL LOGIC =====
  const wishBowlButton = document.getElementById("wishBowlButton");
  const wishCounter = document.getElementById("wishCounter");
  const wishCard = document.getElementById("wishCard");
  const wishName = document.getElementById("wishName");
  const wishMessage = document.getElementById("wishMessage");
  const wishComplete = document.getElementById("wishComplete");
  const resetBowl = document.getElementById("resetBowl");
  const continueToGallery = document.getElementById("continueToGallery");

  const wishes = [
    {
      name: "Priya",
      message: "Happy Birthday! May this year bring you soft mornings, loud laughter, and every little joy you deserve.",
    },
    {
      name: "Ananya",
      message: "Wishing you a day as graceful, bright, and unforgettable as your smile. Keep glowing always.",
    },
    {
      name: "Meera",
      message: "May your heart stay light, your dreams stay bold, and your year feel beautifully yours.",
    },
    {
      name: "Aisha",
      message: "Happy Birthday! I hope today wraps you in love, warmth, and the sweetest kind of magic.",
    },
    {
      name: "Nisha",
      message: "You make ordinary moments feel special. I hope your birthday gives that same magic back to you.",
    },
    {
      name: "Kavya",
      message: "May every surprise today remind you how deeply you are loved and celebrated.",
    },
    {
      name: "Riya",
      message: "Here is to more beautiful memories, brave dreams, and happiness that finds you everywhere.",
    },
    {
      name: "Sana",
      message: "Happy Birthday to someone who carries kindness like a quiet sparkle. Never stop being you.",
    },
    {
      name: "Diya",
      message: "May your new year be filled with peaceful days, exciting beginnings, and people who adore you.",
    },
    {
      name: "Ishita",
      message: "You deserve a birthday that feels gentle, golden, and full of the love you give everyone else.",
    },
    {
      name: "Tara",
      message: "Sending you a wish for confidence, calm, and all the beautiful things waiting around the corner.",
    },
    {
      name: "Neha",
      message: "Happy Birthday! May today be the start of a year that surprises you in the loveliest ways.",
    },
  ];

  let openedWishIndexes = [];
  let isOpeningWish = false;

  function updateCounter() {
    const remaining = wishes.length - openedWishIndexes.length;

    if (openedWishIndexes.length === 0) {
      wishCounter.textContent = `${wishes.length} Wishes Waiting For You`;
      return;
    }

    wishCounter.textContent = `${remaining} ${remaining === 1 ? "Wish" : "Wishes"} Remaining`;
  }

  function getRandomUnopenedWishIndex() {
    const unopenedIndexes = wishes
      .map((wish, index) => index)
      .filter((index) => !openedWishIndexes.includes(index));
    const randomIndex = Math.floor(Math.random() * unopenedIndexes.length);

    return unopenedIndexes[randomIndex];
  }

  function createRisingNote() {
    const risingNote = document.createElement("span");
    risingNote.className = "rising-note";
    wishBowlButton.appendChild(risingNote);
    risingNote.addEventListener("animationend", () => risingNote.remove(), {
      once: true,
    });
  }

  function revealWish(wish) {
    wishName.textContent = wish.name;
    wishMessage.textContent = wish.message;
    wishCard.hidden = false;
    wishCard.classList.remove("is-visible");
    void wishCard.offsetWidth;
    wishCard.classList.add("is-visible");
  }

  function showCompleteState() {
    wishComplete.hidden = false;
    wishBowlButton.disabled = true;
    wishBowlButton.setAttribute("aria-disabled", "true");
  }

  function goToMemoryGallery() {
    wishSection.classList.add("is-turning-page");

    window.setTimeout(
      () => {
        memorySection.classList.add("is-entering");
        memorySection.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      },
      reduceMotion ? 20 : 180
    );

    window.setTimeout(
      () => {
        memorySection.focus({ preventScroll: true });
      },
      reduceMotion ? 80 : 920
    );
  }

  function openRandomWish() {
    if (isOpeningWish || openedWishIndexes.length === wishes.length) {
      return;
    }

    isOpeningWish = true;
    wishBowlButton.disabled = true;
    wishBowlButton.classList.add("is-opening");

    if (!reduceMotion) {
      createRisingNote();
    }

    const wishIndex = getRandomUnopenedWishIndex();
    const selectedWish = wishes[wishIndex];
    openedWishIndexes.push(wishIndex);

    window.setTimeout(
      () => {
        revealWish(selectedWish);
        updateCounter();

        if (openedWishIndexes.length === wishes.length) {
          showCompleteState();
        } else {
          wishBowlButton.disabled = false;
          wishBowlButton.removeAttribute("aria-disabled");
        }

        wishBowlButton.classList.remove("is-opening");
        isOpeningWish = false;
      },
      reduceMotion ? 80 : 720
    );
  }

  function addButtonRipple(event) {
    if (reduceMotion) {
      return;
    }

    const ripple = document.createElement("span");
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.className = "button-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    event.currentTarget.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  }

  function resetWishBowl(event) {
    openedWishIndexes = [];
    isOpeningWish = false;
    wishCard.hidden = true;
    wishCard.classList.remove("is-visible");
    wishComplete.hidden = true;
    wishBowlButton.disabled = false;
    wishBowlButton.removeAttribute("aria-disabled");
    wishBowlButton.classList.remove("is-opening");
    updateCounter();
    wishBowlButton.focus({ preventScroll: true });
  }

  wishBowlButton.addEventListener("click", openRandomWish);
  resetBowl.addEventListener("click", resetWishBowl);
  resetBowl.addEventListener("pointerdown", addButtonRipple);
  continueToGallery.addEventListener("click", goToMemoryGallery);
  continueToGallery.addEventListener("pointerdown", addButtonRipple);
  updateCounter();

  // ===== MEMORY GALLERY LOGIC =====
  const memoryCards = Array.from(document.querySelectorAll(".memory-card"));
  const memoryButtons = Array.from(document.querySelectorAll(".memory-photo-button"));
  const memoryProgress = document.getElementById("memoryProgress");
  const lightbox = document.getElementById("memoryLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxDate = document.getElementById("lightboxDate");
  const lightboxProgress = document.getElementById("lightboxProgress");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const journeyButton = document.getElementById("journeyButton");
  let currentMemoryIndex = 0;
  let previousFocus = null;
  let touchStartX = 0;

  const memories = memoryCards.map((card) => {
    const image = card.querySelector("img");
    const title = card.querySelector("h3");
    const caption = card.querySelector("p");
    const date = card.querySelector("time");

    return {
      image: image.currentSrc || image.src,
      alt: image.alt,
      title: title.textContent,
      caption: caption.textContent,
      date: date.textContent,
      datetime: date.getAttribute("datetime"),
    };
  });

  function createAdmirePetals() {
    if (reduceMotion) {
      return;
    }

    const petals = [
      [-180, -130, "160deg"],
      [-126, -184, "220deg"],
      [-68, -142, "280deg"],
      [8, -196, "340deg"],
      [74, -152, "410deg"],
      [138, -188, "470deg"],
      [188, -124, "540deg"],
      [-26, -238, "300deg"],
    ];

    petals.forEach(([x, y, rotation], index) => {
      const petal = document.createElement("span");
      petal.className = "celebration-petal";
      petal.style.setProperty("--x", `${x}px`);
      petal.style.setProperty("--y", `${y}px`);
      petal.style.setProperty("--rotation", rotation);
      petal.style.animationDelay = `${index * 45}ms`;
      admireSection.appendChild(petal);
      petal.addEventListener("animationend", () => petal.remove(), { once: true });
    });
  }

  window.goToAdmireSection = function goToAdmireSection() {
    memorySection.classList.add("is-flipping-page");
    createAdmirePetals();

    window.setTimeout(
      () => {
        admireSection.classList.add("is-entering");
        admireSection.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      },
      reduceMotion ? 20 : 160
    );

    window.setTimeout(
      () => {
        admireSection.focus({ preventScroll: true });
      },
      reduceMotion ? 80 : 920
    );
  };

  function updateMemoryProgress(index) {
    const progressText = `Memory ${index + 1} / ${memories.length}`;
    memoryProgress.textContent = progressText;
    lightboxProgress.textContent = progressText;
  }

  function renderLightbox(index) {
    const memory = memories[index];
    currentMemoryIndex = index;
    lightboxImage.src = memory.image;
    lightboxImage.alt = memory.alt;
    lightboxTitle.textContent = memory.title;
    lightboxCaption.textContent = memory.caption;
    lightboxDate.textContent = memory.date;
    lightboxDate.setAttribute("datetime", memory.datetime);
    updateMemoryProgress(index);
  }

  function openLightbox(index, trigger) {
    previousFocus = trigger;
    renderLightbox(index);
    lightbox.hidden = false;
    document.body.classList.add("is-lightbox-open");
    requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
      lightboxClose.focus({ preventScroll: true });
    });
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.hidden = true;
    document.body.classList.remove("is-lightbox-open");

    if (previousFocus) {
      previousFocus.focus({ preventScroll: true });
    }
  }

  function showMemory(direction) {
    const nextIndex = (currentMemoryIndex + direction + memories.length) % memories.length;
    renderLightbox(nextIndex);
  }

  function handleLightboxKeydown(event) {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Tab") {
      const focusableElements = Array.from(
        lightbox.querySelectorAll("button, [href], [tabindex]:not([tabindex='-1'])")
      ).filter((element) => !element.disabled);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showMemory(-1);
    }

    if (event.key === "ArrowRight") {
      showMemory(1);
    }
  }

  function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].clientX;
  }

  function handleTouchEnd(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < 45) {
      return;
    }

    showMemory(swipeDistance > 0 ? -1 : 1);
  }

  if ("IntersectionObserver" in window) {
    const memoryObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const index = Number(card.dataset.memoryIndex);
            card.classList.add("is-visible");
            updateMemoryProgress(index);
            memoryObserver.unobserve(card);
          }
        });
      },
      { root: null, threshold: 0.28 }
    );

    memoryCards.forEach((card) => memoryObserver.observe(card));
  } else {
    memoryCards.forEach((card) => card.classList.add("is-visible"));
  }

  memoryButtons.forEach((memoryButton, index) => {
    memoryButton.addEventListener("click", () => openLightbox(index, memoryButton));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", () => showMemory(-1));
  lightboxNext.addEventListener("click", () => showMemory(1));
  lightbox.addEventListener("touchstart", handleTouchStart, { passive: true });
  lightbox.addEventListener("touchend", handleTouchEnd);
  document.addEventListener("keydown", handleLightboxKeydown);
  journeyButton.addEventListener("click", window.goToAdmireSection);
  journeyButton.addEventListener("pointerdown", addButtonRipple);
  updateMemoryProgress(0);

  // ===== COMPLIMENT CARD LOGIC =====
  const complimentCards = Array.from(document.querySelectorAll(".compliment-card"));
  const complimentCounter = document.getElementById("complimentCounter");
  const complimentComplete = document.getElementById("complimentComplete");
  const surpriseSectionButton = document.getElementById("surpriseSectionButton");
  const openedCompliments = new Set();

  function createSurpriseTransitionPetals() {
    if (reduceMotion) {
      return;
    }

    const petals = [
      [-210, -110, "180deg"],
      [-152, -176, "250deg"],
      [-84, -132, "320deg"],
      [-10, -212, "390deg"],
      [64, -146, "450deg"],
      [132, -190, "520deg"],
      [198, -118, "600deg"],
      [28, -246, "670deg"],
    ];

    petals.forEach(([x, y, rotation], index) => {
      const petal = document.createElement("span");
      petal.className = "celebration-petal";
      petal.style.setProperty("--x", `${x}px`);
      petal.style.setProperty("--y", `${y}px`);
      petal.style.setProperty("--rotation", rotation);
      petal.style.animationDelay = `${index * 42}ms`;
      surpriseSection.appendChild(petal);
      petal.addEventListener("animationend", () => petal.remove(), { once: true });
    });
  }

  window.goToSurpriseSection = function goToSurpriseSection() {
    admireSection.classList.add("is-swirling-away");
    createSurpriseTransitionPetals();

    window.setTimeout(
      () => {
        surpriseSection.classList.add("is-entering");
        surpriseSection.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      },
      reduceMotion ? 20 : 160
    );

    window.setTimeout(
      () => {
        surpriseSection.focus({ preventScroll: true });
        window.dispatchEvent(new CustomEvent("birthday-final-surprise-ready"));
      },
      reduceMotion ? 80 : 940
    );
  };

  function updateComplimentCounter() {
    complimentCounter.textContent = `${openedCompliments.size} of ${complimentCards.length} little compliments discovered`;
  }

  function createComplimentCelebration() {
    if (reduceMotion) {
      return;
    }

    const petals = [
      [-170, -120, "140deg"],
      [-112, -170, "210deg"],
      [-52, -140, "270deg"],
      [0, -190, "330deg"],
      [58, -144, "390deg"],
      [116, -172, "460deg"],
      [172, -118, "520deg"],
      [26, -230, "610deg"],
      [-88, -220, "300deg"],
      [96, -224, "430deg"],
    ];

    petals.forEach(([x, y, rotation], index) => {
      const petal = document.createElement("span");
      petal.className = "celebration-petal";
      petal.style.setProperty("--x", `${x}px`);
      petal.style.setProperty("--y", `${y}px`);
      petal.style.setProperty("--rotation", rotation);
      petal.style.animationDelay = `${index * 38}ms`;
      admireSection.appendChild(petal);
      petal.addEventListener("animationend", () => petal.remove(), { once: true });
    });
  }

  function revealCompliment(card) {
    const complimentIndex = Number(card.dataset.complimentIndex);

    if (openedCompliments.has(complimentIndex)) {
      return;
    }

    openedCompliments.add(complimentIndex);
    card.classList.add("is-open");
    card.setAttribute("aria-pressed", "true");
    updateComplimentCounter();

    if (openedCompliments.size === complimentCards.length) {
      complimentComplete.hidden = false;
      createComplimentCelebration();
    }
  }

  complimentCards.forEach((card) => {
    card.setAttribute("aria-pressed", "false");
    card.addEventListener("click", () => revealCompliment(card));
  });

  surpriseSectionButton.addEventListener("click", window.goToSurpriseSection);
  surpriseSectionButton.addEventListener("pointerdown", addButtonRipple);
  updateComplimentCounter();

  // ===== SURPRISE DISCOVERY LOGIC =====
  const surpriseObjects = Array.from(document.querySelectorAll(".surprise-object"));
  const surpriseCounter = document.getElementById("surpriseCounter");
  const surpriseComplete = document.getElementById("surpriseComplete");
  const goldenSecretStar = document.getElementById("goldenSecretStar");
  const letterSectionButton = document.getElementById("letterSectionButton");
  const discoveredSurprises = new Set();
  let goldenStarFound = false;

  function createLetterTransitionPetals() {
    if (reduceMotion) {
      return;
    }

    const petals = [
      [-190, -124, "160deg"],
      [-138, -184, "230deg"],
      [-72, -148, "300deg"],
      [0, -218, "360deg"],
      [72, -150, "430deg"],
      [138, -188, "500deg"],
      [198, -126, "580deg"],
      [26, -252, "650deg"],
    ];

    petals.forEach(([x, y, rotation], index) => {
      const petal = document.createElement("span");
      petal.className = "celebration-petal";
      petal.style.setProperty("--x", `${x}px`);
      petal.style.setProperty("--y", `${y}px`);
      petal.style.setProperty("--rotation", rotation);
      petal.style.animationDelay = `${index * 42}ms`;
      letterSection.appendChild(petal);
      petal.addEventListener("animationend", () => petal.remove(), { once: true });
    });
  }

  window.goToLetterSection = function goToLetterSection() {
    surpriseSection.classList.add("is-opening-letter");
    createLetterTransitionPetals();

    window.setTimeout(
      () => {
        letterSection.classList.add("is-entering");
        letterSection.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      },
      reduceMotion ? 20 : 160
    );

    window.setTimeout(
      () => {
        letterSection.focus({ preventScroll: true });
        window.dispatchEvent(new CustomEvent("birthday-letter-ready"));
      },
      reduceMotion ? 80 : 940
    );
  };

  function updateSurpriseCounter() {
    surpriseCounter.textContent = `${discoveredSurprises.size} of ${surpriseObjects.length} surprises discovered`;
  }

  function createPetalCelebration(targetSection) {
    if (reduceMotion) {
      return;
    }

    const petals = [
      [-184, -118, "170deg"],
      [-126, -174, "230deg"],
      [-62, -136, "300deg"],
      [0, -204, "360deg"],
      [66, -142, "420deg"],
      [128, -176, "500deg"],
      [188, -122, "570deg"],
      [-24, -244, "640deg"],
      [90, -230, "470deg"],
    ];

    petals.forEach(([x, y, rotation], index) => {
      const petal = document.createElement("span");
      petal.className = "celebration-petal";
      petal.style.setProperty("--x", `${x}px`);
      petal.style.setProperty("--y", `${y}px`);
      petal.style.setProperty("--rotation", rotation);
      petal.style.animationDelay = `${index * 36}ms`;
      targetSection.appendChild(petal);
      petal.addEventListener("animationend", () => petal.remove(), { once: true });
    });
  }

  function revealSurprise(objectButton) {
    const surpriseIndex = Number(objectButton.dataset.surpriseIndex);

    if (discoveredSurprises.has(surpriseIndex)) {
      return;
    }

    discoveredSurprises.add(surpriseIndex);
    objectButton.classList.add("is-found");
    objectButton.setAttribute("aria-pressed", "true");
    updateSurpriseCounter();

    if (discoveredSurprises.size === surpriseObjects.length) {
      surpriseComplete.hidden = false;
      createPetalCelebration(surpriseSection);
    }
  }

  function revealGoldenStar() {
    if (goldenStarFound) {
      return;
    }

    goldenStarFound = true;
    goldenSecretStar.classList.add("is-found");
    goldenSecretStar.setAttribute("aria-pressed", "true");
    createPetalCelebration(surpriseSection);
  }

  surpriseObjects.forEach((objectButton) => {
    objectButton.setAttribute("aria-pressed", "false");
    objectButton.addEventListener("click", () => revealSurprise(objectButton));
  });

  goldenSecretStar.setAttribute("aria-pressed", "false");
  goldenSecretStar.addEventListener("click", revealGoldenStar);
  letterSectionButton.addEventListener("click", window.goToLetterSection);
  letterSectionButton.addEventListener("pointerdown", addButtonRipple);
  updateSurpriseCounter();

  // ===== LETTER ANIMATION LOGIC =====
  const envelopeButton = document.getElementById("envelopeButton");
  const letterPaper = document.getElementById("letterPaper");
  const letterLines = Array.from(document.querySelectorAll(".letter-line"));
  const showFullLetter = document.getElementById("showFullLetter");
  const letterEnd = document.getElementById("letterEnd");
  const finalSurpriseButton = document.getElementById("finalSurpriseButton");
  const musicToggle = document.getElementById("musicToggle");
  const musicToggleText = document.getElementById("musicToggleText");
  let letterTimers = [];
  let isLetterOpen = false;

  function createFinaleTransitionGlow() {
    if (reduceMotion) {
      return;
    }

    const petals = [
      [-180, -120, "180deg"],
      [-104, -178, "260deg"],
      [-34, -146, "340deg"],
      [38, -210, "420deg"],
      [112, -156, "500deg"],
      [188, -124, "580deg"],
    ];

    petals.forEach(([x, y, rotation], index) => {
      const petal = document.createElement("span");
      petal.className = "celebration-petal";
      petal.style.setProperty("--x", `${x}px`);
      petal.style.setProperty("--y", `${y}px`);
      petal.style.setProperty("--rotation", rotation);
      petal.style.animationDelay = `${index * 45}ms`;
      finaleSection.appendChild(petal);
      petal.addEventListener("animationend", () => petal.remove(), { once: true });
    });
  }

  window.goToFinalSurpriseSection = function goToFinalSurpriseSection() {
    letterSection.classList.add("is-final-transition");
    createFinaleTransitionGlow();

    window.setTimeout(
      () => {
        finaleSection.classList.add("is-entering");
        finaleSection.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      },
      reduceMotion ? 20 : 160
    );

    window.setTimeout(
      () => {
        finaleSection.focus({ preventScroll: true });
        window.dispatchEvent(new CustomEvent("birthday-last-surprise-ready"));
      },
      reduceMotion ? 80 : 940
    );
  };

  function clearLetterTimers() {
    letterTimers.forEach((timer) => window.clearTimeout(timer));
    letterTimers = [];
  }

  function showLetterEnd() {
    letterEnd.hidden = false;
  }

  function revealFullLetter() {
    clearLetterTimers();
    letterLines.forEach((line) => line.classList.add("is-visible"));
    showFullLetter.hidden = true;
    showLetterEnd();
  }

  function revealLetterLines() {
    if (reduceMotion) {
      revealFullLetter();
      return;
    }

    letterLines.forEach((line, index) => {
      const timer = window.setTimeout(() => {
        line.classList.add("is-visible");

        if (index === letterLines.length - 1) {
          showFullLetter.hidden = true;
          showLetterEnd();
        }
      }, index * 620);

      letterTimers.push(timer);
    });
  }

  function openLetter() {
    if (isLetterOpen) {
      return;
    }

    isLetterOpen = true;
    envelopeButton.classList.add("is-open");
    envelopeButton.setAttribute("aria-expanded", "true");
    envelopeButton.disabled = true;

    window.setTimeout(
      () => {
        letterPaper.hidden = false;
        letterPaper.classList.add("is-unfolding");
        showFullLetter.hidden = false;
        revealLetterLines();
      },
      reduceMotion ? 80 : 920
    );
  }

  function toggleMusicPlaceholder() {
    const isPlaying = musicToggle.getAttribute("aria-pressed") === "true";
    musicToggle.setAttribute("aria-pressed", String(!isPlaying));
    musicToggleText.textContent = isPlaying ? "Play" : "Pause";
  }

  envelopeButton.setAttribute("aria-expanded", "false");
  envelopeButton.addEventListener("click", openLetter);
  showFullLetter.addEventListener("click", revealFullLetter);
  showFullLetter.addEventListener("pointerdown", addButtonRipple);
  musicToggle.addEventListener("click", toggleMusicPlaceholder);
  finalSurpriseButton.addEventListener("click", window.goToFinalSurpriseSection);
  finalSurpriseButton.addEventListener("pointerdown", addButtonRipple);

  // ===== CAKE CELEBRATION LOGIC =====
  const cakeButton = document.getElementById("cakeButton");
  const cakeActionButton = document.getElementById("cakeActionButton");
  const wishSentCard = document.getElementById("wishSentCard");
  const floatingWishLayer = document.getElementById("floatingWishLayer");
  const replayCelebration = document.getElementById("replayCelebration");
  const floatingWishMessages = [
    "Stay happy.",
    "Keep smiling.",
    "Enjoy your day.",
    "Shine brightly.",
    "Best wishes always.",
    "Beautiful memories ahead.",
    "A joyful year awaits.",
  ];
  let candlesAreLit = false;
  let wishWasMade = false;
  let floatingWishTimer = null;
  let settleTimer = null;

  function clearFinaleTimers() {
    if (floatingWishTimer) {
      window.clearInterval(floatingWishTimer);
      floatingWishTimer = null;
    }

    if (settleTimer) {
      window.clearTimeout(settleTimer);
      settleTimer = null;
    }
  }

  function createFinaleConfettiBurst() {
    if (reduceMotion) {
      return;
    }

    const colors = ["#f8d7e8", "#fff9fc", "#c88673", "#c9b6ff", "#fff3cf"];

    for (let index = 0; index < 18; index += 1) {
      const confetti = document.createElement("span");
      confetti.className = "confetti-piece";
      confetti.style.left = "50%";
      confetti.style.top = "42%";
      confetti.style.setProperty("--x", `${Math.round(Math.random() * 260 - 130)}px`);
      confetti.style.setProperty("--y", `${Math.round(Math.random() * -180 - 45)}px`);
      confetti.style.setProperty("--rotation", `${180 + index * 31}deg`);
      confetti.style.setProperty("--confetti-color", colors[index % colors.length]);
      finaleSection.appendChild(confetti);
      confetti.addEventListener("animationend", () => confetti.remove(), { once: true });
    }
  }

  function createFloatingWish() {
    if (reduceMotion) {
      return;
    }

    const wish = document.createElement("span");
    const message = floatingWishMessages[Math.floor(Math.random() * floatingWishMessages.length)];
    wish.className = "floating-birthday-wish";
    wish.textContent = message;
    wish.style.setProperty("--x", `${Math.floor(Math.random() * 68 + 10)}%`);
    wish.style.setProperty("--y", `${Math.floor(Math.random() * 48 + 18)}%`);
    floatingWishLayer.appendChild(wish);
    wish.addEventListener("animationend", () => wish.remove(), { once: true });
  }

  function lightCandles() {
    if (candlesAreLit && !wishWasMade) {
      return;
    }

    clearFinaleTimers();
    candlesAreLit = true;
    wishWasMade = false;
    finaleSection.classList.add("candles-lit");
    finaleSection.classList.remove("wish-made", "is-celebrating", "is-settled");
    wishSentCard.hidden = true;
    wishSentCard.classList.remove("is-visible");
    replayCelebration.hidden = true;
    cakeActionButton.textContent = "Make a Birthday Wish ✨";
    cakeButton.setAttribute("aria-label", "Make a birthday wish");
  }

  function startCelebration() {
    if (!candlesAreLit || wishWasMade) {
      lightCandles();
      return;
    }

    wishWasMade = true;
    candlesAreLit = false;
    finaleSection.classList.add("wish-made", "is-celebrating");
    finaleSection.classList.remove("candles-lit", "is-settled");
    cakeActionButton.textContent = "Wish Sent";
    cakeActionButton.disabled = true;
    cakeButton.disabled = true;
    wishSentCard.hidden = false;
    wishSentCard.classList.add("is-visible");
    replayCelebration.hidden = false;
    createFinaleConfettiBurst();
    createFloatingWish();

    if (!reduceMotion) {
      floatingWishTimer = window.setInterval(createFloatingWish, 850);
      settleTimer = window.setTimeout(() => {
        finaleSection.classList.add("is-settled");
        if (floatingWishTimer) {
          window.clearInterval(floatingWishTimer);
          floatingWishTimer = null;
        }
      }, 6500);
    }
  }

  function replayFinaleCelebration() {
    clearFinaleTimers();
    floatingWishLayer.innerHTML = "";
    cakeActionButton.disabled = false;
    cakeButton.disabled = false;
    lightCandles();
    window.setTimeout(startCelebration, reduceMotion ? 120 : 900);
  }

  cakeButton.addEventListener("click", () => {
    if (!candlesAreLit) {
      lightCandles();
    } else {
      startCelebration();
    }
  });
  cakeActionButton.addEventListener("click", startCelebration);
  cakeActionButton.addEventListener("pointerdown", addButtonRipple);
  replayCelebration.addEventListener("click", replayFinaleCelebration);
  replayCelebration.addEventListener("pointerdown", addButtonRipple);
})();
