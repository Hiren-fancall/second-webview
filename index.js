document.addEventListener("DOMContentLoaded", async () => {
  let creatorData = [
    {
      id: 100,
      name: "Hardik Jain",
      image: "https://ik.imagekit.io/fancall/Rectangle%2018864-3.png",
    },
    {
      id: 2,
      name: "Neha Kakkad",
      image: "https://ik.imagekit.io/fancall/Rectangle%2018864-2.png",
    },
    {
      id: 3,
      name: "Pratic Kumar",
      image: "https://ik.imagekit.io/fancall/Rectangle%2018864-1.png",
    },
    {
      id: 4,
      name: "Arya Parmar",
      image: "https://ik.imagekit.io/fancall/Rectangle%2018864.png",
    },
    {
      id: 5,
      name: "Raju Rastogi",
      image: "https://ik.imagekit.io/fancall/Rectangle%2018864-3.png",
    },
    {
      id: 6,
      name: "Ketrina kaif",
      image: "https://ik.imagekit.io/fancall/Rectangle%2018864-2.png",
    },
  ];
  // url params

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const token =
      urlParams.get("token") ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MTEyNyIsImVtYWlsIjoiYWJjMDgyNjE0M0BnbWFpbC5jb20iLCJwaG9uZV9udW1iZXIiOiIxMjM0MTA0NTM3IiwidXNlcm5hbWUiOiJWSUpBWVRFQ0hJREVBUyIsInJvbGVfaWQiOjMsImNlbGVicml0eV90eXBlIjoieW91dHViZXIiLCJjbGllbnRfdG9rZW4iOiI0YjQ3OGI5Ni0yYWYzLTQzNzYtODNmOS03YmFhZDVhYTU4MzMiLCJpYXQiOjE3NTU1OTQ0MDF9.TAkydlaQZxc8Gl6su50hwIKe6dCdAYZZpcunNQ5jKvE";
    console.log("Token:", token);

    // creator data
    const response = await fetch(
      `https://shaggy-seals-retire.loca.lt/api/api/v3/get-web-view-creators`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "x-api-key": "Aman",
          "Content-Type": "text/plain",
          Accept: "*/*",
        },
      }
    );
    const data = await response.json();

    creatorData = data;
    console.log("Creator Data:", creatorData);
  } catch (error) {
    console.error("Error fetching creator data:", error);
  }

  function createCreatorCard(creator) {
    const creatorCard = document.createElement("div");
    creatorCard.className = "creator-card";
    creatorCard.id = `creator-id-${creator.id}`;
    creatorCard.setAttribute("data-id", creator.id);

    // Card inner image and info
    creatorCard.innerHTML = `
      <div class="creator-inner-card">
        <img class="creator-card-img" src="${creator.image}" alt="${creator.name}" />
      </div>
      <div class="creator-card-text" title="${creator.name}">${creator.name}</div>
    `;

    creatorCard.addEventListener("click", () => {
      const creatorId = creatorCard.getAttribute("data-id");
      postMessageToDevice({ id: creatorId, page: "CREATOR-PROFILE" });
    });

    return creatorCard;
  }

  function postMessageToDevice(message) {
    console.log("Posting message to device:", message);
    // For Android
    if (window?.AndroidInterface?.onSubmitPreferences) {
      window?.AndroidInterface?.onSubmitPreferences?.(JSON.stringify(message));
    } else {
      console.error(
        "AndroidInterface not found or onSubmitPreferences method is missing."
      );
    }

    //For IOS
    if (window?.webkit?.messageHandlers?.elementClicked?.postMessage) {
      window?.webkit?.messageHandlers?.elementClicked?.postMessage?.(message);
    } else {
      console.error("WebKit handler not found!");
    }
  }

  // Render creator cards in #creator-list
  const creatorListContainer = document.querySelector("#creator-list");
  if (creatorListContainer) {
    creatorListContainer.innerHTML = "";
    for (let i = 0; i < creatorData.length; i++) {
      const creatorCard = createCreatorCard(creatorData[i]);
      creatorListContainer.appendChild(creatorCard);
    }
  }

  // Image upload and preview logic
  const imageInput = document.getElementById("image-upload");
  const imagePreview = document.getElementById("image-preview");
  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          imagePreview.innerHTML = `<img src="${evt.target.result}" alt="Preview" />`;
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.innerHTML = "";
      }
    });
  }
});
