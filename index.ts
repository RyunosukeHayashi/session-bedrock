import { writeFileSync } from "fs"
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime"

// Amazon Bedrockクライアントを初期化
const client = new BedrockRuntimeClient({ region: "us-east-1" })

const main = async () => {
  console.log("start")

  const input = {
    // stable diffusionのパラメータ
    body: JSON.stringify({
      text_prompts: [
        {
          text: "Beautiful island in the tropics",
        },
      ],
      steps: 50,
    }),
    accept: "application/json",
    contentType: "application/json",
    modelId: "stability.stable-diffusion-xl-v1",
  }

  // Amazon Bedrockに画像生成をリクエスト
  const response = await client.send(new InvokeModelCommand(input))

  // Blob → JSON
  const body = JSON.parse(response.body.transformToString())

  // 成功確認
  if (body.result !== "success") {
    throw new Error("Failed to invoke model")
  }

  // 画像ファイルを出力
  writeFileSync("./out.png", body.artifacts[0].base64, { encoding: "base64" })

  console.log("end")
}

main()
