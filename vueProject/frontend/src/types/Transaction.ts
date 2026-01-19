export interface Transaction {
  text: string
  date: string
  inputSize: number

  sha256Time: number
  sha256OutputSize: number
  sha256ArbitrumPrice: number
  sha256OptimismPrice: number
  sha256BasePrice: number

  keccak256Time: number
  keccak256OutputSize: number
  keccak256ArbitrumPrice: number
  keccak256OptimismPrice: number
  keccak256BasePrice: number

  aes256Time: number
  aes256OutputSize: number
  aes256ArbitrumPrice: number
  aes256OptimismPrice: number
  aes256BasePrice: number

  rsaTime: number
  rsaOutputSize: number
  rsaArbitrumPrice: number
  rsaOptimismPrice: number
  rsaBasePrice: number
}
