export default function AuthSplit({ left, right }) {
  return (
    <>
      {/* Left */}
      <div className="w-1/2 bg-(--surface) px-12 flex flex-col justify-center">
        {left}
      </div>

      {/* Right */}
      <div className="w-1/2 bg-(--elevated) px-10 flex flex-col justify-center items-center text-center">
        {right}
      </div>
    </>
  );
}
