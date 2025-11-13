import AICArd from "../components/AICard";
import HoverFloor from "../components/HoverFloor";

function Agents() {
  return (
    <>
      <div className=" flex-col  flex p-12">
        <p className="text-4xl  align-baseline flex justify-center font-medium">
          View Our Agents
        </p>
      </div>

      <section id="agents">
        <ul className="flex flex-col border-1   border-primary max-w-9/10   ">
          <AICArd />
        </ul>

        <HoverFloor />
      </section>
    </>
  );
}
export default Agents;
