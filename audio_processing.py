import assemblyai as aai
import pyaudio
import wave
import re

# Initialize PyAudio
audio = pyaudio.PyAudio()

# Open audio stream
stream = audio.open(format=pyaudio.paInt16, channels=1, rate=44100, input=True, frames_per_buffer=1024)
frames = []

try:
    # Capture audio data until KeyboardInterrupt (Ctrl+C)
    while True:
        data = stream.read(1024)
        frames.append(data)
except KeyboardInterrupt:
    pass

# Stop and close the audio stream
stream.stop_stream()
stream.close()
audio.terminate()

# Save captured audio as a WAV file
sound_file = wave.open("counting_audio.wav", "wb")
sound_file.setnchannels(1)
sound_file.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
sound_file.setframerate(44100)
sound_file.writeframes(b''.join(frames))
sound_file.close()  # Fixed: Add () to properly close the file

# Initialize AssemblyAI transcriber
aai.settings.api_key = "5047b3ccc5d640c699971767f2c08b25"
transcriber = aai.Transcriber()

# Transcribe the audio file
transcript = transcriber.transcribe("counting_audio.wav")

# Extract numeric content from the transcription
input_string = transcript.text
result = re.sub(r'[^0-9]', '', input_string)

# Print the result
print(result)

# Check if the result matches the expected string
if result == '12345678910':
    print('Well Done!')
else:
    print('You got it wrong')