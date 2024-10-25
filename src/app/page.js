import UserForm from "./components/Userform";

async function Timeout() {
  await new Promise((resvole) => {
    setTimeout(resvole, 3000);
  });
}

export default async function Home() {
  // await Timeout();
  return (
    <div className="container text-center m-5">
      <h1>Send details</h1>
      <UserForm />
    </div>
  );
}
