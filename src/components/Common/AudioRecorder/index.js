import { useEffect, useState } from 'react'
import MicRecorder from 'mic-recorder-to-mp3'

const recorder = new MicRecorder({
    bitRate: 128,
})

const AudioRecorder = () => {
    const [audioUrl, setAudioUrl] = useState('')
    const [audioFile, setAudioFile] = useState(null)
    const [isRecording, setIsRecording] = useState(false)
    // const [recorder, setRecorder] = useState(null)

    const startRecording = () => {
        recorder.start()
        setIsRecording(true)
    }

    const stopRecording = () => {
        recorder
            .stop()
            .getMp3()
            .then(([buffer, blob]) => {
                const file = new File(buffer, 'me-at-thevoice.mp3', {
                    type: blob.type,
                    lastModified: Date.now(),
                })
                setAudioFile(blob)
                const url = URL.createObjectURL(blob)
                setAudioUrl(url)
                console.log(blob)
                console.log(url)
            })
            .catch((e) => {
                alert('We could not retrieve your message')
                console.log(e)
            })
        setIsRecording(false)
    }

    return [audioUrl, isRecording, startRecording, stopRecording, audioFile]
}

export default AudioRecorder
