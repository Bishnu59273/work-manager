async function Timeout() {
  await new Promise((resvole) => {
    setTimeout(resvole, 3000);
  });
}

export default async function Home() {
  // await Timeout();
  return (
    <div class="container text-center m-5">
      <h1>Index</h1>
    </div>
  );
}
