from flask import Flask, render_template, request, jsonify
import os, requests

from app.CNN_Predictor import run_predictor


app = Flask(__name__)

# Define the upload folder and allowed extensions
UPLOAD_FOLDER = 'static/uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/run_function', methods=['POST'])
def run():
    res = run_predictor.test_prediction(app.config['UPLOAD_FOLDER'])
    # res = "Hello"
    return jsonify({"message": str(res)})

# Function to ensure upload folder exists
def ensure_upload_folder_exists():
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

ensure_upload_folder_exists()

def allowed_file(filename):
    return filename[-4:] == '.wav'

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if allowed_file(file.filename):
        filename = file.filename
        new_name = 'test.wav'
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], new_name))
        return jsonify({'message': 'File uploaded successfully', 'filename': filename})
    else:
        return jsonify({'error': 'Invalid file type'})
    
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/people')
def people():
    return render_template('people.html')

@app.route('/fetch_blog_content')
def fetch_blog_content():
    url = 'https://medium.com/@yasirh002/unraveling-emotion-through-sound-adeecbc94eea'  # Replace with your Medium blog post URL
    response = requests.get(url)
    if response.status_code == 200:
        return jsonify({'content': response.text})
    else:
        return jsonify({'error': 'Failed to fetch blog post content.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
