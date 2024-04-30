import pyaudio
import numpy as np
from PyQt5.QtWidgets import QApplication
from GrapherTool import Plotter as plt
import sys
from config import CONFIG_MIC
from app.FTT import compute_fourier_transform
import time
import pandas as pd
import matplotlib.pyplot as plt

def audiodisplay():
    p = pyaudio.PyAudio()
    stream = p.open(
        format = CONFIG_MIC.SAMPLE_TYPE.value,
        channels = CONFIG_MIC.CHANNELS.value,
        rate=CONFIG_MIC.SAMPLE_RATE.value,
        frames_per_buffer=CONFIG_MIC.BUFSIZE.value,
        input=True
    )
    app = QApplication(sys.argv)
    plot = plt()
    # to capture a frequency, nyquist theorem says that our sample rate must be twice the  
    while True:
        start_time = time.time()
        buffer = stream.read(CONFIG_MIC.BUFSIZE.value)
        numpy_buffer = np.frombuffer(buffer, dtype=np.int16)
        frequencies, magnitudes = compute_fourier_transform(numpy_buffer)
        plot.update_sample_plot(numpy_buffer)
        plot.update_fourier_plot(frequencies, magnitudes)