import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const bin = url.searchParams.get("bin")

  if (!bin) {
    return NextResponse.json({ error: "BIN parametresi gerekli" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://lookup.binlist.net/${bin}`, {
      headers: {
        "Accept-Version": "3",
      },
    })

    if (!response.ok) {
      throw new Error(`API yanıt vermedi: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Banka bilgisi alınamadı:", error)
    return NextResponse.json({ error: "Banka bilgisi alınamadı" }, { status: 500 })
  }
}
