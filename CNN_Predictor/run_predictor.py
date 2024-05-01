from model_loader import get_CNN
from prediction import audio_to_img
from prediction import make_prediction

emotion_map = {0: 'anger', 1: 'boredom', 2: 'disgust', 3: 'fear', 4: 'happiness', 5: 'neutral', 6: 'sadness'}

def get_prediction(image):
    model = get_CNN()

    list = make_prediction(image, model)
    top3 = []
    for i in range(3):
        top3.append(emotion_map[list[i]])
    
    return top3

def test_prediction():
    print(get_prediction(audio_to_img('test.wav')))
