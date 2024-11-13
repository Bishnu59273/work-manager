"use client";
import { useEffect } from "react";
import "@/plugins/custom_css/main.css";

export default function PreLoader() {
  useEffect(() => {
    import("pace-js").then((Pace) => {
      Pace.start();

      console.log("Pace started");

      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.classList.add("isdone");
        console.log("Preloader started class added");
      }

      window.paceOptions = {
        ajax: true,
        document: true,
        eventLag: false,
      };

      Pace.on("done", function () {
        console.log("Pace done - hiding preloader");

        if (preloader) {
          preloader.classList.add("isdone");
          console.log("Preloader hidden");
        }
        const loadingText = document.querySelector(".loading-text");
        if (loadingText) {
          loadingText.classList.add("isdone");
          console.log("Loading text hidden");
        }
      });
    });
  }, []);

  return (
    <div id="preloader">
      <div className="loading-text">Loading...</div>
    </div>
  );
}
