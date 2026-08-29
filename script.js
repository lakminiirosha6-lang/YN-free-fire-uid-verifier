// FREE FIRE UID VERIFY - SG SERVER (Vanilla JS)
async function verifyUID() {
  const uidInput = document.getElementById("uid");
  const button = document.getElementById("verifyBtn");
  const btnText = button.querySelector(".btn-text");
  const btnSpinner = button.querySelector(".btn-spinner");
  
  const resultCard = document.getElementById("resultCard");
  const errorCard = document.getElementById("errorCard");
  const errorIcon = document.getElementById("errorIcon");
  const errorTitle = document.getElementById("errorTitle");
  const errorDesc = document.getElementById("errorDesc");

  const rawUid = uidInput.value.trim();
  const uid = rawUid.replace(/\s+/g, "");

  // Hide previous cards
  resultCard.style.display = "none";
  errorCard.style.display = "none";

  // Validation
  if (!uid) {
    showError("⚠️", "INVALID UID", "Please enter a Free Fire UID.");
    return;
  }

  if (!/^\d+$/.test(uid)) {
    showError("⚠️", "INVALID INPUT", "UID must contain numbers only.");
    return;
  }

  // Loading state
  button.disabled = true;
  btnText.textContent = "Checking Player...";
  btnSpinner.style.display = "inline-block";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10000); // 10s timeout

  try {
    const url = "https://freefireinfo-zy9l.onrender.com/api/v1/player-profile"
      + "?uid=" + encodeURIComponent(uid)
      + "&server=SG";

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("API_ERROR");
    }

    const data = await response.json();

    if (data.message === "Player not found" || !data.basicinfo) {
      throw new Error("PLAYER_NOT_FOUND");
    }

    const player = data.basicinfo;

    // Safe DOM assignment using textContent (No unsafe innerHTML)
    document.getElementById("resNickname").textContent = player.nickname || "Unknown";
    document.getElementById("resUid").textContent = player.accountid || uid;
    document.getElementById("resServer").textContent = "SG / Singapore 🇸🇬";
    document.getElementById("resLevel").textContent = player.level !== undefined ? player.level : "--";
    document.getElementById("resLikes").textContent = player.liked !== undefined ? player.liked : "0";
    document.getElementById("resRank").textContent = player.rank !== undefined ? player.rank : "--";
    document.getElementById("resPoints").textContent = player.rankingpoints !== undefined ? player.rankingpoints : "--";

    resultCard.style.display = "block";

  } catch (error) {
    if (error.name === "AbortError") {
      showError("⚠️", "API TEMPORARILY UNAVAILABLE", "Request timed out. Please try again in a few seconds.");
    } else if (error.message === "PLAYER_NOT_FOUND") {
      showError("❌", "PLAYER NOT FOUND", "Please check the UID and try again.");
    } else {
      showError("⚠️", "API TEMPORARILY UNAVAILABLE", "Please try again in a few seconds.");
    }
  } finally {
    button.disabled = false;
    btnText.textContent = "VERIFY UID";
    btnSpinner.style.display = "none";
  }

  function showError(icon, title, desc) {
    errorIcon.textContent = icon;
    errorTitle.textContent = title;
    errorDesc.textContent = desc;
    errorCard.style.display = "block";
  }
}
