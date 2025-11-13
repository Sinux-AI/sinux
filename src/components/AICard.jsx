export default function AICArd() {
  return (
    <>
      <div id="aiCard">
        <div className="flex flex-row justify-center gap-20 p-10  max-w-400 ">
          <img
            src="https://picsum.photos/200/300"
            alt="this is my image"
            class="rounded-xl"
          />

          <div className="flex flex-col">
            <p className="p-5">stats</p>
            <p className="p-5">name</p>
            <p className="p-5">skill</p>
            <p className="p-5">cost</p>
          </div>
        </div>
      </div>
    </>
  );
}
