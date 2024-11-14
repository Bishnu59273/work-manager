"use client";
import { useEffect } from "react";
import "@/plugins/custom_css/main.css";

export default function PreLoader() {
  useEffect(() => {
    import("pace-js").then((Pace) => {
      Pace.start();

      const preloader = document.getElementById("preloader");
      if (preloader) {
        preloader.classList.add("isdone");
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
        }
        const loadingText = document.querySelector(".loading-text");
        if (loadingText) {
          loadingText.classList.add("isdone");
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
