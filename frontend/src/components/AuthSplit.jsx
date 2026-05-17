export default function AuthSplit({ left, right }) {
  return (
    <>
      {/* Left */}
      <div className="w-full md:w-1/2 bg-(--surface) px-6 py-8 sm:px-8 md:px-12 flex flex-col justify-center">
        {left}
      </div>

      {/* Right */}
      <div className="w-full md:w-1/2 bg-(--elevated) px-6 py-8 sm:px-8 md:px-10 flex flex-col justify-center items-center text-center">
        {right}
      </div>
    </>
  );
}
