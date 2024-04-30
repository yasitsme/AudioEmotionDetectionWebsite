import numpy as np
import pyaudio
from app.config import CONFIG_MIC
from app.FTT import compute_fourier_transform

def get_audio_display_data():
    p = pyaudio.PyAudio()
    stream = p.open(
        format=CONFIG_MIC.SAMPLE_TYPE.value,
        channels=CONFIG_MIC.CHANNELS.value,
        rate=CONFIG_MIC.SAMPLE_RATE.value,
        frames_per_buffer=CONFIG_MIC.BUFSIZE.value,
        input=True
    )

    buffer = stream.read(CONFIG_MIC.BUFSIZE.value)
    numpy_buffer = np.frombuffer(buffer, dtype=np.int16)
    frequencies, magnitudes = compute_fourier_transform(numpy_buffer)
    return {'samples': numpy_buffer.tolist(), 'frequencies': frequencies.tolist(), 'magnitudes': magnitudes.tolist()}
