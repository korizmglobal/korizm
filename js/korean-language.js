/* ===========================================================
   Korizm Korean Language Course — Download Functionality
   =========================================================== */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  // Modal elements
  const modal = $("#downloadModal");
  const downloadForm = $("#downloadForm");
  const downloadBtns = document.querySelectorAll("#downloadBtn, #downloadBtn2, #downloadBtn3");
  const modalClose = $("#modalClose");
  const modalCancelBtn = $("#modalCancelBtn");
  const dlSubmitBtn = $("#dlSubmitBtn");
  const dlMessage = $("#dlMessage");

  // Open modal when download buttons are clicked
  downloadBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    });
  });

  // Close modal
  const closeModal = () => {
    modal.classList.remove("show");
    document.body.style.overflow = "auto";
    downloadForm.reset();
    dlMessage.style.display = "none";
  };

  modalClose.addEventListener("click", closeModal);
  modalCancelBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Handle form submission
  downloadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!downloadForm.checkValidity()) {
      downloadForm.reportValidity();
      return;
    }
    // Initialize EmailJS
    emailjs.init({
      publicKey: "D8QAc9PzthAb9fmsX", // EmailJS public key
      limitRate: {
        id: "korizm_contact_form",
        throttle: 60000, // Limit to 1 email per minute per user
      },
    });

    const name = $("#dlName").value.trim();
    const email = $("#dlEmail").value.trim();
    const phone = $("#dlPhone").value.trim();

    // Disable button and show loading state
    dlSubmitBtn.disabled = true;
    const originalText = dlSubmitBtn.textContent;
    dlSubmitBtn.textContent = "Processing...";

    try {
      // Send email notification using EmailJS
      await emailjs.send(
        "korizm_contact_form",
        "template_korizm",
        {
          to_email: "korizmglobal@gmail.com",
          from_name: name,
          from_email: email,
          phone: phone,
          program: "Korean Language - Study Materials Download",
          message: `User ${name} (${email}, ${phone}) has downloaded the TOPIK study materials.`,
        }
      );

      // Trigger the download
      const link = document.createElement("a");
      link.href = "public/korean-language-course-study-materials.zip";
      link.download = "korean-language-course-study-materials.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      dlMessage.style.display = "block";
      dlMessage.textContent = "✓ Download started! Check your downloads folder.";
      dlMessage.style.color = "#1d7a45";
      dlMessage.style.background = "#e9f7ef";
      dlMessage.style.padding = "12px 16px";
      dlMessage.style.borderRadius = "8px";
      dlMessage.style.marginTop = "12px";

      // Reset button
      dlSubmitBtn.disabled = false;
      dlSubmitBtn.textContent = originalText;

      // Close modal after 2 seconds
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (error) {
      console.error("Error processing download:", error);

      // Show error message
      dlMessage.style.display = "block";
      dlMessage.textContent = "Error processing your request. Please try again.";
      dlMessage.style.color = "#c41e3a";
      dlMessage.style.background = "#ffe9e9";

      // Reset button
      dlSubmitBtn.disabled = false;
      dlSubmitBtn.textContent = originalText;

      // Try to download anyway (email might fail but file should download)
      try {
        const link = document.createElement("a");
        link.href = "public/korean-language-course-study-materials.zip";
        link.download = "korean-language-course-study-materials.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        dlMessage.textContent = "✓ Download started! (Email notification failed, but file is downloading)";
        dlMessage.style.color = "#1d7a45";
        dlMessage.style.background = "#e9f7ef";

        setTimeout(() => {
          closeModal();
        }, 2000);
      } catch (downloadError) {
        console.error("Download error:", downloadError);
      }
    }
  });

  // Allow Enter key to submit
  downloadForm.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      downloadForm.dispatchEvent(new Event("submit"));
    }
  });
})();
