document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".button2")
  const modal = document.getElementById("confirmModal")
  const closeBtn = document.querySelector(".close-button")
  const btn_confirm = document.getElementById("btn_confirm")
  const btn_cancel = document.getElementById("btn-cancel")
  let postId

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault()
      postId = this.form.action.split("/").pop()
      modal.style.display = "block"
    })
  })

  closeBtn.onclick = function () {
    modal.style.display = "none"
  }

  btn_confirm.onclick = function () {
    modal.style.display = "none"
    fetch(`/delete/${postId}`, { method: "POST" }).then((response) => {
      if (response.ok) {
        showMessage("Post deleted successfully.", "success")
        setTimeout(() => (window.location.href = "/"), 1000)
      } else {
        showMessage("Failed to delete the post.", "error")
      }
    })
  }

  btn_cancel.onclick = function () {
    modal.style.display = "none"
    showMessage("Post deletion cancelled.", "error")
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none"
    }
  }
  function showMessage(message, type) {
    const messageBox = document.createElement("div")
    messageBox.classList.add("message", type)
    messageBox.textContent = message

    document.body.appendChild(messageBox)

    // Fade in the message box
    setTimeout(() => {
      messageBox.classList.add("visible")
    }, 100)

    // Fade out the message box after 3 seconds
    setTimeout(() => {
      messageBox.classList.remove("visible")
      // Remove the message box from the DOM after it fades out
      setTimeout(() => {
        document.body.removeChild(messageBox)
      }, 1000)
    }, 3000)
  }
})
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("confirmModal")
  const closeModalButton = document.querySelector(".close-button")
  const cancelButton = document.getElementById("btn_cancel")
  const confirmButton = document.getElementById("btn_confirm")
  const toast = document.getElementById("toast")
  let postIdToDelete

  document.querySelectorAll(".deleteBtn").forEach((button) => {
    button.addEventListener("click", function () {
      postIdToDelete = this.dataset.id
      modal.style.display = "block"
    })
  })

  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none"
  })

  cancelButton.addEventListener("click", () => {
    modal.style.display = "none"
  })

  confirmButton.addEventListener("click", () => {
    fetch(`/delete/${postIdToDelete}`, {
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          showModal()
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          alert("Failed to delete post.")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  })

  function showModal() {
    modal.style.display = "none"
    toast.classList.add("show")
    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }
})
