var audioContext = new AudioContext();
var analyserNode = null;
var analyserContext = null;
var canvasWidth, canvasHeight;

function updateAnalysers() {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }
    analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
    var bufferLength = analyserNode.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyserNode.getByteTimeDomainData(dataArray);
    analyserContext.lineWidth = 2;
    analyserContext.strokeStyle = '#FFFFFF';
    analyserContext.beginPath();
    var sliceWidth = canvasWidth * 1.0 / bufferLength;
    var x = 0;
    for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0;
        var y = v * canvasHeight / 2;
        if (i === 0) {
            analyserContext.moveTo(x, y);
        } else {
            analyserContext.lineTo(x, y);
        }
        x += sliceWidth;
    }
    analyserContext.lineTo(canvasWidth, canvasHeight / 2);
    analyserContext.stroke();
    requestAnimationFrame(updateAnalysers);
}

function initAudio() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: true }, gotStream, function(e) {
            console.log('Error getting audio: ' + e);
        });
    } else {
        console.log('getUserMedia not supported');
    }
}

function gotStream(stream) {
    var inputPoint = audioContext.createGain();
    var audioStream = audioContext.createMediaStreamSource(stream);
    audioStream.connect(inputPoint);
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect(analyserNode);
    updateAnalysers();
}

window.addEventListener('load', initAudio);

function startRecording() {
    showMessage('Recording started');
    var mediaRecorder;
    var chunks = [];
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function(e) {
                chunks.push(e.data);
            };
            mediaRecorder.onstop = function(e) {
                var blob = new Blob(chunks, { type: 'audio/wav' });
                downloadWav(blob);
                saveAudioLocally(blob);
            };
            mediaRecorder.start();
            setTimeout(function() {
                mediaRecorder.stop();
            }, 5000);
        }).catch(function(err) {
            console.log('Error: ' + err);
        });
}

function saveAudioLocally(blob) {
    var filename = 'recorded_audio.wav';
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}

function downloadWav(blob) {
    showMessage('Recording finished');
    setTimeout(function() {
        showMessage('Recording downloaded');
        setTimeout(function() {
            hideMessage();
        }, 3000);
    }, 1000);
    var link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'recording.wav'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function saveUploadedFile(file) {
    var reader = new FileReader();

    reader.onload = function(event) {
        var fileData = event.target.result;
        var blob = new Blob([fileData], { type: 'audio/wav' });
        var url = URL.createObjectURL(blob);

        var audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = url;
        audioElement.id = 'uploadedAudio';

        var container = document.getElementById('audio-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'audio-container';
            document.body.appendChild(container);
        } else {
            var existingAudio = document.getElementById('uploadedAudio');
            if (existingAudio) {
                container.removeChild(existingAudio);
            }
            var existingFileNameSpan = document.getElementById('uploadedFileName');
            if (existingFileNameSpan) {
                container.removeChild(existingFileNameSpan);
            }
        }

        var fileNameSpan = document.createElement('span');
        fileNameSpan.id = 'uploadedFileName';
        fileNameSpan.textContent = 'Uploaded File: ' + file.name;

        container.appendChild(fileNameSpan);
        container.appendChild(audioElement);
    };

    reader.readAsArrayBuffer(file);
}

function selectWavFile() {
    document.getElementById('fileInput').click(); 

    document.getElementById('fileInput').addEventListener('change', function(event) {
        var file = event.target.files[0];
        
        var formData = new FormData();
        formData.append('file', file);
        
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); 

            var audioElement = document.createElement('audio');
            audioElement.controls = true;
            audioElement.src = data.url;
            var textElement = document.createElement('span');
            textElement.textContent = data.filename; 
        }).catch(error => {
            console.error('Error:', error);
        });
    });
    
    uploadWav(); 
}


function uploadWav() {
    var inputElement = document.getElementById('fileInput');
    inputElement.addEventListener('change', function(event) {
        var selectedFile = event.target.files[0];
        if (!selectedFile) return; 
        
        if (selectedFile.type !== 'audio/wav') {
            showMessage('Invalid file type! Only .wav files are allowed.');
            return;
        }
        saveUploadedFile(selectedFile); 
    });

    inputElement.click();
}

function showMessage(message) {
    var messageElement = document.getElementById('message');
    messageElement.innerHTML = message;
    messageElement.style.opacity = '1';
}

function hideMessage() {
    var messageElement = document.getElementById('message');
    messageElement.style.opacity = '0';
}

function handleFileUpload(input) {
    var file = input.files[0];
    if (file.type !== 'audio/wav') {
        showMessage('Error: Only .wav files are allowed');
        return; 
    }
    showMessage('File uploaded: ' + file.name);
    // handle uploaded .wav file
}
