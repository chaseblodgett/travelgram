export default function FeatureShowcase({ videoSrc, caption, side = true }) {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        side ? '' : 'md:flex-row-reverse'
      } items-center gap-6 bg-gray-900 rounded-2xl shadow-lg overflow-hidden max-w-5xl w-full border border-gray-800 transition-all hover:scale-[1.01] hover:shadow-xl`}
      style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}
    >
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="w-full md:w-1/2 object-cover"
      />
      <div className="flex-1 p-6 text-left">
        <h3 className="text-xl md:text-2xl text-purple-300 font-semibold mb-2">
          {caption.title}
        </h3>
        <p className="text-gray-400 text-sm md:text-base">{caption.description}</p>
      </div>
    </div>
  );
}
