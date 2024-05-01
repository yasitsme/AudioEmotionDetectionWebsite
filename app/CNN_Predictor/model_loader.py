import tempfile
import requests

from tf_keras.models import load_model

def get_CNN():
    model_url = "https://huggingface.co/umop-ap1sdn/CNN_Spectrogram_Emotion/resolve/main/CNN_model.keras"
    model_raw = requests.get(model_url)

    with tempfile.NamedTemporaryFile(delete=True, suffix=".keras") as temp_file:
        temp_file.write(model_raw.content)
        temp_file.flush()
        model1 = load_model(temp_file.name)
    
    return model1