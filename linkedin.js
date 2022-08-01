// Initialize button with user’s preferred color

let startButton = document.getElementById("start");
let countNumber = document.getElementById("count_number");
let error = document.getElementById("error");
let count = 0;

// When the button is clicked, inject setPageBackgroundColor into current page

async function sendingRequest(count) {
  return new Promise((resolve, reject) => {
    let allUsers = document.querySelector(".reusable-search__entity-result-list").querySelectorAll("li");

    if (allUsers && allUsers.length === 0) {
      return resolve("error");
    }
    if (count > allUsers.length - 1) {
      return resolve("complete");
    }

    let followButton = allUsers[count].querySelector("button span");

    // check for Connect and Follow Button Exist
    if (followButton && (followButton.innerText === "Connect" || followButton.innerText === "Follow")) {
      followButton.click();

      setTimeout(() => {
        let modal = document.querySelectorAll("#artdeco-modal-outlet button");

        if (modal.length < 3) {
          return resolve("false");
        }

        if (modal.length === 3) {
          modal[modal.length - 1].click();
          return resolve("send");
        }

        modal[1].click();
        modal[modal.length - 1].click();

        setTimeout(() => {
          modal = document.querySelectorAll("#artdeco-modal-outlet button");
          if (modal.length > 1) {
            modal[modal.length - 1].click();
            return resolve("send");
          }
          return resolve("send");
        }, 1000);
        return resolve("send");
      }, 1000);
    } else {
      if (count >= allUsers.length - 1) {
        return resolve("complete");
      } else {
        setTimeout(() => {
          return resolve("false");
        }, 100);
      }
    }
  });
}

startButton.addEventListener("click", async () => {
  error.innerHTM = "";
  count = 0;
  if (startButton.innerHTML === "Checking Running...") {
    startButton.innerHTML = "Start Checking";
    startButton.style.backgroundColor = "#4caf50";
    return;
  }

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab.url.includes("linkedin")) {
    startButton.innerHTML = "Checking Running...";
    startButton.style.backgroundColor = "#007bff";
  } else {
    error.innerHTML = "Current Page in not Linkedin!";
  }

  async function executeScript() {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        function: sendingRequest,
        args: [count],
      },
      async (injectionResults) => {
        let s = injectionResults[0].result;

        // if request successfully sent
        if (s === "send") {
          count++;
          let countTemp = Number(document.querySelector(".percentage").innerHTML) + 1;
          let t = countTemp * 2;
          document.querySelector(".circle").style.strokeDasharray = `${t},100`;
          document.querySelector(".percentage").innerHTML = countTemp;
          setTimeout(async () => {
            await executeScript();
          }, 3000);
        } else if (s === "complete") {
          // if all users done on page
          startButton.innerHTML = "Start Checking";
          startButton.style.backgroundColor = "#4caf50";
        } else if (s === "false") {
          count++;
          await executeScript();
        } else if (s === "error") {
          //if error occurs
          error.innerHTML = "Please search Ceo and start process!";
          startButton.innerHTML = "Start Checking";
          startButton.style.backgroundColor = "#4caf50";
        }
      }
    );
  }
  await executeScript();
});
