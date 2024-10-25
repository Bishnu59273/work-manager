async function Timeout() {
  await new Promise((resvole) => {
    setTimeout(resvole, 3000);
  });
}

export default async function Home() {
  // await Timeout();
  return (
    <div className="container text-center">
      <h2>indexx</h2>
    </div>
  );
}
