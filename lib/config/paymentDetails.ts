export const paymentDetails = {
  paystack: {
    testCard: {
      number: "4084 0840 8408 4081",
      expiry: "Any future date",
      cvv: "Any 3 digits"
    }
  },
  bankTransfer: {
    nigerian: {
      bank: "Access Bank",
      accountName: "TipsVendor",
      accountNumber: "1234567890"
    },
    usd: {
      bank: "Bank of America",
      accountName: "TipsVendor LLC",
      accountNumber: "9876543210",
      routingNumber: "123456789",
      swiftBic: "BOFAUS3N"
    }
  },
  mobileMoney: {
    mtn: {
      number: "+233 20 123 4567",
      supportedCountries: ["GHA", "UGA", "CMR"]
    }
  },
  crypto: {
    addresses: {
      btc: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      eth: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      usdt: "TJRabPrwbZy45sbavfcjinPJC18kjpRTv8"
    },
    supportedCoins: [
      { name: "Bitcoin", symbol: "BTC" },
      { name: "Ethereum", symbol: "ETH" },
      { name: "USDT", symbol: "USDT" }
    ]
  }
}; 