import { useEffect, useState } from "react"
import * as faceapi from "face-api.js"

async function waitForVideoFrame(videoEl: HTMLVideoElement) {
  if (videoEl.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && videoEl.videoWidth > 0) {
    return
  }

  await new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      cleanup()
      reject(new Error("Video stream did not become ready in time."))
    }, 5000)

    const onLoadedData = () => {
      cleanup()
      resolve()
    }

    const cleanup = () => {
      window.clearTimeout(timeoutId)
      videoEl.removeEventListener("loadeddata", onLoadedData)
    }

    videoEl.addEventListener("loadeddata", onLoadedData, { once: true })
  })
}

export function useFaceApi() {
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [loadError, setLoadError] = useState("")

  useEffect(() => {
    const loadModels = async () => {
      try {
        const modelUrl = "/models"
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(modelUrl),
          faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
          faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
        ])
        setModelsLoaded(true)
        setLoadError("")
      } catch {
        setLoadError("Failed to load face recognition models.")
      }
    }

    void loadModels()
  }, [])

  const extractEmbedding = async (
    videoEl: HTMLVideoElement
  ): Promise<number[] | null> => {
    try {
      await waitForVideoFrame(videoEl)
      const detection = await faceapi
        .detectSingleFace(videoEl, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (!detection) return null
      return Array.from(detection.descriptor)
    } catch {
      return null
    }
  }

  const extractMultipleEmbeddings = async (
    videoEl: HTMLVideoElement,
    count: number = 5,
    intervalMs: number = 500
  ): Promise<number[][] | null> => {
    await waitForVideoFrame(videoEl)

    const embeddings: number[][] = []

    for (let i = 0; i < count; i++) {
      const embedding = await extractEmbedding(videoEl)
      if (embedding) embeddings.push(embedding)
      if (i < count - 1) {
        await new Promise((resolve) => window.setTimeout(resolve, intervalMs))
      }
    }

    return embeddings.length > 0 ? embeddings : null
  }

  return { modelsLoaded, loadError, extractEmbedding, extractMultipleEmbeddings }
}
