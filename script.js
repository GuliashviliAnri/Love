"use strict";

/*
  აქ შეცვალე მხოლოდ სახელები.
  HTML-ში ჩაწერილ წერილს JavaScript აღარ შეცვლის.
*/

const siteData = {
  herName: "მედეა",
  yourName: "ანრი"
};

/*
  ერთი მიზეზის ხანგრძლივობა.
  5000 ნიშნავს 5 წამს.
*/

const reasonDuration = 5000;

/*
  საჭირო ელემენტები
*/

const openGiftButton = document.getElementById("openGiftButton");
const giftContent = document.getElementById("giftContent");

const nextSectionButton = document.getElementById(
  "nextSectionButton"
);

const reasonsSection = document.getElementById("reasonsSection");

const reasonButtons = Array.from(
  document.querySelectorAll(".reason-button")
);

const reasonIcon = document.getElementById("reasonIcon");
const reasonTitle = document.getElementById("reasonTitle");
const reasonText = document.getElementById("reasonText");
const reasonCard = document.getElementById("reasonCard");

const finalSurpriseButton = document.getElementById(
  "finalSurpriseButton"
);

const surpriseModal = document.getElementById("surpriseModal");

const closeModalButton = document.getElementById(
  "closeModalButton"
);

const modalOverlay = surpriseModal.querySelector(".modal-overlay");

const mainPhoto = document.getElementById("mainPhoto");
const photoFallback = document.getElementById("photoFallback");

/*
  მიზეზების ავტომატური გადართვა
*/

let currentReasonIndex = 0;
let reasonTimer = null;
let reasonAutoPlayStarted = false;

/*
  CSS-ის ბორდერის ანიმაციის დრო
  JavaScript-ის დროს ავტომატურად ემთხვევა.
*/

document.documentElement.style.setProperty(
  "--reason-duration",
  `${reasonDuration}ms`
);

/*
  სახელების ჩასმა
*/

function insertPersonalData() {
  const heroName = document.getElementById("heroName");
  const letterName = document.getElementById("letterName");
  const modalName = document.getElementById("modalName");
  const senderName = document.getElementById("senderName");

  heroName.textContent = siteData.herName;
  letterName.textContent = siteData.herName;
  modalName.textContent = siteData.herName;
  senderName.textContent = siteData.yourName;
}

/*
  ფოტოს შემოწმება
*/

function handlePhotoError() {
  mainPhoto.style.display = "none";
  photoFallback.style.display = "grid";
}

mainPhoto.addEventListener("error", handlePhotoError);

/*
  საჩუქრის გახსნა
*/

let giftOpened = false;

function openGift() {
  if (giftOpened) {
    giftContent.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    return;
  }

  giftOpened = true;

  openGiftButton.classList.add("opening");

  setTimeout(() => {
    giftContent.classList.add("visible");
    giftContent.setAttribute("aria-hidden", "false");

    revealSections();

    setTimeout(() => {
      giftContent.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 150);
  }, 650);
}

openGiftButton.addEventListener("click", openGift);

/*
  შემდეგ სექციაზე გადასვლა
*/

nextSectionButton.addEventListener("click", () => {
  reasonsSection.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  if (!reasonAutoPlayStarted) {
    startReasonAutoPlay();
  }
});

/*
  სექციების გამოჩენა
*/

function revealSections() {
  const revealItems = document.querySelectorAll(".reveal-item");

  revealItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add("visible");
    }, index * 180);
  });
}

/*
  მიზეზის ტექსტის შეცვლა
*/

function updateReasonContent(button) {
  reasonIcon.textContent = button.dataset.icon;
  reasonTitle.textContent = button.dataset.title;
  reasonText.textContent = button.dataset.text;

  reasonCard.animate(
    [
      {
        opacity: 0.4,
        transform: "translateY(10px) scale(0.98)"
      },
      {
        opacity: 1,
        transform: "translateY(0) scale(1)"
      }
    ],
    {
      duration: 350,
      easing: "ease-out"
    }
  );
}

/*
  მიზეზის აქტიურად მონიშვნა
*/

function activateReason(index) {
  if (index < 0 || index >= reasonButtons.length) {
    return;
  }

  currentReasonIndex = index;

  reasonButtons.forEach((button) => {
    button.classList.remove("active");
  });

  const activeButton = reasonButtons[currentReasonIndex];

  /*
    ბრაუზერს ვაიძულებთ ბორდერის ანიმაცია
    თავიდან გაუშვას.
  */

  void activeButton.offsetWidth;

  activeButton.classList.add("active");

  updateReasonContent(activeButton);
}

/*
  შემდეგ მიზეზზე გადასვლა
*/

function goToNextReason() {
  const nextIndex =
    (currentReasonIndex + 1) % reasonButtons.length;

  activateReason(nextIndex);
  scheduleNextReason();
}

/*
  5-წამიანი ავტომატური გადართვა
*/

function scheduleNextReason() {
  clearTimeout(reasonTimer);

  reasonTimer = setTimeout(() => {
    goToNextReason();
  }, reasonDuration);
}

/*
  ავტომატური გადართვის დაწყება
*/

function startReasonAutoPlay() {
  reasonAutoPlayStarted = true;

  activateReason(currentReasonIndex);
  scheduleNextReason();
}

/*
  მიზეზზე ხელით დაჭერა
*/

reasonButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    reasonAutoPlayStarted = true;

    activateReason(index);
    scheduleNextReason();
  });
});

/*
  თუ მიზეზების სექციამდე ხელით ჩამოსქროლავს,
  ავტომატური გადართვა თავისით დაიწყება.
*/

const reasonsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (
        entry.isIntersecting &&
        giftOpened &&
        !reasonAutoPlayStarted
      ) {
        startReasonAutoPlay();
      }
    });
  },
  {
    threshold: 0.35
  }
);

reasonsObserver.observe(reasonsSection);

/*
  ფინალური ფანჯრის გახსნა და დახურვა
*/

function openModal() {
  surpriseModal.classList.add("visible");
  surpriseModal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";

  createHeartConfetti();
}

function closeModal() {
  surpriseModal.classList.remove("visible");
  surpriseModal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

finalSurpriseButton.addEventListener("click", openModal);
closeModalButton.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    surpriseModal.classList.contains("visible")
  ) {
    closeModal();
  }
});

/*
  პატარა გულების ეფექტი
*/

function createHeartConfetti() {
  const heartSymbols = ["♥", "♡", "❤"];

  for (let index = 0; index < 32; index += 1) {
    const heart = document.createElement("span");

    heart.className = "confetti-heart";

    heart.textContent =
      heartSymbols[
        Math.floor(Math.random() * heartSymbols.length)
      ];

    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${14 + Math.random() * 22}px`;

    heart.style.color =
      Math.random() > 0.5 ? "#ee7889" : "#f7a6b2";

    heart.style.animationDuration = `${
      2.8 + Math.random() * 2.4
    }s`;

    heart.style.animationDelay = `${
      Math.random() * 0.8
    }s`;

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 6000);
  }
}

/*
  საიტის ჩატვირთვა
*/

insertPersonalData();