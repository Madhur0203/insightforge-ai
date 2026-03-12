const API_BASE = "http://localhost:8000"

export async function uploadDataset(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData
  })

  return res.json()
}

export async function analyzeDataset(path: string) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      file_path: path
    })
  })

  return res.json()
}
