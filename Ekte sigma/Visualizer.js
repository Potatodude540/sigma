<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Audio Visualizer</title>
    <style>
        canvas { width: 100%; height: 150px; background-color: #222; }
    </style>
</head>
<body>

    <!-- Audio player -->
    <audio id="audio" controls>
        <source src="Erm what the sigma.mp3.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
    
    <!-- Canvas for the visualizer -->
    <canvas id="visualizer"></canvas>

    <script>
        const audio = document.getElementById('audio');
        const canvas = document.getElementById('visualizer');
        const canvasCtx = canvas.getContext('2d');
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaElementSource(audio);

        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 64; // Number of bars
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function draw() {
            requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            const barWidth = canvas.width / dataArray.length;
            dataArray.forEach((value, i) => {
                const barHeight = value / 2;
                const x = i * barWidth;
                canvasCtx.fillStyle = `rgb(${value + 100}, 50, 150)`;
                canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            });
        }

        audio.onplay = () => {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            draw();
        };
    </script>
</body>
</html>
