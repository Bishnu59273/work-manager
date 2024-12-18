import "./style/index.css";
// async function Timeout() {
//   await new Promise((resvole) => {
//     setTimeout(resvole, 3000);
//   });
// }

export default async function Home() {
  // await Timeout();
  return (
    <section id="banner">
      <div className="container-fluid p-0">
        <>
          <div className="content">
            <div className="info">
              <p>
                Join us for a fantastic movie night filled with popcorn,
                laughter, and great company! Whether you're a fan of thrilling
                action, heartwarming dramas, or side-splitting comedies, we've
                got a film lineup to cater to all tastes. Save the date and
                bring your favorite snacks to make it a memorable evening.
              </p>
              <button className="btn join">Join</button>
            </div>
          </div>

          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </>
      </div>
    </section>
  );
}
