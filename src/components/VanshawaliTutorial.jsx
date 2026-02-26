function VanshawaliTutorial() {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-center">
        वंशावली बनाने का तरीका
      </h2>
      <div className="w-full max-w-3xl aspect-video">
        <iframe
          className="w-full h-full rounded-lg shadow-lg"
          src="https://www.youtube.com/embed/vyLhcRT4v0A?si=dWibIg9THw34TfT3"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default VanshawaliTutorial;