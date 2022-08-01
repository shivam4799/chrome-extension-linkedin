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

  // startButton.innerHTML = "Completed";
  // startButton.style.backgroundColor = "#4caf50";

  // allUsers.forEach((u) => {
  //   if (u.querySelector("button span").innerText === "Connect") {
  //     document.querySelectorAll("#main ul li")[0].querySelector("button span").click();
  //     await Sleep(2000)
  //     if (document.querySelectorAll("#artdeco-modal-outlet button")[2].innerText === "Send") {
  //       document.querySelectorAll("#artdeco-modal-outlet button")[2].click();
  //     }
  //   }
  // });

  // chrome.storage.sync.get("color", ({ color }) => {
  //   document.body.style.backgroundColor = color;
  // });
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
        console.log(count, s);
        // for (const frameResult of injectionResults) {
        // let status = frameResult.result;
        if (s === "send") {
          count++;
          // countNumber.innerHTML = Number(countNumber.innerHTML) + 1;

          let countTemp = Number(document.querySelector(".percentage").innerHTML) + 1;

          let t = countTemp * 2;

          document.querySelector(".circle").style.strokeDasharray = `${t},100`;

          document.querySelector(".percentage").innerHTML = countTemp;

          setTimeout(async () => {
            await executeScript();
          }, 3000);
        } else if (s === "complete") {
          startButton.innerHTML = "Start Checking";
          startButton.style.backgroundColor = "#4caf50";
        } else if (s === "false") {
          count++;
          await executeScript();
        } else if (s === "error") {
          error.innerHTML = "Please search Ceo and start process!";
          startButton.innerHTML = "Start Checking";
          startButton.style.backgroundColor = "#4caf50";
        }

        // }
      }
    );
  }
  await executeScript();
  // while (true) {
  // console.log(count);

  // }
});

// The body of this function will be executed as a content script inside the

// current page

// document.querySelectorAll("#main ul li")[0].querySelector("button span").innerText

// document.querySelectorAll("#main ul li")[0].querySelector("button span").click()

// document.querySelectorAll("#artdeco-modal-outlet button")[2].innerText
