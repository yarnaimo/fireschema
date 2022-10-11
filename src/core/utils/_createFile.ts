import { mkdir, writeFileSync } from 'fs'

export const createFile = (data: any, filePath: string) => {
  try {
    writeFileSync(filePath, data)
  } catch (err: any) {
    // ディレクトリ作成できなかったとき
    if (err && err.code === 'ENOENT') {
      // ディレクトリ部分だけ切り取り
      const dir = filePath.substring(0, filePath.lastIndexOf('/'))

      // 親ディレクトリ作成
      mkdir(dir, { recursive: true }, (error) => {
        if (error) throw error
        createFile(data, filePath)
      })
      return
    }
    console.log('created')
  }
}
